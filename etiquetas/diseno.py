"""Label artwork for the Puleva Health bottles.

Artwork is drawn once per bottle in *bottle coordinates*: x in mm around the
circumference measured at the bottle's reference radius (0 = front centre) and
y = Y0 - z, with z the height on the bottle in mm. Every label piece shows the
window of that artwork that falls on it, so backgrounds continue across pieces.
Texts, seals and badges are placed per piece in true millimetres.
"""
from __future__ import annotations

import math
import random

Y0 = 120.0
NAVY = "#1d3f8c"
PULEVA_BLUE = ("#3462b4", "#1f3f88")


def Y(z):
    return Y0 - z


# ------------------------------------------------------------------ helpers
def blob(x, y, r, color, rng, k=9, jitter=0.35, opacity=1.0):
    pts = []
    for i in range(k):
        a = 2 * math.pi * i / k
        rr = r * (1 + rng.uniform(-jitter, jitter))
        pts.append((x + rr * math.cos(a), y + rr * math.sin(a)))
    d = f"M{(pts[0][0] + pts[-1][0]) / 2:.2f},{(pts[0][1] + pts[-1][1]) / 2:.2f}"
    for i in range(k):
        p, q = pts[i], pts[(i + 1) % k]
        d += f" Q{p[0]:.2f},{p[1]:.2f} {(p[0] + q[0]) / 2:.2f},{(p[1] + q[1]) / 2:.2f}"
    out = f"<path d='{d}Z' fill='{color}' opacity='{opacity}'/>"
    for _ in range(rng.randint(2, 4)):
        a = rng.uniform(0, 2 * math.pi)
        dist = r * rng.uniform(1.15, 1.8)
        out += (f"<circle cx='{x + dist * math.cos(a):.2f}' cy='{y + dist * math.sin(a):.2f}' "
                f"r='{r * rng.uniform(.08, .22):.2f}' fill='{color}' opacity='{opacity}'/>")
    return out


def sparkle(x, y, s, color="#fff", op=0.9):
    return (f"<path d='M{x},{y - s} Q{x + s * .12},{y - s * .12} {x + s},{y} Q{x + s * .12},{y + s * .12} {x},{y + s} "
            f"Q{x - s * .12},{y + s * .12} {x - s},{y} Q{x - s * .12},{y - s * .12} {x},{y - s}Z' fill='{color}' "
            f"opacity='{op}'/>")


def flare(x, y, s, core="#ffffff", glow="#5fe0ff"):
    return (f"<circle cx='{x}' cy='{y}' r='{s * 2.4}' fill='url(#flareG)' opacity='.85'/>"
            f"<rect x='{x - s * 4}' y='{y - s * .05}' width='{s * 8}' height='{s * .1}' fill='url(#rayH)'/>"
            f"<rect x='{x - s * .05}' y='{y - s * 3}' width='{s * .1}' height='{s * 6}' fill='url(#rayV)'/>"
            f"<circle cx='{x}' cy='{y}' r='{s * .35}' fill='{core}'/>")


FLARE_DEFS = ("<radialGradient id='flareG'><stop offset='0' stop-color='#fff' stop-opacity='1'/>"
              "<stop offset='.25' stop-color='#8ff0ff' stop-opacity='.7'/>"
              "<stop offset='1' stop-color='#2fbfff' stop-opacity='0'/></radialGradient>"
              "<linearGradient id='rayH'><stop offset='0' stop-color='#bff6ff' stop-opacity='0'/>"
              "<stop offset='.5' stop-color='#fff'/><stop offset='1' stop-color='#bff6ff' stop-opacity='0'/>"
              "</linearGradient><linearGradient id='rayV' x2='0' y2='1'>"
              "<stop offset='0' stop-color='#bff6ff' stop-opacity='0'/><stop offset='.5' stop-color='#fff'/>"
              "<stop offset='1' stop-color='#bff6ff' stop-opacity='0'/></linearGradient>")


def strawberry(x, y, s, rot=0):
    body = ("M0,-.95 C.95,-1.15 1.25,-.25 .92,.42 C.62,1.02 .22,1.42 0,1.58 C-.22,1.42 -.62,1.02 -.92,.42 "
            "C-1.25,-.25 -.95,-1.15 0,-.95Z")
    seeds = ""
    for row in range(6):
        for col in range(-3, 4):
            sx, sy = col * .32 + (.16 if row % 2 else 0), -.62 + row * .36
            if abs(sx) < 1.0 - max(0, sy) * .55:
                seeds += (f"<path d='M{sx:.2f},{sy - .07:.2f} q.05,.09 0,.15 q-.05,-.06 0,-.15Z' fill='#ffe58a'/>"
                          f"<circle cx='{sx - .03:.2f}' cy='{sy + .04:.2f}' r='.06' fill='#8b0016' opacity='.35'/>")
    calyx = "".join(f"<path d='M0,-.95 Q{.25 * math.cos(math.radians(a - 90)):.2f},{-1.05 + .25 * math.sin(math.radians(a - 90)):.2f}"
                    f" {.62 * math.cos(math.radians(a - 90)):.2f},{-.95 + .5 * math.sin(math.radians(a - 90)) * .35:.2f}"
                    f" Q{.2 * math.cos(math.radians(a - 80)):.2f},{-.9:.2f} 0,-.95Z' fill='#2f8f3a' stroke='#1d6b27' "
                    f"stroke-width='.03'/>" for a in (-75, -35, 0, 35, 75, 180))
    return (f"<g transform='translate({x},{y}) rotate({rot}) scale({s})' filter='url(#fShadow)'>"
            f"<path d='{body}' fill='url(#strawG)'/><path d='{body}' fill='url(#strawEdge)'/>{seeds}"
            f"<ellipse cx='-.42' cy='-.3' rx='.2' ry='.42' fill='#fff' opacity='.45' filter='url(#soft)'/>{calyx}"
            f"<path d='M0,-1 q.1,-.35 .32,-.48' stroke='#2f7a2c' stroke-width='.1' fill='none'/></g>")


def berry(x, y, s, grad="blueG", crown="#1d1d55"):
    star = " ".join(f"{.22 * math.cos(a):.3f},{.22 * math.sin(a):.3f} {.09 * math.cos(a + .63):.3f},"
                    f"{.09 * math.sin(a + .63):.3f}" for a in [i * 2 * math.pi / 5 for i in range(5)])
    return (f"<g transform='translate({x},{y}) scale({s})' filter='url(#fShadow)'><circle r='1' fill='url(#{grad})'/>"
            f"<circle r='1' fill='url(#bloom)'/>"
            f"<g transform='translate(.28,-.55) rotate(-20)'><circle r='.26' fill='{crown}'/>"
            f"<polygon points='{star}' fill='#4b4f9e'/></g>"
            f"<ellipse cx='-.38' cy='-.32' rx='.22' ry='.15' fill='#fff' opacity='.65' filter='url(#soft)'/></g>")


