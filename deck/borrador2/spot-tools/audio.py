# Banda sonora del spot "10 SEGUNDOS": música, efectos y voz, sincronizados con CUES de src/spot.js
import sys, wave, numpy as np

SR = 48000
DUR = 22.5
VO_DIR = sys.argv[1]
OUT = sys.argv[2]
N = int(SR * DUR)
rng = np.random.default_rng(3)

C = dict(vo1=0.5, countStart=3.6, abres=3.9, coges=5.8, destapas=7.8, twist=7.95, pop=8.45, bebes=9.6, pour=10.25, pourEnd=12.45, listo=13.0, zero=13.6,
         diez=14.1, pastillas=15.3, polvos=16.4, logo=17.8, vo4=18.4)

music = np.zeros(N); sfx = np.zeros(N); vo = np.zeros(N)

def t_(d): return np.arange(int(SR * d)) / SR
def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= N: return
    x = x[: N - i]
    buf[i:i + len(x)] += x * g
def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
    return e
def lp(x, cut):
    # filtro paso bajo de un polo
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); s = 0.0
    for i in range(len(x)):
        s = (1 - a) * x[i] + a * s; y[i] = s
    return y
def lp_fast(x, cut):
    from numpy.fft import rfft, irfft, rfftfreq
    X = rfft(x); f = rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / cut) ** 4); return irfft(X, len(x))
def hp_fast(x, cut):
    from numpy.fft import rfft, irfft, rfftfreq
    X = rfft(x); f = rfftfreq(len(x), 1 / SR); X *= 1 - 1 / np.sqrt(1 + (f / cut) ** 4); return irfft(X, len(x))
def bp_fast(x, lo, hi): return hp_fast(lp_fast(x, hi), lo)
noise = lambda d: rng.uniform(-1, 1, int(SR * d))

# ---------------- instrumentos
def kick(g=1):
    t = t_(0.45); f = 50 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.16) * g
def snare(g=1):
    n = bp_fast(noise(0.25), 1200, 7000) * env(int(SR * 0.25), 0.001, 0.07)
    t = t_(0.25); tone = np.sin(2 * np.pi * 190 * t) * env(len(t), 0.001, 0.05)
    return (n * 0.8 + tone * 0.5) * g
def hat(g=1): return hp_fast(noise(0.06), 7000) * env(int(SR * 0.06), 0.001, 0.015) * g
def tone(freq, d, kind='saw', a=0.01, r=0.3):
    t = t_(d)
    if kind == 'saw': w = 2 * ((t * freq) % 1) - 1
    elif kind == 'tri': w = 2 * np.abs(2 * ((t * freq) % 1) - 1) - 1
    else: w = np.sin(2 * np.pi * freq * t)
    return w * env(len(t), a, r)
def chord(freqs, d, g=0.12, cut=1800):
    x = sum(tone(f * (1 + 0.003 * k), d, 'saw', 0.02, d * 0.5) for f in freqs for k in (-1, 1))
    return lp_fast(x, cut) * g
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

