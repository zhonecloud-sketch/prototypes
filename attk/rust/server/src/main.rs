use std::env;
use std::fs::{self, File};
use std::io::{self, Read, Seek, SeekFrom, Write};
use std::net::{IpAddr, Ipv4Addr, TcpListener, TcpStream};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::Arc;
use std::thread;
use std::time::Duration;

const MAX_HEADER: usize = 16 * 1024;

fn decode_path(target: &str) -> Option<String> {
    let encoded = target.split('?').next()?;
    if !encoded.starts_with('/') {
        return None;
    }
    let bytes = encoded.as_bytes();
    let mut decoded = Vec::new();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%' {
            let hex = std::str::from_utf8(bytes.get(i + 1..i + 3)?).ok()?;
            decoded.push(u8::from_str_radix(hex, 16).ok()?);
            i += 3;
        } else {
            decoded.push(bytes[i]);
            i += 1;
        }
    }
    let decoded = String::from_utf8(decoded).ok()?;
    if decoded.contains(['\\', '\0', ':'])
        || decoded.split('/').any(|p| p == ".." || p == ".")
    {
        return None;
    }
    Some(decoded)
}

fn allowed(path: &str) -> bool {
    matches!(
        path,
        "/index.html"
            | "/style.css"
            | "/attk.css"
            | "/start-game-ios.html"
            | "/start-game-android.html"
    ) || ["mjs", "config", "assets", "vendor", "wasm", "docs"]
        .iter()
        .any(|prefix| path.starts_with(&format!("/{prefix}/")))
}

fn resolve(root: &Path, target: &str) -> Option<PathBuf> {
    let mut decoded = decode_path(target)?;
    if decoded == "/" {
        decoded = "/index.html".into();
    }
    if !allowed(&decoded) {
        return None;
    }
    let file = root.join(decoded.trim_start_matches('/')).canonicalize().ok()?;
    if file.starts_with(root) && file.is_file() {
        Some(file)
    } else {
        None
    }
}

fn mime(path: &Path) -> &'static str {
    match path.extension().and_then(|p| p.to_str()).unwrap_or("") {
        "html" => "text/html; charset=utf-8",
        "css" => "text/css; charset=utf-8",
        "mjs" | "js" => "text/javascript; charset=utf-8",
        "json" => "application/json",
        "wasm" => "application/wasm",
        "webp" => "image/webp",
        "png" => "image/png",
        "svg" => "image/svg+xml",
        "mp3" => "audio/mpeg",
        "wav" => "audio/wav",
        "md" | "txt" | "yaml" => "text/plain; charset=utf-8",
        _ => "application/octet-stream",
    }
}

fn range(header: &str, size: u64) -> Option<(u64, u64)> {
    let value = header.strip_prefix("bytes=")?;
    if value.contains(',') || size == 0 {
        return None;
    }
    let (start, end) = value.split_once('-')?;
    if start.is_empty() {
        let length = end.parse::<u64>().ok()?;
        return (length > 0).then_some((size.saturating_sub(length), size - 1));
    }
    let start = start.parse::<u64>().ok()?;
    let end = if end.is_empty() {
        size - 1
    } else {
        end.parse::<u64>().ok()?.min(size - 1)
    };
    (start < size && start <= end).then_some((start, end))
}

fn headers(
    stream: &mut TcpStream,
    status: &str,
    content_type: &str,
    length: u64,
    extra: &str,
) -> io::Result<()> {
    write!(
        stream,
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {length}\r\nCache-Control: no-cache\r\nX-Content-Type-Options: nosniff\r\nConnection: close\r\n{extra}\r\n"
    )
}

fn text_response(
    stream: &mut TcpStream,
    status: &str,
    text: &str,
    head: bool,
    kind: &str,
) -> io::Result<()> {
    headers(stream, status, kind, text.len() as u64, "")?;
    if !head {
        stream.write_all(text.as_bytes())?;
    }
    Ok(())
}