def drupe(x, y, s, grad="raspG"):
    cells = []
    for cy, n, w in [(-.78, 3, .55), (-.42, 5, .85), (-.05, 5, .95), (.32, 5, .88), (.66, 4, .62), (.92, 2, .3)]:
        for i in range(n):
            cx = -w + 2 * w * i / (n - 1) if n > 1 else 0
            cells.append((cy, cx))
    out = "".join(f"<circle cx='{cx:.2f}' cy='{cy:.2f}' r='.27' fill='url(#{grad})'/>"
                  f"<circle cx='{cx - .08:.2f}' cy='{cy - .09:.2f}' r='.06' fill='#fff' opacity='.75'/>"
                  for cy, cx in sorted(cells))
    return (f"<g transform='translate({x},{y}) scale({s})' filter='url(#fShadow)'>"
            f"<ellipse rx='1.05' ry='1.12' fill='url(#{grad}Base)'/>{out}</g>")


def grape(x, y, s):
    return (f"<g transform='translate({x},{y}) scale({s})' filter='url(#fShadow)'><ellipse rx='.88' ry='1' "
            f"fill='url(#grapeG)'/><ellipse cx='-.3' cy='-.4' rx='.2' ry='.32' fill='#fff' opacity='.7' "
            f"filter='url(#soft)'/><circle cx='.05' cy='-.98' r='.07' fill='#6b7f2a'/></g>")


def banana(x, y, s, rot=0):
    return (f"<g transform='translate({x},{y}) rotate({rot}) scale({s})' filter='url(#fShadow)'>"
            f"<path d='M-.3,-3 C.9,-2 1.2,.6 .1,2.8 C.5,.6 .2,-1.6 -.75,-2.8Z' fill='url(#banG)' stroke='#c98d00' "
            f"stroke-width='.06'/><path d='M-.45,-2.6 C.5,-1.6 .7,.4 .05,2.2' stroke='#fff6c0' stroke-width='.12' "
            f"fill='none' opacity='.7'/><path d='M-.3,-3 l-.45,.2 .1,.3Z' fill='#6b4a16'/>"
            f"<circle cx='.1' cy='2.8' r='.12' fill='#6b4a16'/></g>")


def orange_slice(x, y, s, rot=0):
    seg = "".join(f"<path d='M0,0 L{.8 * math.cos(a):.3f},{.8 * math.sin(a):.3f} A.8 .8 0 0 1 "
                  f"{.8 * math.cos(a + .62):.3f},{.8 * math.sin(a + .62):.3f}Z' fill='url(#segG)'/>"
                  for a in [i * 2 * math.pi / 9 + .04 for i in range(9)])
    return (f"<g transform='translate({x},{y}) rotate({rot}) scale({s})' filter='url(#fShadow)'>"
            f"<circle r='1' fill='#ff8c1a'/><circle r='.9' fill='#fff1d0'/>{seg}<circle r='.1' fill='#fff1d0'/>"
            f"<ellipse cx='-.35' cy='-.4' rx='.3' ry='.18' fill='#fff' opacity='.45' filter='url(#soft)'/></g>")


def water_crown(x, y, s, rng):
    out = ""
    for i in range(7):
        a = -150 + i * 20 + rng.uniform(-6, 6)
        L = rng.uniform(1.6, 2.6)
        ex, ey = L * math.cos(math.radians(a)), L * math.sin(math.radians(a))
        out += (f"<path d='M{-.35 + i * .1:.2f},0 Q{ex * .4:.2f},{ey * .2 - .4:.2f} {ex:.2f},{ey:.2f} "
                f"Q{ex * .55:.2f},{ey * .5:.2f} {.35 + i * .1 - .6:.2f},.1Z' fill='url(#waterG)' stroke='#7cc8f0' stroke-width='.03' opacity='.95'/>"
                f"<circle cx='{ex * 1.12:.2f}' cy='{ey * 1.12:.2f}' r='{rng.uniform(.06, .14):.2f}' fill='#fff' "
                f"stroke='#8fd3f4' stroke-width='.02'/>")
    streaks = "".join(f"<path d='M{rng.uniform(-2, 0):.2f},{rng.uniform(-.6, .6):.2f} q{rng.uniform(1, 2):.2f},"
                      f"{rng.uniform(-.8, -.2):.2f} {rng.uniform(2.5, 3.5):.2f},{rng.uniform(-.3, .3):.2f}' fill='none' "
                      f"stroke='#fff' stroke-width='.05' opacity='.8'/>" for _ in range(6))
    drops = "".join(f"<circle cx='{rng.uniform(-3, 3):.2f}' cy='{rng.uniform(-3, 1.5):.2f}' r='{rng.uniform(.04, .12):.2f}'"
                    f" fill='#f4fcff' stroke='#9dd8f5' stroke-width='.02'/>" for _ in range(22))
    return (f"<g transform='translate({x},{y}) scale({s})'><ellipse rx='3.2' ry='1.1' cy='.2' fill='url(#waterHalo)'/>"
            f"{out}{streaks}{drops}</g>")


FRUIT_DEFS = ("<filter id='fShadow' x='-30%' y='-30%' width='160%' height='170%'>"
              "<feDropShadow dx='.15' dy='.25' stdDeviation='.22' flood-color='#102040' flood-opacity='.35'/></filter>"
              "<filter id='soft' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='.05'/>"
              "</filter>"
              "<radialGradient id='strawG' cx='.38' cy='.32' r='.8'><stop offset='0' stop-color='#ff7a6e'/>"
              "<stop offset='.55' stop-color='#e01b2e'/><stop offset='1' stop-color='#8b0016'/></radialGradient>"
              "<radialGradient id='strawEdge' cx='.5' cy='.5' r='.6'><stop offset='.7' stop-color='#000' "
              "stop-opacity='0'/><stop offset='1' stop-color='#4a0010' stop-opacity='.35'/></radialGradient>"
              "<radialGradient id='blueG' cx='.38' cy='.35' r='.75'><stop offset='0' stop-color='#9aa8ee'/>"
              "<stop offset='.5' stop-color='#3d438f'/><stop offset='1' stop-color='#161848'/></radialGradient>"
              "<radialGradient id='bloom' cx='.45' cy='.4' r='.7'><stop offset='0' stop-color='#d8e0ff' "
              "stop-opacity='.25'/><stop offset='1' stop-color='#d8e0ff' stop-opacity='0'/></radialGradient>"
              "<radialGradient id='raspG' cx='.35' cy='.3' r='.75'><stop offset='0' stop-color='#ffa3bd'/>"
              "<stop offset='.5' stop-color='#e2245c'/><stop offset='1' stop-color='#8a0a35'/></radialGradient>"
              "<radialGradient id='raspGBase'><stop offset='0' stop-color='#b5123f'/>"
              "<stop offset='1' stop-color='#6d0626'/></radialGradient>"
              "<radialGradient id='blackG' cx='.35' cy='.3' r='.75'><stop offset='0' stop-color='#8d75b8'/>"
              "<stop offset='.45' stop-color='#33184f'/><stop offset='1' stop-color='#0d0618'/></radialGradient>"
              "<radialGradient id='blackGBase'><stop offset='0' stop-color='#2a1240'/>"
              "<stop offset='1' stop-color='#09040f'/></radialGradient>"
              "<radialGradient id='grapeG' cx='.38' cy='.32' r='.75'><stop offset='0' stop-color='#f3ffc8'/>"
              "<stop offset='.55' stop-color='#a8d64c'/><stop offset='1' stop-color='#5a8a1c'/></radialGradient>"
              "<linearGradient id='banG' x2='1'><stop offset='0' stop-color='#ffe680'/>"
              "<stop offset='1' stop-color='#f2b705'/></linearGradient>"
              "<radialGradient id='segG'><stop offset='0' stop-color='#ffe0a0'/>"
              "<stop offset='1' stop-color='#ffaa2e'/></radialGradient>"
              "<linearGradient id='waterG' x2='0' y2='1'><stop offset='0' stop-color='#ffffff' stop-opacity='.95'/>"
              "<stop offset='1' stop-color='#6cc4f5' stop-opacity='.45'/></linearGradient>"
              "<radialGradient id='waterHalo'><stop offset='0' stop-color='#d7f3ff' stop-opacity='.9'/>"
              "<stop offset='1' stop-color='#d7f3ff' stop-opacity='0'/></radialGradient>")


