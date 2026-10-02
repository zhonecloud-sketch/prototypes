import { validateBet, returnFor } from './betting.js';

/**
 * Bet ledger: balances, outstanding bets, and settlement.
 *
 * Money is authoritative here and nowhere else. The browser never decides what
 * it won -- it places a bet, and the server settles against its own recorded
 * bets. A tampered client can therefore at worst place bets it cannot afford.
 *
 * State is per-connection-id and in memory. A real deployment would key this by
 * an authenticated session and persist it (see README).
 */
export class BetLedger {
  #players = new Map(); // playerId -> { balance, bets: Map<roundId, Bet[]> }
  #startingBalance;
  #maxStake;

  constructor({ startingBalance = 1000, maxStake = 1000 } = {}) {
    this.#startingBalance = startingBalance;
    this.#maxStake = maxStake;
  }

  /** Get (or lazily create) a player's account. */
  player(playerId) {
    let p = this.#players.get(playerId);
    if (!p) {
      p = { balance: this.#startingBalance, bets: new Map() };
      this.#players.set(playerId, p);
    }
    return p;
  }

  balanceOf(playerId) {
    return this.player(playerId).balance;
  }

  /** Bets this player has outstanding on `roundId`. */
  betsFor(playerId, roundId) {
    return this.player(playerId).bets.get(roundId) ?? [];
  }

  /**
   * Record a bet. Returns `{ ok, reason?, bets, balance, total }`.
   *
   * Debits the stake immediately so the same funds cannot be committed twice,
   * which is what stops a client from firing a hundred bets at one number to
   * win the house with a single payout.
   */
  place(playerId, roundId, bet) {
    const reason = validateBet(
      { ...bet, stake: bet.stake },
      { balance: this.balanceOf(playerId), maxStake: this.#maxStake }
    );
    if (reason) return { ok: false, reason, balance: this.balanceOf(playerId) };

    const p = this.player(playerId);
    const record = { kind: bet.kind, selection: bet.selection, stake: bet.stake };
    const list = p.bets.get(roundId) ?? [];
    list.push(record);
    p.bets.set(roundId, list);
    p.balance -= bet.stake;

    return { ok: true, bets: list, balance: p.balance, total: totalStaked(list) };
  }

  /**
   * Settle a round: pay out every outstanding bet, clear the round, and return
   * the per-player summary to send back. Winnings are gross returns added to the
   * balance; losing stakes are simply never returned.
   */
  settle(roundId, number) {
    const results = [];
    for (const [playerId, p] of this.#players) {
      const bets = p.bets.get(roundId);
      // Skip players with nothing at stake. `player()` lazily creates accounts,
      // so iterating would otherwise report every account that ever connected --
      // most of which never bet. Settlement results are per-player messages, so
      // an empty one is pure noise on the wire.
      if (!bets || bets.length === 0) continue;

      let returned = 0;
      const winners = [];
      for (const bet of bets) {
        const gross = returnFor(bet.kind, bet.selection, bet.stake, number);
        returned += gross;
        if (gross > 0) winners.push({ kind: bet.kind, selection: bet.selection, gross });
      }

      p.balance += returned;
      p.bets.delete(roundId); // cleared so it cannot be settled twice

      results.push({
        playerId,
        staked: totalStaked(bets),
        returned,
        net: returned - totalStaked(bets),
        balance: p.balance,
        winners,
      });
    }
    return results;
  }

  /**
   * Refund one player's stake on a single round. Called when a socket drops
   * mid-betting: the round will still settle, but this player can no longer see
   * the result, so holding their credits until settlement would be a silent
   * loss from their point of view.
   */
  refundPlayerRound(playerId, roundId) {
    const p = this.#players.get(playerId);
    const bets = p?.bets.get(roundId);
    if (!bets || bets.length === 0) return 0;
    const refunded = totalStaked(bets);
    p.balance += refunded;
    p.bets.delete(roundId);
    return refunded;
  }

  /** Total number of rounds any player still has money committed to. */
  pendingRounds() {
    const ids = new Set();
    for (const p of this.#players.values()) for (const id of p.bets.keys()) ids.add(id);
    return [...ids].sort((a, b) => a - b);
  }
}

/** Sum of all stakes on a list of bets. */
export function totalStaked(bets) {
  let sum = 0;
  for (const b of bets) sum += b.stake;
  return sum;
}