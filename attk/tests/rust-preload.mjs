import fs from 'node:fs';
import {initializeRustKernel} from '../mjs/rust-kernel.mjs';
await initializeRustKernel(fs.readFileSync(new URL('../wasm/attk_engine.wasm',import.meta.url)));