def milk_wave(z_top, thick, period, amp=.5, swirl_z=None, swirl_s=.5):
    """White Puleva milk wave: scalloped top edge, gently waving bottom edge, swirl at the front centre."""
    yt, yb = Y(z_top), Y(z_top - thick)
    d = f"M-200,{yt}"
    x = -200.0
    while x < 200:
        d += f" Q{x + period / 2:.2f},{yt - amp * 2:.2f} {x + period:.2f},{yt:.2f}"
        x += period
    d += f" L{x:.2f},{yb:.2f}"
    while x > -200:
        d += f" Q{x - period / 2:.2f},{yb + .7:.2f} {x - period:.2f},{yb:.2f}"
        x -= period
    out = f"<path d='{d}Z' fill='#fff'/>"
    if swirl_z is not None:
        out += swirl_shape(0.5, swirl_z, swirl_s)
    return out


def swirl_shape(x, z, s, color="#fff"):
    y = Y(z)
    return (f"<g transform='translate({x},{y}) scale({s})'><path d='M-10,0.6 C-6,-1.2 -3,-3.2 1.5,-2.6 "
            f"C5.5,-2.1 7.5,-0.6 10,-1.8 C8.5,0.4 5.5,1.2 2.2,0.2 C-0.8,-0.7 -3,-0.6 -4.6,0.3 "
            f"C-3.1,0.2 -2.3,1.2 -3.2,2 C-4.6,3.1 -7.6,2.2 -10,0.6Z' fill='{color}'/></g>")


def daily_band(z_bottom, accent):
    """Navy shoulder band of the Daily line with wavy lower edge, white outline and accent line."""
    yb = Y(z_bottom)
    period = 8.0
    edge = f"M-200,{yb}"
    x = -200.0
    while x < 200:
        edge += f" Q{x + period / 2:.2f},{yb + 1.3:.2f} {x + period:.2f},{yb:.2f}"
        x += period
    fill = f"<path d='{edge} L200,-10 L-200,-10Z' fill='url(#bandG)'/>"
    outline = f"<path d='{edge}' fill='none' stroke='#fff' stroke-width='.6'/>"
    acc = (f"<path d='{edge}' fill='none' stroke='{accent}' stroke-width='.3' "
           f"transform='translate(0 .75)'/>")
    return fill + outline + acc


BAND_DEFS = (f"<linearGradient id='bandG' x2='0' y2='1'><stop offset='0' stop-color='{PULEVA_BLUE[0]}'/>"
             f"<stop offset='1' stop-color='{PULEVA_BLUE[1]}'/></linearGradient>")


# ------------------------------------------------------------------ bottle artworks
def art_care():
    rng = random.Random(7)
    defs = (BAND_DEFS +
            f"<linearGradient id='bg' x1='0' y1='{Y(95)}' x2='0' y2='{Y(5)}' gradientUnits='userSpaceOnUse'>"
            "<stop offset='0' stop-color='#f8e1d8'/><stop offset='.45' stop-color='#f4cdc1'/>"
            "<stop offset='.8' stop-color='#efbcae'/><stop offset='1' stop-color='#e5a593'/></linearGradient>"
            "<radialGradient id='pearl'><stop offset='0' stop-color='#fff' stop-opacity='.55'/>"
            "<stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient>"
            "<linearGradient id='rose' x2='1' y2='1'><stop offset='0' stop-color='#f7d6c6'/>"
            "<stop offset='.5' stop-color='#c47b68'/><stop offset='1' stop-color='#f3c8b4'/></linearGradient>"
            "<radialGradient id='dropG' cx='.4' cy='.6' r='.7'><stop offset='0' stop-color='#fff' stop-opacity='.65'/>"
            "<stop offset='.7' stop-color='#fbe3da' stop-opacity='.35'/>"
            "<stop offset='1' stop-color='#e9a998' stop-opacity='.35'/></radialGradient>")
    cy, r = Y(30), 13.0
    drop = (f"<path d='M0,{Y(48.6)} C3,{Y(44)} {r},{Y(39)} {r},{cy} A{r} {r} 0 0 1 {-r},{cy} "
            f"C{-r},{Y(39)} -3,{Y(44)} 0,{Y(48.6)}Z' fill='url(#dropG)' stroke='url(#rose)' stroke-width='.7'/>"
            f"<path d='M-1.2,{Y(46)} C-4,{Y(43)} -9.5,{Y(39)} -10.5,{Y(32)}' fill='none' stroke='#fff' "
            f"stroke-width='.45' opacity='.8' stroke-linecap='round'/>")
    bubbles = ""
    for _ in range(26):
        x = rng.choice([-1, 1]) * rng.uniform(13, 30)
        z = rng.uniform(17, 66)
        rr = rng.uniform(.35, 1.4)
        bubbles += (f"<circle cx='{x:.2f}' cy='{Y(z):.2f}' r='{rr:.2f}' fill='#fff' fill-opacity='.22' "
                    f"stroke='#fff' stroke-opacity='.75' stroke-width='.14'/>"
                    f"<circle cx='{x - rr * .35:.2f}' cy='{Y(z) - rr * .35:.2f}' r='{rr * .22:.2f}' fill='#fff' "
                    f"opacity='.85'/>")
    mol = ""
    pts = [(-27, 24), (-24.5, 25.6), (-22, 24), (-22, 21), (-24.5, 19.5), (-27, 21), (-19.5, 25.6), (-17, 24),
           (-29.5, 25.6)]
    for a, b in [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (5, 0), (2, 6), (6, 7), (0, 8)]:
        mol += (f"<line x1='{pts[a][0]}' y1='{Y(pts[a][1])}' x2='{pts[b][0]}' y2='{Y(pts[b][1])}' "
                f"stroke='#c98a78' stroke-width='.18' opacity='.7'/>")
    mol += "".join(f"<circle cx='{x}' cy='{Y(z)}' r='.45' fill='#fff' stroke='#c98a78' stroke-width='.15'/>"
                   for x, z in pts)
    mol = mol + f"<g transform='translate(48 6)'>{mol}</g>"
    arc = (f"<path d='M-45,{Y(19.6)} Q0,{Y(26.5)} 45,{Y(19.6)}' fill='none' stroke='url(#rose)' "
           f"stroke-width='.45'/>")
    return (f"<defs>{defs}</defs><rect x='-200' y='-20' width='400' height='200' fill='url(#bg)'/>"
            f"<ellipse cx='-5' cy='{Y(45)}' rx='16' ry='34' fill='url(#pearl)'/>"
            f"{mol}{bubbles}{drop}{arc}{daily_band(75.4, '#d29a86')}"
            + swirl_shape(0.6, 83.4, .72))