fn handle(mut stream: TcpStream, root: &Path) -> io::Result<()> {
    stream.set_read_timeout(Some(Duration::from_secs(5)))?;
    stream.set_write_timeout(Some(Duration::from_secs(30)))?;
    let mut request = Vec::new();
    let mut buffer = [0; 2048];
    loop {
        let n = stream.read(&mut buffer)?;
        if n == 0 {
            return Ok(());
        }
        request.extend_from_slice(&buffer[..n]);
        if request.len() > MAX_HEADER {
            return text_response(&mut stream, "431 Request Header Fields Too Large", "Header too large", false, "text/plain");
        }
        if request.windows(4).any(|w| w == b"\r\n\r\n") {
            break;
        }
    }
    let request = String::from_utf8_lossy(&request);
    let mut lines = request.split("\r\n");
    let fields: Vec<_> = lines.next().unwrap_or("").split_whitespace().collect();
    if fields.len() != 3 {
        return text_response(&mut stream, "400 Bad Request", "Bad request", false, "text/plain");
    }
    let head = fields[0] == "HEAD";
    if fields[0] != "GET" && !head {
        headers(&mut stream, "405 Method Not Allowed", "text/plain", 0, "Allow: GET, HEAD\r\n")?;
        return Ok(());
    }
    if fields[1].split('?').next() == Some("/health") {
        return text_response(
            &mut stream,
            "200 OK",
            "{\"game\":\"A Tale of the Three Kingdoms\",\"runtime\":\"rust\",\"kernel\":1}",
            head,
            "application/json",
        );
    }
    let Some(path) = resolve(root, fields[1]) else {
        return text_response(&mut stream, "404 Not Found", "Not found", head, "text/plain");
    };
    let mut file = File::open(&path)?;
    let size = file.metadata()?.len();
    let range_header = lines.filter_map(|line| line.split_once(':'))
        .find(|(key, _)| key.eq_ignore_ascii_case("range"))
        .map(|(_, value)| value.trim());
    let (start, length, status, extra) = if let Some(value) = range_header {
        if let Some((start, end)) = range(value, size) {
            (start, end - start + 1, "206 Partial Content",
                format!("Accept-Ranges: bytes\r\nContent-Range: bytes {start}-{end}/{size}\r\n"))
        } else {
            headers(&mut stream, "416 Range Not Satisfiable", "text/plain", 0,
                &format!("Content-Range: bytes */{size}\r\n"))?;
            return Ok(());
        }
    } else {
        (0, size, "200 OK", "Accept-Ranges: bytes\r\n".into())
    };
    headers(&mut stream, status, mime(&path), length, &extra)?;
    if !head {
        file.seek(SeekFrom::Start(start))?;
        io::copy(&mut file.take(length), &mut stream)?;
    }
    Ok(())
}

fn open_browser(url: &str) {
    let result = if cfg!(target_os = "windows") {
        Command::new("cmd").args(["/C", "start", "", url]).spawn()
    } else if cfg!(target_os = "macos") {
        Command::new("open").arg(url).spawn()
    } else {
        Command::new("xdg-open").arg(url).spawn()
    };
    if let Err(error) = result {
        eprintln!("Browser could not open ({error}). Open {url} manually.");
    }
}

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let mut root = env::current_dir()?;
    let mut bind: IpAddr = Ipv4Addr::LOCALHOST.into();
    let mut port: u16 = 8765;
    let mut open = false;
    let mut args = env::args().skip(1);
    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--root" => root = PathBuf::from(args.next().ok_or("Missing --root value")?),
            "--bind" => bind = args.next().ok_or("Missing --bind value")?.parse()?,
            "--port" => port = args.next().ok_or("Missing --port value")?.parse()?,
            "--open" => open = true,
            "--no-open" => open = false,
            "--lan" => bind = Ipv4Addr::UNSPECIFIED.into(),
            "--help" => {
                println!("attk-server [--root FOLDER] [--port 8765] [--bind IP] [--lan] [--open|--no-open]");
                return Ok(());
            }
            _ => return Err(format!("Unknown option: {arg}").into()),
        }
    }
    let root = fs::canonicalize(root)?;
    for required in ["index.html", "wasm/attk_engine.wasm"] {
        if !root.join(required).is_file() {
            return Err(format!("Missing {required}. Run build.bat or sh build.sh.").into());
        }
    }
    // Binding succeeds before any browser is launched. Occupied ports fail.
    let listener = TcpListener::bind((bind, port))?;
    let actual_port = listener.local_addr()?.port();
    let host = if bind.is_unspecified() {
        "127.0.0.1".to_string()
    } else if bind.is_ipv6() {
        format!("[{bind}]")
    } else {
        bind.to_string()
    };
    let url = format!("http://{host}:{actual_port}/index.html");
    println!("A Tale of the Three Kingdoms");
    println!("Rust server: {url}");
    println!("Root: {}", root.display());
    println!("Stop with Ctrl+C. Saves remain in this browser's local storage.");
    if bind.is_unspecified() {
        println!("LAN testing enabled: use this computer's LAN IP and port {actual_port} on the phone.");
    }
    if open {
        open_browser(&url);
    }
    let root = Arc::new(root);
    for stream in listener.incoming() {
        let stream = stream?;
        let root = Arc::clone(&root);
        thread::spawn(move || {
            if let Err(error) = handle(stream, &root) {
                eprintln!("Request ended: {error}");
            }
        });
    }
    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("ATTK could not start: {error}");
        std::process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn traversal_and_source_paths_are_rejected() {
        assert_eq!(decode_path("/%2e%2e/index.html"), None);
        assert_eq!(decode_path("/assets/%5c..%5csecret"), None);
        assert_eq!(decode_path("/config/x%00.json"), None);
        assert_eq!(decode_path("/C:%5csecret"), None);
        assert_eq!(decode_path("/%ZZ"), None);
        assert!(!allowed("/Cargo.toml"));
        assert!(!allowed("/rust/server/src/main.rs"));
        assert!(allowed("/wasm/attk_engine.wasm"));
    }

    #[test]
    fn media_ranges_cover_ios_requests() {
        assert_eq!(range("bytes=0-1", 100), Some((0, 1)));
        assert_eq!(range("bytes=90-", 100), Some((90, 99)));
        assert_eq!(range("bytes=-20", 100), Some((80, 99)));
        assert_eq!(range("bytes=100-", 100), None);
        assert_eq!(range("bytes=0-1,4-5", 100), None);
        assert_eq!(range("bytes=-0", 100), None);
    }
}
