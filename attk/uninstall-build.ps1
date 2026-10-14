$ErrorActionPreference = 'Stop'
$ProjectRoot = $PSScriptRoot
if (-not (Test-Path (Join-Path $ProjectRoot 'config\attk.json'))) {
    throw 'ATTK marker is missing. Nothing was removed.'
}
Write-Host 'This removes only target, bin, wasm and dist inside ATTK.'
Write-Host 'Source, RTK2, shared tools and browser saves are retained.'
$Answer = Read-Host 'Type REMOVE to clean generated ATTK files'
if ($Answer -cne 'REMOVE') { exit 0 }
foreach ($Name in @('target', 'bin', 'wasm', 'dist')) {
    $Item = Join-Path $ProjectRoot $Name
    if (Test-Path $Item) {
        $Info = Get-Item $Item -Force
        if ($Info.Attributes -band [IO.FileAttributes]::ReparsePoint) {
            throw "Refusing a linked folder: $Item"
        }
        Remove-Item -LiteralPath $Item -Recurse -Force
    }
}
Write-Host 'Local runtime/build folders removed. Git reports tracked runtime deletions.'
Write-Host 'Restore bin/attk-server.exe and wasm/attk_engine.wasm to play again.'