def art_now():
    rng = random.Random(11)
    defs = (BAND_DEFS + FLARE_DEFS +
            f"<radialGradient id='bg' cx='0' cy='{Y(42)}' r='45' gradientUnits='userSpaceOnUse'>"
            "<stop offset='0' stop-color='#2f6cc8'/><stop offset='.45' stop-color='#173f8f'/>"
            "<stop offset='1' stop-color='#0b1f58'/></radialGradient>"
            "<filter id='glow' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='.35'/>"
            "</filter>")
    nodes = [(rng.uniform(-60, 60), rng.uniform(10, 95)) for _ in range(150)]
    net = ""
    for i, (x1, z1) in enumerate(nodes):
        for x2, z2 in nodes[i + 1:]:
            dd = math.hypot(x1 - x2, z1 - z2)
            if dd < 8.5:
                net += (f"<line x1='{x1:.2f}' y1='{Y(z1):.2f}' x2='{x2:.2f}' y2='{Y(z2):.2f}' stroke='#5fd6ff' "
                        f"stroke-width='.12' opacity='{max(.12, .55 - dd / 18):.2f}'/>")
    dots = "".join(f"<circle cx='{x:.2f}' cy='{Y(z):.2f}' r='{rng.uniform(.15, .38):.2f}' fill='#9cecff' "
                   f"opacity='.85'/>" for x, z in nodes)
    flares = (flare(0, Y(41.4), 1.3) + flare(-15, Y(52), .9) + flare(16, Y(50.5), .8) + flare(-13, Y(23), .7)
              + flare(15.5, Y(37), .6) + flare(9, Y(60), .6) + flare(-10, Y(64), .6))
    edge_glow = (f"<path d='M-200,{Y(73.4)} L200,{Y(73.4)}' stroke='#36c5ff' stroke-width='1.2' opacity='.5' "
                 f"filter='url(#glow)'/>")
    return (f"<defs>{defs}</defs><rect x='-200' y='-20' width='400' height='200' fill='url(#bg)'/>"
            f"<g filter='url(#glow)' opacity='.8'>{net}</g>{net}{dots}{flares}{edge_glow}"
            f"{daily_band(73.6, '#36c5ff')}" + swirl_shape(0.5, 80.4, .66))


def art_shield():
    rng = random.Random(5)
    defs = (BAND_DEFS +
            f"<linearGradient id='bg' x1='0' y1='{Y(80)}' x2='0' y2='{Y(10)}' gradientUnits='userSpaceOnUse'>"
            "<stop offset='0' stop-color='#fbc25a'/><stop offset='.5' stop-color='#f59a30'/>"
            "<stop offset='1' stop-color='#e2701a'/></linearGradient>"
            f"<radialGradient id='glowG' cx='0' cy='{Y(40)}' r='22' gradientUnits='userSpaceOnUse'>"
            "<stop offset='0' stop-color='#ffe2a0' stop-opacity='.75'/>"
            "<stop offset='1' stop-color='#ffe2a0' stop-opacity='0'/></radialGradient>"
            "<linearGradient id='gold' x2='1' y2='1'><stop offset='0' stop-color='#fff1c4'/>"
            "<stop offset='.5' stop-color='#d98a2b'/><stop offset='1' stop-color='#ffe0a0'/></linearGradient>"
            "<radialGradient id='honey' cx='.35' cy='.6'><stop offset='0' stop-color='#ffe08a'/>"
            "<stop offset='.6' stop-color='#f5a623'/><stop offset='1' stop-color='#c8661a'/></radialGradient>"
            "<radialGradient id='shieldF' cx='.5' cy='.3'><stop offset='0' stop-color='#fff3cf' stop-opacity='.5'/>"
            "<stop offset='1' stop-color='#f7a63c' stop-opacity='.15'/></radialGradient>")
    shield = (f"<path d='M0,{Y(52)} C5,{Y(50.6)} 10,{Y(50.6)} 14.5,{Y(51.4)} C15,{Y(42)} 12.5,{Y(32.5)} 0,{Y(24)} "
              f"C-12.5,{Y(32.5)} -15,{Y(42)} -14.5,{Y(51.4)} C-10,{Y(50.6)} -5,{Y(50.6)} 0,{Y(52)}Z' "
              f"fill='url(#shieldF)' stroke='url(#gold)' stroke-width='.8'/>"
              f"<path d='M0,{Y(50.6)} C4.6,{Y(49.4)} 9,{Y(49.4)} 13.1,{Y(50.1)} C13.4,{Y(42)} 11.2,{Y(33.5)} 0,{Y(25.6)}' "
              f"fill='none' stroke='#fff6dc' stroke-width='.25' opacity='.8'/>")

    def drop(x, z, s):
        y = Y(z)
        return (f"<g transform='translate({x},{y}) scale({s})'><path d='M0,-2 C.5,-1 1.2,-.2 1.2,.6 "
                f"A1.2 1.2 0 0 1 -1.2,.6 C-1.2,-.2 -.5,-1 0,-2Z' fill='url(#honey)'/>"
                f"<ellipse cx='-.45' cy='.4' rx='.25' ry='.45' fill='#fff' opacity='.7'/></g>")
    drops = drop(-13, 44, 1.5) + drop(12.5, 31.5, 1.2) + drop(-12.8, 27.5, 1.0) + drop(17, 46, .9) + drop(-18, 36, .8)
    sp = "".join(sparkle(rng.uniform(-22, 22), Y(rng.uniform(18, 58)), rng.uniform(.4, 1.0), "#fff8e0",
                         rng.uniform(.5, .9)) for _ in range(14))
    return (f"<defs>{defs}</defs><rect x='-200' y='-20' width='400' height='200' fill='url(#bg)'/>"
            f"<ellipse cx='0' cy='{Y(40)}' rx='26' ry='24' fill='url(#glowG)'/>{shield}{drops}{sp}"
            f"{daily_band(64.6, '#ffd27a')}" + swirl_shape(0.5, 71.0, .62))


