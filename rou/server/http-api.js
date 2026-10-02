import fs from 'node:fs';
import path from 'node:path';
import { numberFrom } from './roulette.js';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
  });
  res.end(payload);
};

/**
 * REST + static host.
 *
 * The socket is the fast path for live numbers; this is the durable path. Every
 * native client needs both: a socket alone cannot answer "what was the last 20
 * results?" after a cold start, and a poll-only client cannot animate. Keeping
 * the same engine behind both means the two views can never disagree.
 */
export function createRequestHandler(engine, config, history) {
  const root = path.resolve(config.publicDir);

  return async function handle(req, res) {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const route = url.pathname;

    if (route === '/healthz') {
      return json(res, 200, { ok: true, uptime: process.uptime(), round: engine.current?.roundId ?? null });
    }

    // --- Audit: the round history, for late joiners and dispute resolution ---
    if (route === '/api/history') {
      const limit = Math.min(Number(url.searchParams.get('limit') ?? 20) || 20, config.historyLimit);
      return json(res, 200, { rounds: history.slice(-limit).reverse() });
    }

    // --- Verify: re-derive a number from its revealed seed, server side ------
    if (route.startsWith('/api/verify/')) {
      const id = Number(route.slice('/api/verify/'.length));
      const round = history.find((r) => r.roundId === id);
      if (!round) return json(res, 404, { error: 'unknown round' });
      const derived = numberFrom(round.seed, round.roundId);
      return json(res, 200, {
        roundId: round.roundId,
        declared: round.number,
        derived,
        fair: derived === round.number,
        hash: round.hash,
      });
    }

    // --- Static demo client -------------------------------------------------
    const rel = route === '/' ? 'index.html' : route.replace(/^\/+/, '');
    const file = path.resolve(root, rel);
    // Path traversal guard: resolved path must stay inside the public root.
    if (file !== root && !file.startsWith(root + path.sep)) {
      return json(res, 403, { error: 'forbidden' });
    }
    try {
      const data = await fs.promises.readFile(file);
      res.writeHead(200, {
        'content-type': MIME[path.extname(file)] ?? 'application/octet-stream',
        'content-length': data.length,
        'cache-control': 'no-cache',
      });
      res.end(data);
    } catch {
      json(res, 404, { error: 'not found' });
    }
  };
}