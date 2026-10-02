import { colorOf, POCKET_COUNT } from './roulette.js';

/**
 * Betting rules. Pure functions only -- no I/O, no state, no clocks.
 *
 * Keeping payout maths out of both the socket handler and the browser is the
 * point: the house edge and the paytable are the two things most worth testing
 * and least worth re-implementing per client. The browser gets the winning
 * number and computes its own display, exactly as it computes colour today.
 *
 * `colorOf` and `POCKET_COUNT` are re-exported from roulette.js rather than
 * redefined: red/black coverage and the winning number MUST agree, and two
 * copies of the red set would eventually drift apart.
 */

export { colorOf, POCKET_COUNT };

/**
 * The paytable. Net winnings per unit staked: straight 35:1, dozen 2:1,
 * column 2:1, even money 1:1.
 *
 * Plain numbers rather than arrays: an array implies the odds vary per
 * selection (they do not), and every one of these was only ever read as `[0]`.
 */
const ODDS = Object.freeze({
  straight: 35,
  dozen: 2,
  column: 2,
  low: 1, high: 1, odd: 1, even: 1, red: 1, black: 1,
});

/**
 * Every outside bet loses when 0 comes up. This is the entire house edge on
 * even-money bets (1/37 instead of 1/36) and it is the rule players most often
 * misremember, so it is asserted explicitly in the tests.
 */
export function covers(kind, selection, number) {
  if (!Number.isInteger(number) || number < 0 || number >= POCKET_COUNT) return false;

  switch (kind) {
    case 'straight':
      return number === selection;
    case 'dozen': {
      if (number === 0) return false;
      const index = Math.floor((number - 1) / 12); // 1-12 -> 0, 13-24 -> 1, 25-36 -> 2
      return index === selection;
    }
    case 'column': {
      if (number === 0) return false;
      // Column 0 = 1,4,7…34; column 1 = 2,5,…35; column 2 = 3,6,…36
      return ((number - 1) % 3) === selection;
    }
    case 'low':
      return number >= 1 && number <= 18;
    case 'high':
      return number >= 19 && number <= 36;
    case 'odd':
      return number !== 0 && number % 2 === 1;
    case 'even':
      return number !== 0 && number % 2 === 0;
    case 'red':
      return colorOf(number) === 'red';
    case 'black':
      return colorOf(number) === 'black';
    default:
      return false;
  }
}

/** Total stake coverage, in pockets. 1 for a straight, 12 for a dozen, etc. */
export function coverage(kind) {
  switch (kind) {
    case 'straight': return 1;
    case 'dozen':
    case 'column': return 12;
    case 'low': case 'high': case 'odd': case 'even': case 'red': case 'black':
      return 18;
    default: return 0;
  }
}

/** Odds for a bet: net winnings per unit staked. */
export function oddsFor(kind) {
  return ODDS[kind] ?? 0;
}

/**
 * Gross return on a winning bet, or 0 when it loses. Gross, not net: a straight
 * on 17 at stake 10 returns 360 (10 stake + 350 winnings), and returns 0 — not
 * minus 10 — when 17 does not come up, because the stake is simply not returned.
 */
export function returnFor(kind, selection, stake, number) {
  if (stake <= 0 || !covers(kind, selection, number)) return 0;
  return stake * (oddsFor(kind) + 1);
}

/**
 * House edge per bet type, as a fraction of the stake.
 *
 * Expected return per unit staked = (winning pockets / 37) x (gross return),
 * where 37 is every pocket on a single-zero wheel -- including 0, which loses
 * every outside bet. So:
 *
 *     EV = (coverage / 37) x (odds + 1)      edge = 1 - EV
 *
 * For a straight: (1/37) x 36 = 0.9730 -> 2.70% edge.
 * For even money: (18/37) x 2 = 0.9730 -> 2.70% edge.
 *
 * This is why the paytable cannot be "tidied up": any deviation from these
 * odds shifts the economics, and the drift is invisible without the check.
 */
export function houseEdge(kind) {
  const n = coverage(kind);
  if (n === 0) return 0;
  return 1 - (n / POCKET_COUNT) * (oddsFor(kind) + 1);
}

/**
 * Validate a bet before it is accepted. Returns null when the bet is legal, or
 * a short machine-readable reason when it is not.
 *
 * Kept separate from the ledger so the rules can be tested without a server.
 */
export function validateBet({ kind, selection, stake }, { balance, maxStake = 1000, minStake = 1 }) {
  if (typeof kind !== 'string' || coverage(kind) === 0) return 'unknown_bet';
  if (!Number.isFinite(stake) || !Number.isInteger(stake)) return 'bad_stake';
  if (stake < minStake) return 'below_minimum';
  if (stake > maxStake) return 'above_maximum';
  if (stake > balance) return 'insufficient_funds';

  // `selection` is only meaningful for the bets that have one.
  if (kind === 'straight') {
    if (!Number.isInteger(selection) || selection < 0 || selection >= POCKET_COUNT) return 'bad_selection';
  } else if (kind === 'dozen' || kind === 'column') {
    if (!Number.isInteger(selection) || selection < 0 || selection > 2) return 'bad_selection';
  } else if (selection !== undefined && selection !== null && selection !== '') {
    return 'bad_selection'; // even-money bets take no selection
  }
  return null;
}