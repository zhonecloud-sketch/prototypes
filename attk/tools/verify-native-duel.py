"""Run bounded opening-challenge and personal-combat witnesses in main.exe.

Usage: python tools/verify-native-duel.py MAIN.EXE OUTPUT.json
Requires repository-local Unicorn. No executable bytes are exported.
"""
import argparse
import hashlib
import importlib.util
import json
import struct
from pathlib import Path

from unicorn import Uc, UC_ARCH_X86, UC_MODE_16, UC_HOOK_CODE
from unicorn.x86_const import *

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('main_exe', type=Path)
p.add_argument('output', type=Path)
a = p.parse_args()
spec = importlib.util.spec_from_file_location(
    'original', Path(__file__).with_name('verify-original.py'))
original = importlib.util.module_from_spec(spec)
spec.loader.exec_module(original)
raw = a.main_exe.read_bytes()
assert hashlib.sha256(raw).hexdigest() == original.EXPECTED
image = bytes(original.unpack(raw)[0])
DS = 0x2fa60
cases = []


def run(start, args, setup, hooks, observe=None):
    u = Uc(UC_ARCH_X86, UC_MODE_16)
    u.mem_map(0, 0x100000)
    u.mem_write(0, image)
    u.reg_write(UC_X86_REG_DS, DS // 16)
    u.reg_write(UC_X86_REG_SS, DS // 16)
    u.reg_write(UC_X86_REG_SP, 0xff00)

    def w(at, fmt, *values):
        u.mem_write(DS + at, struct.pack('<' + fmt, *values))

    def word(at):
        return struct.unpack('<H', u.mem_read(DS + at, 2))[0]

    def byte(at):
        return u.mem_read(DS + at, 1)[0]

    w(0xff00, 'H' * (len(args) + 2), 0, 0x6000, *args)
    setup(u, w)
    seen = []

    def hook(u, at, size, data):
        if at == 0x60000:
            u.emu_stop()
            return
        if observe:
            observe(at, word, byte, seen)
        if at not in hooks:
            return
        sp = u.reg_read(UC_X86_REG_SP)
        ip, cs = struct.unpack('<2H', u.mem_read(DS + sp, 4))
        value = hooks[at](w, word, byte, sp, seen)
        u.reg_write(UC_X86_REG_AX, value or 0)
        u.reg_write(UC_X86_REG_SP, sp + 4)
        u.reg_write(UC_X86_REG_CS, cs)
        u.reg_write(UC_X86_REG_IP, ip)

    u.hook_add(UC_HOOK_CODE, hook)
    cs = 0x49c if start < 0x6000 else 0x2878
    u.reg_write(UC_X86_REG_CS, cs)
    u.reg_write(UC_X86_REG_IP, start - cs * 16)
    try:
        u.emu_start(start, 0x60001, count=1000000)
    except Exception as error:
        raise RuntimeError(hex(u.reg_read(UC_X86_REG_CS) * 16 +
                               u.reg_read(UC_X86_REG_IP))) from error
    assert u.reg_read(UC_X86_REG_CS) == 0x6000, hex(
        u.reg_read(UC_X86_REG_CS) * 16 + u.reg_read(UC_X86_REG_IP))
    return u.reg_read(UC_X86_REG_AX) & 255, seen, word, byte


def zero(*args):
    return 0


for bound in [0, 1, 2, 20]:
    draws = []

    def rng(w, word, byte, sp, seen):
        draws.append(17)
        return 17

    value, _, _, _ = run(0x4b38, [bound], lambda *args: None,
                         {0x4afe: rng})
    assert value == (17 % bound if bound >= 2 else 0)
    assert len(draws) == int(bound >= 2)
    cases.append(dict(rule='rng-small-bound', bound=bound,
                      value=value, draws=len(draws)))


# Execute the complete ten-round duel, ordinary (non-covert) participants.
# Only the intro, text, tile redraw, BIOS wait and RNG sources are bounded.
for defend, attack, compromised in [
        (d, a, c) for d, a in [(91, 90), (100, 50), (50, 100), (80, 80),
                              (0, 0), (75, 95), (95, 75), (1, 100), (100, 1)]
        for c in [False, True]]:
    for fraction in [0, .5, .99]:
        draws, delays, rounds = [], [], []

        def setup(u, w):
            w(0xb8f8, 'HH', 0x9000, 0x9100)
            for ptr, war, cell in [(0x9000, defend, 0x24),
                                   (0x9100, attack, 0x84)]:
                w(ptr, 'H', 0)
                w(ptr + 2, 'BB', 0, 0)
                w(ptr + 5, 'B', war)
                w(ptr + 0x18, 'B', cell)
            if compromised:
                w(0x9002, 'B', 4)
                w(0x900d, 'B', 1)
                w(0x910a, 'B', 1)
            w(0xb8cc, 'BB', defend, attack)
            w(0x352c, 'H', 1)
            w(0x33b4, 'B', 0)

        def rng(w, word, byte, sp, seen):
            bound = word(sp + 4) & 255
            value = int(bound * fraction)
            draws.append({'bound': bound, 'value': value,
                          'consumesRandom': bound >= 2})
            return value

        def delay(w, word, byte, sp, seen):
            delays.append(word(sp + 4))

        def observe(at, word, byte, seen):
            if at == 0x29396:
                rounds.append([byte(0xb8cc), byte(0xb8cd)])

        result, _, _, _ = run(0x293aa, [], setup, {
            0x291c2: zero, 0x4450: zero, 0x45d8: zero,
            0x2361e: zero, 0x58ba: rng, 0x581e: delay,
            0x5856: zero,
        }, observe)
        assert len(rounds) <= 10
        assert delays == [v for _ in rounds for v in [*([1] * 32), 20]]
        cases.append(dict(rule='covert-duel' if compromised else 'ordinary-duel',
                          compromised=compromised, defend=defend, attack=attack,
                          fraction=fraction, result=result, rounds=rounds,
                          draws=draws, delays=delays))

# The opening coordinator asks defender (native side 0), then attacker (2).
for first in [False, True]:
    calls = []

    def setup(u, w):
        w(0xb8d5, 'B', 0)

    def offer(w, word, byte, sp, seen):
        side, response = word(sp + 4), word(sp + 6)
        calls.append([side, response])
        return int(first and response == 0)

    run(0x297b6, [], setup, {0x23ffa: zero, 0x28fd6: offer,
                            0x28dea: zero, 0x296ea: zero})
    assert calls == ([[0, 0], [2, 1]] if first else [[0, 0], [2, 0]])
    cases.append(dict(rule='opening-order', initiates=first, calls=calls))

for side in [0, 2]:
    for war, ambition, expected in [(74, 100, False), (75, 79, False),
                                     (75, 80, True), (100, 100, True)]:
        for succeeds in [False, True]:
            def setup(u, w):
                w(0xcb76 + side * 10, 'H', 0x9000)
                w(0x9000, 'H', 0x9100)
                w(0x9100, 'H', 0)
                w(0x9105, 'B', war)
                w(0x9109, 'B', ambition)

            result, _, word, _ = run(0x28f04, [side], setup,
                {0x589c: lambda *args: int(succeeds)})
            assert result == int(expected and succeeds)
            if result:
                assert word(0xb8f8 + side) == 0x9100
            cases.append(dict(rule='volunteer', side=side, war=war,
                ambition=ambition, chanceSucceeds=succeeds, result=result))

for side in [0, 2]:
    for response, leader, subordinate, opposing, selected in [
            (0, 100, 89, 70, None), (0, 100, 90, 70, 0x9100),
            (1, 90, 70, 70, 0x9000), (1, 89, 74, 70, None),
            (1, 89, 75, 70, 0x9100)]:
        def setup(u, w):
            w(0xcb76 + side * 10, 'H', 0x9000)
            w(0x9000, 'H', 0x9100)
            w(0x9100, 'H', 0)
            w(0x9005, 'B', leader)
            w(0x9105, 'B', subordinate)
            w(0xb8f8 + (2 - side), 'H', 0x9200)
            w(0x9205, 'B', opposing)

        result, _, word, _ = run(0x28aa0, [side, response], setup, {})
        assert result == int(selected is not None), (side, response, leader,
            subordinate, opposing, selected, result, hex(word(0xb8f8 + side)))
        if result:
            assert word(0xb8f8 + side) == selected
        cases.append(dict(rule='ai-candidate', side=side, response=response,
            leader=leader, subordinate=subordinate, opposing=opposing,
            selected=selected, result=result))

for war, opposing in [(80, 85), (85, 80), (0, 100), (99, 100)]:
    def setup(u, w):
        w(0xb8f8, 'HH', 0x9000, 0x9100)
        w(0x9005, 'B', war)
        w(0x9105, 'B', opposing)

    _, _, _, byte = run(0x294d6, [0x9000, 0], setup,
                        {0x24022: zero, 0x45d8: zero})
    expected = (war + opposing + 1) // 2 if opposing > war else war
    assert byte(0x9005) == expected
    cases.append(dict(rule='victorious-war-gain', war=war, opposing=opposing,
                      final=expected))

for side in [0, 2]:
    for war in [1, 74, 79, 80, 100]:
        def setup(u, w):
            w(0xcb76 + side * 10, 'H', 0x9000)
            w(0xcb7a + side * 10, 'H', 0)
            w(0x9000, 'H', 0x9100)
            w(0x9100, 'H', 0)
            for ptr in [0x9000, 0x9100]:
                w(ptr + 5, 'B', war)
                w(ptr + 9, 'B', 0)

        result, _, word, byte = run(0x28fd6, [side, 0], setup, {
            0x238fa: lambda *args: 1, 0x24022: zero, 0x23ffa: zero,
            0x45b0: zero, 0x45d8: zero, 0x28d68: lambda *args: 2,
            0x48a2: lambda *args: 1, 0x48c6: lambda *args: 1,
            0x4914: lambda *args: 1, 0x28922: zero,
        })
        assert result == 1 and word(0xb8f8 + side) == 0x9000
        assert byte(0xb8cc + side // 2) == war
        cases.append(dict(rule='human-opening-no-war-threshold', side=side,
                          war=war, selected='leader', result=result))

for side in [0, 2]:
    for fraction in [0, .5, .99]:
        draws = []

        def setup(u, w):
            w(0xcb76 + side * 10, 'H', 0x9000)
            w(0x9000, 'H', 0x9100)
            w(0x9100, 'H', 0)
            for ptr in [0x9000, 0x9100]:
                w(ptr + 0x12, 'H', 5000)
                w(ptr + 0x14, 'H', 4000)

        def rng(w, word, byte, sp, seen):
            bound = word(sp + 4) & 255
            value = int(bound * fraction)
            draws.append(value)
            return value

        _, _, word, _ = run(0x296ea, [side, 2 - side], setup, {
            0x24022: zero, 0x45b0: zero, 0x24466: zero,
            0x581e: zero, 0x583c: zero,
            0x28922: zero, 0x58ba: rng,
        })
        remaining = [word(ptr + 0x12) for ptr in [0x9000, 0x9100]]
        assert remaining == [5000 * (95 - draws[0]) // 100] * 2, (draws, remaining)
        weapons = [word(ptr + 0x14) for ptr in [0x9000, 0x9100]]
        cases.append(dict(rule='refusal', side=side, fraction=fraction,
                          draws=draws, remaining=remaining, weapons=weapons))

a.output.write_text(json.dumps(dict(originalSha256=original.EXPECTED,
    limits='Bounded text, intro, tile redraw, BIOS waits and RNG. Ordinary '
           'and covert duels; full DOS graphics excluded.',
    biosTickMs=65536 * 1000 / 1193182, cases=cases), indent=2) + '\n')
print(f'PASS {len(cases)} native personal-combat witnesses')