def art_creasnap():
    rng = random.Random(3)
    defs = (FRUIT_DEFS +
            "<linearGradient id='bg' x1='-40' x2='40' gradientUnits='userSpaceOnUse'>"
            "<stop offset='0' stop-color='#6d2a8f'/><stop offset='.22' stop-color='#e2342f'/>"
            "<stop offset='.42' stop-color='#ff8a1c'/><stop offset='.58' stop-color='#ff8a1c'/>"
            "<stop offset='.78' stop-color='#e2342f'/><stop offset='1' stop-color='#6d2a8f'/></linearGradient>"
            f"<linearGradient id='bottomG' x1='0' y1='{Y(30)}' x2='0' y2='{Y(6)}' gradientUnits='userSpaceOnUse'>"
            "<stop offset='0' stop-color='#6d2a8f' stop-opacity='0'/>"
            "<stop offset='1' stop-color='#5a2280' stop-opacity='.9'/></linearGradient>"
            f"<linearGradient id='navyG' x1='0' y1='{Y(64)}' x2='0' y2='{Y(52)}' gradientUnits='userSpaceOnUse'>"
            f"<stop offset='0' stop-color='{PULEVA_BLUE[1]}'/><stop offset='1' stop-color='{PULEVA_BLUE[0]}'/>"
            "</linearGradient>")
    splash = ""
    for _ in range(26):
        x = rng.uniform(-36, 36)
        z = rng.uniform(8, 52)
        col = rng.choice(["#ffb21a", "#ff6a13", "#f23b2e", "#a3338f", "#ffd34d"])
        splash += blob(x, Y(z), rng.uniform(1.2, 4.2), col, rng, opacity=rng.uniform(.55, .9))
    fruits = (strawberry(-19.5, Y(39), 2.0, -20) + berry(-21, Y(31.5), 1.5, "blueG") + orange_slice(-18.5, Y(21), 3.0, 15)
              + strawberry(20.5, Y(32.5), 1.9, 25) + banana(17.5, Y(43), 1.8, 25) + drupe(20.5, Y(22), 1.6, "raspG")
              + berry(-24, Y(15), 1.3, "blueG") + strawberry(24, Y(13), 1.4, 10) + orange_slice(25, Y(41), 2.2, 0))
    circle = (f"<circle cx='0' cy='{Y(30.4)}' r='17.2' fill='#fff'/>"
              f"<circle cx='0' cy='{Y(30.4)}' r='17.2' fill='none' stroke='#ffd0a0' stroke-width='.4'/>")
    navy = (f"<rect x='-200' y='-20' width='400' height='{Y(51.6) + 20}' fill='url(#navyG)'/>"
            + milk_wave(51.8, 1.2, 6.0, .45, 53.4, .5))
    return (f"<defs>{defs}</defs><rect x='-200' y='-20' width='400' height='200' fill='url(#bg)'/>"
            f"{splash}<rect x='-200' y='{Y(30)}' width='400' height='40' fill='url(#bottomG)'/>{fruits}{circle}{navy}")


def helix(x0, y0, length, amp, angle, turns=4.0, rng=None):
    """3D-looking DNA double helix: strands thicker/brighter in front, glowing, with particles."""
    n = 360
    segs = []
    for strand in (0, 1):
        for i in range(n):
            t0, t1 = i / n, (i + 1) / n
            ph0 = t0 * turns * 2 * math.pi + strand * math.pi
            ph1 = t1 * turns * 2 * math.pi + strand * math.pi
            depth = (math.cos((ph0 + ph1) / 2) + 1) / 2
            segs.append((depth, f"<line x1='{t0 * length:.2f}' y1='{amp * math.sin(ph0):.2f}' x2='{t1 * length:.2f}' "
                                f"y2='{amp * math.sin(ph1):.2f}' stroke='{'#ffffff' if depth > .55 else '#5cc0f5'}' "
                                f"stroke-width='{.4 + .6 * depth:.2f}' stroke-linecap='round' "
                                f"opacity='{.35 + .65 * depth:.2f}'/>"))
    for i in range(0, n, 7):
        t = i / n
        ph = t * turns * 2 * math.pi
        depth = (abs(math.cos(ph)) * .5 + .5)
        ya, yb = amp * math.sin(ph), -amp * math.sin(ph)
        segs.append((.5, f"<line x1='{t * length:.2f}' y1='{ya:.2f}' x2='{t * length:.2f}' y2='{yb:.2f}' "
                         f"stroke='url(#rung)' stroke-width='.32' opacity='{.5 + .4 * depth:.2f}'/>"))
        for yy, dd in ((ya, (math.cos(ph) + 1) / 2), (yb, (math.cos(ph + math.pi) + 1) / 2)):
            segs.append((dd + .01, f"<circle cx='{t * length:.2f}' cy='{yy:.2f}' r='{.22 + .3 * dd:.2f}' "
                                   f"fill='#ffffff' opacity='{.5 + .5 * dd:.2f}'/>"))
    body = "".join(s for _, s in sorted(segs, key=lambda q: q[0]))
    parts = ""
    if rng:
        for _ in range(70):
            px, py = rng.uniform(0, length), rng.gauss(0, amp * 1.6)
            parts += (f"<circle cx='{px:.2f}' cy='{py:.2f}' r='{rng.uniform(.05, .22):.2f}' fill='#dff7ff' "
                      f"opacity='{rng.uniform(.4, 1):.2f}'/>")
    return (f"<g transform='translate({x0},{y0}) rotate({angle})'>"
            f"<ellipse cx='{length / 2}' cy='0' rx='{length * .55}' ry='{amp * 2.6}' fill='url(#dnaHalo)'/>"
            f"<g filter='url(#dnaGlowBig)' opacity='.9'>{body}</g><g filter='url(#dnaGlow)'>{body}</g>{body}"
            f"<g filter='url(#dnaGlow)'>{parts}</g>{parts}</g>")