BPM = 120; beat = 60 / BPM
# 0 – 3.6: colchón suave (acorde abierto)
add(music, chord([mtof(m) for m in (53, 60, 64, 69)], 3.6, 0.10, 900), 0.0)
# 3.6 – 13.6: tensión, bajo pulsante que sube y tic-tac de reloj
for s in range(10):
    at = C['countStart'] + s
    m = 41 + (s // 2)
    add(music, lp_fast(tone(mtof(m), 0.9, 'saw', 0.005, 0.25), 500) * 0.35, at)
    add(music, lp_fast(tone(mtof(m), 0.4, 'saw', 0.005, 0.15), 500) * 0.22, at + 0.5)
    tick = hp_fast(noise(0.03), 2500) * env(int(SR * 0.03), 0.0005, 0.006)
    add(sfx, tick, at, 0.55); add(sfx, bp_fast(noise(0.03), 900, 2500) * env(int(SR * 0.03), 0.0005, 0.006), at + 0.5, 0.45)
    add(music, hat(0.15), at + 0.25); add(music, hat(0.15), at + 0.75)
# riser antes del cero
t = t_(1.6); add(music, lp_fast(noise(1.6) * (t / 1.6) ** 2, 4000) * 0.25, C['zero'] - 1.6)
# 13.6 – 17.8: entra el ritmo completo
prog = [(53, 57, 60, 64), (52, 55, 59, 62), (50, 53, 57, 60), (48, 52, 55, 59)]
start = C['zero']; bars_end = 22.3
i = 0; at = start
while at < bars_end:
    add(music, kick(0.9), at)
    if i % 2 == 1: add(music, snare(0.5), at)
    add(music, hat(0.22), at + beat / 2)
    if i % 4 == 0:
        ch = prog[(i // 4) % 4]
        add(music, chord([mtof(m) for m in ch], beat * 4, 0.09, 2200), at)
        add(music, lp_fast(tone(mtof(ch[0] - 12), beat * 3.8, 'saw', 0.005, 0.6), 400) * 0.4, at)
    at += beat; i += 1
# acorde final que respira
add(music, chord([mtof(m) for m in (53, 60, 64, 67, 72)], 3.0, 0.12, 3000), 19.5)

# ---------------- efectos
def creak(d=0.7):
    t = t_(d); f = 180 + 120 * np.sin(2 * np.pi * 3 * t)
    return lp_fast(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3, 1500) * env(len(t), 0.05, 0.4)
add(sfx, creak(), C['abres'], 0.35)
add(sfx, lp_fast(noise(0.15), 900) * env(int(SR * 0.15), 0.001, 0.05), C['abres'] + 0.05, 0.7)    # succión de la goma
add(sfx, np.sin(2 * np.pi * 60 * t_(1.6)) * np.minimum(1, t_(1.6) * 4) * np.exp(-t_(1.6) * 1.5) * 0.12, C['abres'] + 0.1)  # zumbido
def whoosh(d=0.5, up=True):
    n = noise(d); t = t_(d)
    shape = np.sin(np.pi * t / d) ** 2
    return bp_fast(n, 400, 3500) * shape
add(sfx, whoosh(0.6), C['coges'] + 0.1, 0.5)
click = hp_fast(noise(0.02), 3000) * env(int(SR * 0.02), 0.0003, 0.004)
# el tapón se desenrosca: carraca en tres giros
for k in range(3):
    for j in range(4):
        add(sfx, click, C['twist'] + k * 0.16 + j * 0.02, 0.7)
# "plop" al soltarse + chasquido
t = t_(0.14); pop = np.sin(2 * np.pi * np.cumsum(220 + 1200 * t / 0.14) / SR) * env(len(t), 0.001, 0.06)
add(sfx, pop, C['pop'], 0.9)
add(sfx, bp_fast(noise(0.08), 1500, 6000) * env(int(SR * 0.08), 0.001, 0.02), C['pop'], 0.5)
# vertido: chorro (ruido filtrado que se vuelve más agudo al llenarse) + gluglús + salpicaduras
d = C['pourEnd'] - C['pour'] + 0.3
n = noise(d); tt = t_(d)
lo = bp_fast(n, 300, 1400) ; hi = bp_fast(n, 900, 3200)
mixp = (lo * (1 - tt / d) + hi * (tt / d)) * np.minimum(1, tt / 0.08) * np.minimum(1, (d - tt) / 0.2)
add(sfx, mixp, C['pour'], 0.55)
for k in range(14):
    t = t_(0.1); f = 220 + k * 40 + 400 * t / 0.1
    g = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.004, 0.035)
    add(sfx, g, C['pour'] + 0.1 + k * 0.155, 0.35)
# cero: sello + campanilla
add(sfx, kick(1.2), C['zero'], 0.9)
add(sfx, bp_fast(noise(0.1), 800, 4000) * env(int(SR * 0.1), 0.001, 0.03), C['zero'], 0.7)
for j, m in enumerate((84, 88, 91, 96)):
    add(sfx, tone(mtof(m), 1.2, 'sine', 0.003, 0.4) * 0.18, C['zero'] + 0.1 + j * 0.06)
# golpes de las tarjetas
for k in ('diez', 'pastillas', 'polvos'):
    add(sfx, whoosh(0.22), C[k] - 0.2, 0.4)
    add(sfx, kick(1), C[k] + 0.2, 0.8)
    add(sfx, bp_fast(noise(0.12), 600, 5000) * env(int(SR * 0.12), 0.001, 0.04), C[k] + 0.2, 0.6)
# rodillo de imprenta
d = 0.85; n = lp_fast(noise(d), 600) * np.sin(np.pi * t_(d) / d)
add(sfx, n, C['logo'], 0.6)
for j in range(int(d / 0.075)):
    add(sfx, tone(320 + (j % 2) * 90, 0.04, 'saw', 0.0005, 0.01) * 0.25, C['logo'] + j * 0.075)
for j in range(5):  # caen los botes
    add(sfx, kick(0.6), C['logo'] + 0.9 + j * 0.12 + 0.55, 0.45)

# ---------------- voz
def readwav(p):
    with wave.open(p) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    return x
for k in ('vo1', 'abres', 'coges', 'destapas', 'bebes', 'listo', 'diez', 'pastillas', 'polvos', 'vo4'):
    x = readwav(f'{VO_DIR}/{k}.wav')
    at = C[k] + (0.0 if k in ('vo1', 'vo4') else 0.12)
    add(vo, x, at, 1.0)

# ducking: la música baja cuando habla la voz
envv = np.abs(vo); win = int(SR * 0.15)
envv = np.convolve(envv, np.ones(win) / win, mode='same')
duck = 1 - 0.55 * np.clip(envv * 8, 0, 1)
tt = np.arange(N) / SR
mgain = np.where(tt < C['zero'], 1.0, 0.45)
mgain = np.convolve(mgain, np.ones(2400) / 2400, mode='same')
sgain = np.where(tt < C['zero'], 1.6, 0.7)
mix = music * 0.85 * mgain * duck + sfx * 0.9 * sgain + vo * 1.25
# fundido final
fade = np.ones(N); fl = int(SR * 0.8); fade[-fl:] = np.linspace(1, 0, fl); mix *= fade
mix = np.tanh(mix * 1.1)  # saturación suave
mix /= np.max(np.abs(mix)) / 0.89
stereo = np.stack([mix, mix], 1)
with wave.open(OUT, 'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((stereo * 32767).astype(np.int16).tobytes())
print('ok', OUT)