def art_clearpro():
    rng = random.Random(9)
    defs = (FRUIT_DEFS +
            f"<linearGradient id='bg' x1='0' y1='{Y(50)}' x2='0' y2='{Y(8)}' gradientUnits='userSpaceOnUse'>"
            "<stop offset='0' stop-color='#f3f6fa'/><stop offset='.35' stop-color='#d5dce7'/>"
            "<stop offset='.55' stop-color='#f7f9fc'/><stop offset='.8' stop-color='#c3ccda'/>"
            "<stop offset='1' stop-color='#e9edf3'/></linearGradient>"
            "<linearGradient id='spec' x1='-30' x2='30' gradientUnits='userSpaceOnUse'>"
            "<stop offset='0' stop-color='#fff' stop-opacity='0'/><stop offset='.35' stop-color='#fff' stop-opacity='.7'/>"
            "<stop offset='.5' stop-color='#fff' stop-opacity='0'/><stop offset='1' stop-color='#fff' stop-opacity='0'/>"
            "</linearGradient>"
            f"<linearGradient id='navyG' x1='0' y1='{Y(62)}' x2='0' y2='{Y(49)}' gradientUnits='userSpaceOnUse'>"
            f"<stop offset='0' stop-color='{PULEVA_BLUE[1]}'/><stop offset='1' stop-color='{PULEVA_BLUE[0]}'/>"
            "</linearGradient>"
            "<filter id='dnaGlow' x='-20%' y='-80%' width='140%' height='260%'><feGaussianBlur stdDeviation='.3'/>"
            "</filter><filter id='dnaGlowBig' x='-20%' y='-80%' width='140%' height='260%'>"
            "<feGaussianBlur stdDeviation='1.0'/><feColorMatrix values='0 0 0 0 .2  0 0 0 0 .65  0 0 0 0 1  0 0 0 1.6 0'/></filter>"
            "<linearGradient id='rung' x2='0' y2='1'><stop offset='0' stop-color='#ffffff'/>"
            "<stop offset='.5' stop-color='#5ec8ff'/><stop offset='1' stop-color='#ffffff'/></linearGradient>"
            "<radialGradient id='dnaHalo'><stop offset='0' stop-color='#4fb8ff' stop-opacity='.7'/>"
            "<stop offset='.6' stop-color='#a8dcff' stop-opacity='.2'/>"
            "<stop offset='1' stop-color='#a8dcff' stop-opacity='0'/></radialGradient>")
    brushed = "".join(f"<line x1='-200' x2='200' y1='{y:.2f}' y2='{y:.2f}' stroke='{rng.choice(['#fff', '#8d99ab'])}' "
                      f"stroke-width='.08' opacity='{rng.uniform(.05, .18):.2f}'/>"
                      for y in [Y(rng.uniform(6, 50)) for _ in range(160)])
    dna = helix(-34, Y(10.0), 62, 3.6, -17, 3.6, random.Random(4))
    splash = (water_crown(22.5, Y(25.5), 3.4, random.Random(2)) + water_crown(20, Y(34.5), 2.0, random.Random(6))
              + water_crown(26, Y(31), 1.6, random.Random(8)))
    fruits = (berry(17.4, Y(37.0), 1.45) + berry(21.0, Y(38.4), 1.25) + strawberry(25.0, Y(35.2), 2.0, 18)
              + drupe(20.0, Y(31.2), 2.0, "raspG") + grape(25.6, Y(29.8), 1.85) + berry(16.2, Y(27.2), 1.35)
              + drupe(21.4, Y(24.4), 2.35, "blackG") + berry(28.4, Y(25.4), 1.2) + drupe(26.6, Y(21.2), 2.2, "raspG")
              + berry(17.6, Y(20.6), 1.15))
    stripe = (f"<rect x='-200' y='{Y(44.0)}' width='400' height='4.4' fill='{PULEVA_BLUE[1]}'/>"
              f"<rect x='-200' y='{Y(44.0)}' width='400' height='.35' fill='#5f86d6'/>"
              f"<rect x='-200' y='{Y(39.95)}' width='400' height='.35' fill='#5f86d6'/>")
    navy = (f"<rect x='-200' y='-20' width='400' height='{Y(48.7) + 20}' fill='url(#navyG)'/>"
            + milk_wave(48.9, 1.2, 7.0, .45, 50.6, .55))
    return (f"<defs>{defs}</defs><rect x='-200' y='-20' width='400' height='200' fill='url(#bg)'/>{brushed}"
            f"<rect x='-200' y='{Y(50)}' width='400' height='42' fill='url(#spec)'/>"
            f"{dna}{splash}{fruits}{stripe}{navy}")



# ------------------------------------------------------------------ per-piece overlays
class Ctx:
    """Placement helpers for one piece (true mm on the label)."""

    def __init__(self, piece, bleed):
        self.p, self.b = piece, bleed

    def top(self, z):
        p = self.p
        return self.b + (p.z1 - z) / (p.z1 - p.z0) * p.slant

    def left(self, dx=0.0):
        return self.b + self.p.width / 2 + dx

    def k(self, z):
        """Horizontal pre-compensation so text keeps its width where the bottle narrows/widens."""
        p = self.p
        r = p.r0 + (z - p.z0) / (p.z1 - p.z0) * (p.r1 - p.r0)
        return p.r_mid / r

    def text(self, z, html, size, dx=0.0, style="", sx=1.0):
        k = self.k(z - size / 2) * sx
        return (f"<div class='a' style='left:{self.left(dx)}mm;top:{self.top(z)}mm;font-size:{size}mm;"
                f"transform:translateX(-50%) scaleX({k:.3f});transform-origin:50% 0;{style}'>{html}</div>")

    def box(self, z, dx, w, h, html, style=""):
        k = self.k(z - h / 2)
        return (f"<div class='a' style='left:{self.left(dx)}mm;top:{self.top(z)}mm;width:{w}mm;height:{h}mm;"
                f"transform:translateX(-50%) scaleX({k:.3f});transform-origin:50% 0;{style}'>{html}</div>")


def seal(uid, d, ring, fill, ink, top_txt, mid, bot, rot=-18):
    r = d / 2
    ra = r * .66
    rb = r * .66
    return (f"<svg viewBox='0 0 {d} {d}' style='width:{d}mm;height:{d}mm;transform:rotate({rot}deg)'>"
            f"<defs><path id='t{uid}' d='M{r - ra},{r} A{ra} {ra} 0 0 1 {r + ra},{r}'/>"
            f"<path id='b{uid}' d='M{r - rb},{r} A{rb} {rb} 0 0 0 {r + rb},{r}'/></defs>"
            f"<circle cx='{r}' cy='{r}' r='{r - d * .04}' fill='{fill}' stroke='{ring}' stroke-width='{d * .05}'/>"
            f"<circle cx='{r}' cy='{r}' r='{r - d * .12}' fill='none' stroke='{ring}' stroke-width='{d * .015}'/>"
            f"<text font-family='Noto Sans' font-weight='800' font-size='{d * .13}' fill='{ink}' "
            f"letter-spacing='{d * .01}'><textPath href='#t{uid}' startOffset='50%' text-anchor='middle'>{top_txt}"
            f"</textPath></text>"
            f"<text x='{r}' y='{r + d * .15}' text-anchor='middle' font-family='Noto Sans' font-weight='900' "
            f"font-size='{d * .42}' fill='{ink}'>{mid}</text>"
            f"<text font-family='Noto Sans' font-weight='800' font-size='{d * .13}' fill='{ink}'>"
            f"<textPath href='#b{uid}' startOffset='50%' text-anchor='middle' dominant-baseline='hanging'>{bot}"
            f"</textPath></text></svg>")


def instituto(h, ink=NAVY):
    w = h * 2.75
    return (f"<div style='width:{w}mm;height:{h}mm;background:#fff;border:{h * .045}mm solid #c9d3e4;"
            f"border-radius:{h * .2}mm;display:flex;align-items:center;gap:{h * .06}mm;padding:0 {h * .1}mm;"
            f"box-shadow:0 0 {h * .05}mm rgba(0,0,0,.25)'>"
            f"<svg viewBox='0 0 10 14' style='width:{h * .55}mm;height:{h * .75}mm;flex:none'>"
            f"<path d='M2 1 C 8 4, 8 6, 2 9 S 2 13, 8 13' fill='none' stroke='#2bb673' stroke-width='1.3'/>"
            f"<path d='M8 1 C 2 4, 2 6, 8 9 S 8 13, 2 13' fill='none' stroke='{ink}' stroke-width='1.3'/>"
            f"<path d='M3 3h4M3.6 11h3' stroke='#8fa3c8' stroke-width='.6'/></svg>"
            f"<div style='font-size:{h * .21}mm;font-weight:800;line-height:1.05;color:{ink}'>INSTITUTO<br>"
            f"PULEVA <span style='font-weight:600'>de</span><br>NUTRICIÓN</div></div>")


def back_note(c: Ctx, z, color, w=None):
    p = c.p
    w = w or p.width * .2
    return (f"<div class='a' style='left:{c.b + p.width * .03}mm;top:{c.top(z)}mm;width:{w}mm;font-size:1.35mm;"
            f"line-height:1.25;font-weight:600;color:{color};white-space:normal'>Complemento alimenticio. No debe "
            f"utilizarse como sustituto de una dieta equilibrada y un modo de vida sano. No superar la dosis diaria "
            f"expresamente recomendada.<br><b>Prototipo académico · Hackathon UGR × Lactalis Puleva 2026. "
            f"No es un producto comercial.</b></div>")


CLIP = "-webkit-background-clip:text;background-clip:text;color:transparent;"
HEAVY = "font-weight:900;letter-spacing:-0.01em;line-height:1;"


def logo(c, z, size):
    return c.text(z, "PULEVA", size, style=f"{HEAVY}font-style:italic;color:#fff;letter-spacing:-0.015em;"
                                            f"text-shadow:0 .15mm .3mm rgba(0,0,0,.25)")


def daily_overlay(c: Ctx, key):
    p = c.p
    if key == "care":
        acc = f"background:linear-gradient(180deg,#f2c3b0 0%,#c27c69 55%,#e8ae99 100%);{CLIP}"
        if p.name == "hombro":
            return logo(c, 92.0, 7.2) + c.text(80.3, "HEALTH", 3.0, style="font-weight:500;color:#fff;"
                                                                         "letter-spacing:.06em")
        if p.name == "nombre":
            return (c.text(59.7, "DAILY", 6.0, style=f"{HEAVY}color:{NAVY}", sx=.9)
                    + c.text(54.0, "CARE", 6.6, style=f"{HEAVY}{acc}", sx=.92))
        return (c.text(43.9, "PIEL", 6.6, style=f"{HEAVY}color:{NAVY}", sx=.9)
                + c.text(37.7, "RADIANTE", 6.6, style=f"{HEAVY}color:{NAVY}", sx=.84)
                + c.text(31.4, "Luminosidad", 2.6, style=f"font-weight:600;color:{NAVY}")
                + c.text(28.8, "y Juventud", 2.6, style=f"font-weight:600;color:{NAVY}")
                + c.box(32.5, 15.6, 7.6, 7.6, seal("c", 7.6, "#c98a78", "rgba(255,240,235,.55)", NAVY,
                                                   "DAILY SHOT", "1", "DIARIO"))
                + c.text(25.3, "<b>COMPLEMENTO<br>ALIMENTICIO •</b><br><span style='font-size:.8em;font-weight:500'>"
                               "Con Vitamina E, C y Zinc</span>", 1.62, dx=-10.5,
                         style=f"color:{NAVY};line-height:1.12;text-align:left;font-weight:800")
                + c.box(25.0, 8.6, 13.2, 4.8, instituto(4.8))
                + back_note(c, 41, NAVY))
    if key == "now":
        now = (f"background:linear-gradient(180deg,#e9fdff 0%,#62dcff 45%,#1aa5e0 100%);{CLIP}"
               "filter:drop-shadow(0 0 .5mm rgba(80,220,255,.8))")
        if p.name == "hombro":
            return (logo(c, 87.6, 6.6) + c.text(78.0, "HEALTH", 2.9, style="font-weight:500;color:#fff;"
                                                                         "letter-spacing:.06em"))
        if p.name == "nombre":
            return (c.text(54.6, "DAILY", 5.6, style=f"{HEAVY}color:#fff;font-style:italic", sx=.9)
                    + c.text(49.2, "NOW", 6.6, style=f"{HEAVY}{now};font-style:italic", sx=.95))
        badge = (f"<svg viewBox='0 0 30 16' preserveAspectRatio='none' style='width:100%;height:100%'>"
                 f"<defs><linearGradient id='bm' x2='1' y2='1'><stop offset='0' stop-color='#e9fbff'/>"
                 f"<stop offset='.5' stop-color='#4fd2ff'/><stop offset='1' stop-color='#c9f3ff'/></linearGradient>"
                 f"<linearGradient id='bf' x2='0' y2='1'><stop offset='0' stop-color='#1d4fa6'/>"
                 f"<stop offset='1' stop-color='#0d2a6c'/></linearGradient></defs>"
                 f"<path d='M2,.6 L28,.6 L29.4,2 L29.4,11.2 C29.4,13 22,14.2 15,15.5 C8,14.2 .6,13 .6,11.2 L.6,2Z' "
                 f"fill='url(#bf)' fill-opacity='.85' stroke='url(#bm)' stroke-width='.6'/></svg>")
        grad = f"background:linear-gradient(180deg,#ffffff 30%,#9feaff 100%);{CLIP}"
        return (c.box(39.4, 0, 31, 16.8, badge)
                + c.text(38.4, "MÁXIMO", 4.7, style=f"{HEAVY}{grad}", sx=.88)
                + c.text(33.7, "ENFOQUE", 4.7, style=f"{HEAVY}{grad}", sx=.86)
                + c.text(28.7, "Claridad Mental y", 1.7, style="font-weight:600;color:#fff")
                + c.text(26.8, "Energía sin Caídas", 1.7, style="font-weight:600;color:#fff")
                + c.box(30.0, 16.2, 7.0, 7.0, seal("n", 7.0, "#41d2ff", "rgba(10,35,95,.85)", "#fff",
                                                   "DAILY SHOT", "1", "DIARIO"))
                + c.text(21.9, "<b>COMPLEMENTO ALIMENTICIO •</b><br><span style='font-size:.78em;font-weight:500'>"
                               "Con L-treonato de Magnesio, L-teanina, Vit. B6 y B12</span>", 1.45, dx=-10.0,
                         style="color:#fff;line-height:1.12;text-align:left;font-weight:800")
                + c.box(22.2, 10.4, 11.4, 4.15, instituto(4.15))
                + back_note(c, 37, "#fff"))
    # shield
    sh = (f"background:linear-gradient(180deg,#fff0c4 0%,#f3a33c 50%,#b5561c 100%);{CLIP}"
          f"-webkit-text-stroke:.14mm #8f4312;filter:drop-shadow(0 .2mm .2mm rgba(120,50,0,.35))")
    if p.name == "hombro":
        return logo(c, 78.6, 6.3) + c.text(68.6, "HEALTH", 2.7, style="font-weight:500;color:#fff;letter-spacing:.06em")
    if p.name == "nombre":
        return (c.text(49.2, "DAILY", 4.9, style=f"{HEAVY}color:{NAVY}", sx=.9)
                + c.text(44.3, "SHIELD", 5.6, style=f"{HEAVY}{sh}", sx=.88))
    return (c.text(34.7, "SISTEMA", 4.4, style=f"{HEAVY}color:{NAVY}", sx=.86)
            + c.text(30.4, "INMUNITARIO", 4.4, style=f"{HEAVY}color:{NAVY}", sx=.74)
            + c.text(25.9, "Fuerza y Protección", 2.0, style=f"font-weight:600;color:{NAVY}")
            + c.text(23.9, "Natural", 2.0, style=f"font-weight:600;color:{NAVY}")
            + c.box(26.0, 13.6, 5.6, 5.6, seal("s", 5.6, "#b3541a", "rgba(255,236,200,.7)", NAVY,
                                               "DAILY SHOT", "1", "DIARIO"))
            + c.text(21.4, "<b>COMPLEMENTO ALIMENTICIO</b><br><span style='font-weight:500'>• Con Lactoferrina,<br>"
                           "Zinc, Saúco y Vit. C y D3</span>", 1.3, dx=-8.6,
                     style=f"color:{NAVY};line-height:1.15;text-align:left;font-weight:800")
            + c.box(21.5, 8.4, 11.0, 4.0, instituto(4.0))
            + back_note(c, 33, NAVY))


def active_overlay(c: Ctx, key):
    p = c.p
    if key == "creasnap":
        if p.name == "frontal":
            pill = (f"<div style='display:inline-block;background:{NAVY};color:#fff;font-style:italic;"
                    f"font-weight:900;padding:.35mm 2.2mm;transform:skewX(-12deg);border-radius:.6mm;"
                    f"box-shadow:0 0 0 .3mm #fff,0 0 0 .55mm {NAVY}'>ACTIVE</div>")
            return (logo(c, 60.6, 5.6)
                    + c.text(49.7, "HEALTH", 3.0, style="font-weight:600;color:#fff;letter-spacing:.04em;"
                                                       "text-shadow:0 .2mm .3mm rgba(0,0,0,.45)")
                    + c.text(46.0, pill, 3.3)
                    + c.text(41.0, "CREA-SNAP", 5.2, style=f"{HEAVY}color:{NAVY}", sx=.8)
                    + c.text(35.9, "FRUTAS", 5.4, style=f"{HEAVY}color:{NAVY}", sx=.86))
        return (c.text(28.9, "ACTIVA", 5.4, style=f"{HEAVY}color:#e3262d", sx=.86)
                + c.text(23.5, "3 g de Creatina en el Tapón", 1.95, style=f"font-weight:700;color:{NAVY}")
                + c.text(21.4, "Shot de Fruta y Energía", 1.95, style=f"font-weight:700;color:{NAVY}")
                + c.box(25.0, 19.4, 7.0, 7.0, seal("a", 7.0, "#fff", NAVY, "#fff", "ACTIVE SHOT", "1", "DIARIO", -12))
                + c.box(14.6, 6.5, 11.5, 4.2, instituto(4.2))
                + c.text(9.7, "COMPLEMENTO ALIMENTICIO • Con 3 g de Creatina y Extracto de Frutas", 1.3,
                         style="font-weight:700;color:#fff;letter-spacing:.02em")
                + back_note(c, 27, "#fff"))
    # ClearPro
    chrome = (f"background:linear-gradient(180deg,#ffffff 0%,#c9d2df 38%,#7d8aa1 50%,#eef2f7 62%,#9aa6ba 100%);"
              f"{CLIP}-webkit-text-stroke:.28mm #3d4b66;filter:drop-shadow(0 .35mm .25mm rgba(20,35,70,.45))")
    blue = f"background:linear-gradient(180deg,#5b93f0 0%,#2456c9 55%,#173a94 100%);{CLIP}"
    return (logo(c, 57.7, 6.0)
            + c.text(46.5, "HEALTH", 2.3, style=f"font-weight:800;color:{NAVY};letter-spacing:.08em")
            + c.text(43.5, "ACTIVE", 3.6, style="font-weight:900;font-style:italic;color:#fff;letter-spacing:.05em")
            + c.text(39.3, "<span style='font-size:1.22em'>C</span>LEAR<span style='font-size:1.22em'>P</span>RO",
                     6.1, style=f"{HEAVY}font-style:italic;{chrome}", sx=.95)
            + c.text(31.4, "PROTEÍNA", 5.8, style=f"{HEAVY}font-style:italic;{blue}", sx=.92)
            + c.text(25.6, "Clara &amp; Ligera", 3.4, style=f"font-weight:800;font-style:italic;color:{NAVY}", sx=.95)
            + c.box(18.6, 23.6, 6.8, 6.8, seal("p", 6.8, "#fff", NAVY, "#fff", "ACTIVE SHOT", "1", "DIARIO", 0))
            + c.text(19.3, "Fuerza &amp; Recuperación", 3.0, dx=-3,
                     style=f"font-weight:800;font-style:italic;color:{NAVY};text-shadow:0 0 .6mm #fff")
            + c.box(15.6, 11.0, 12.4, 4.5, instituto(4.5))
            + c.text(10.6, "COMPLEMENTO ALIMENTICIO • Con Proteína Clara de Suero y Frutas", 1.35, dx=-4,
                     style=f"font-weight:700;color:{NAVY}")
            + back_note(c, 36, NAVY))


ART = {"care": art_care, "now": art_now, "shield": art_shield, "creasnap": art_creasnap, "clearpro": art_clearpro}


def piece_html(piece, r_ref, bleed):
    """Full inner HTML for one piece: artwork window + overlays."""
    W, H, b = piece.width, piece.slant, bleed
    sx = r_ref / piece.r_mid
    sz = (piece.z1 - piece.z0) / H
    x0 = (-b - W / 2) * sx
    vw = (W + 2 * b) * sx
    y0 = Y(piece.z1 + b * sz)
    vh = (H + 2 * b) * sz
    art = ART[piece.bottle]()
    svg = (f"<svg class='a' style='left:0;top:0;width:{W + 2 * b}mm;height:{H + 2 * b}mm' "
           f"viewBox='{x0:.3f} {y0:.3f} {vw:.3f} {vh:.3f}' preserveAspectRatio='none'>{art}</svg>")
    c = Ctx(piece, bleed)
    over = daily_overlay(c, piece.bottle) if piece.bottle in ("care", "now", "shield") else active_overlay(c, piece.bottle)
    return svg + over
