"""Generate printable labels for the 3D-printed Puleva Health bottles.

Each label zone is fitted as a cone frustum (or cylinder) from the bottle STL,
the flat design (etiquetas/diseno.py) is rendered with headless Chromium,
warped onto the developed (flattened) frustum, and packed onto A4 sheets with
vector cut lines. A front-view preview of every labelled bottle is also saved.

Requirements: numpy, scipy, Pillow, chromium, rsvg-convert, qpdf.
Usage: python3 etiquetas/generar_etiquetas.py
"""
from __future__ import annotations

import base64
import io
import math
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates

sys.path.insert(0, str(Path(__file__).resolve().parent))
import diseno  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).resolve().parent / "salida"
PX = 24.0            # pixels per mm (~610 dpi)
BLEED = 1.5          # mm of design beyond the cut line
OVERLAP = 4.0        # mm of overlap at the back seam
A4 = (210.0, 297.0)
MARGIN = 9.0
GAP = 5.0

# Label zones (heights in mm from the base, measured on the STL profiles).
# The first zone of each bottle is the reference for the artwork's horizontal scale.
BOTTLES = {
    "care": dict(stl="Export_3D/Daily_Care_100ml_Botella.stl", plastic="#ebbdb1", cap="#e7b3a6", line="Daily",
                 zones={"cuerpo": (19.0, 46.9), "nombre": (46.9, 60.0), "hombro": (71.5, 92.5)}),
    "now": dict(stl="Export_3D/Daily_Now_80ml_Botella.stl", plastic="#1b2d63", cap="#1b2d63", line="Daily",
                zones={"cuerpo": (17.0, 42.1), "nombre": (42.1, 55.0), "hombro": (68.5, 88.0)}),
    "shield": dict(stl="Export_3D/Daily_Shield_60ml_Botella.stl", plastic="#e8862c", cap="#e07a22", line="Daily",
                   zones={"cuerpo": (16.0, 37.9), "nombre": (37.9, 49.5), "hombro": (60.5, 79.0)}),
    "creasnap": dict(stl="Export_3D_Active_CreaSnap/Active_80ml_Botella.stl", plastic="#f1f1ee", cap="#1f4fd6",
                     line="Active", zones={"frontal": (29.4, 61.0), "inferior": (8.0, 29.3)}),
    "clearpro": dict(stl="Export_3D_Active_CreaSnap/Active_125ml_Botella.stl", plastic="#f1f1ee", cap="#1f4fd6",
                     line="Active", zones={"frontal": (9.0, 58.0)}),
}


# ---------------------------------------------------------------- geometry
def load_stl(path: Path) -> np.ndarray:
    d = path.read_bytes()
    n = int.from_bytes(d[80:84], "little")
    rec = np.dtype([("n", "<3f4"), ("v", "<9f4"), ("a", "<u2")])
    return np.frombuffer(d[84:84 + n * 50], dtype=rec)["v"].reshape(-1, 3, 3).astype(float)


def profile(path: Path, step: float = 0.25):
    """Max outer radius of the mesh at each height (exact plane slicing)."""
    t = load_stl(path)
    e = np.concatenate([t[:, [0, 1]], t[:, [1, 2]], t[:, [2, 0]]])
    a, b = e[:, 0], e[:, 1]
    zs = np.arange(step / 2, t[:, :, 2].max(), step)
    rs = np.full(len(zs), np.nan)
    for i, z in enumerate(zs):
        m = (a[:, 2] - z) * (b[:, 2] - z) < 0
        if m.any():
            A, B = a[m], b[m]
            s = (z - A[:, 2]) / (B[:, 2] - A[:, 2])
            p = A + (B - A) * s[:, None]
            rs[i] = np.hypot(p[:, 0], p[:, 1]).max()
    ok = ~np.isnan(rs)
    return zs[ok], rs[ok]


@dataclass
class Piece:
    bottle: str
    name: str
    z0: float            # bottom height on the bottle (mm)
    z1: float            # top height
    r0: float = 0.0      # fitted radius at z0
    r1: float = 0.0      # fitted radius at z1
    dev: float = 0.0     # max radial deviation of the fit
    design: np.ndarray = field(default=None, repr=False)   # flat RGBA design, bleed included
    img: Image.Image = field(default=None, repr=False)     # warped RGBA, bleed included
    outline: np.ndarray = field(default=None, repr=False)  # cut polygon in mm, image coords

    @property
    def slant(self):
        return math.hypot(self.z1 - self.z0, self.r1 - self.r0)

    @property
    def r_mid(self):
        return (self.r0 + self.r1) / 2

    @property
    def width(self):
        return 2 * math.pi * self.r_mid + OVERLAP

    @property
    def cyl(self):
        return abs(self.r1 - self.r0) / self.slant < 2e-3


def fit(piece: Piece, zs, rs):
    """Minimax line fit of the radius profile: smallest worst-case gap between label and bottle."""
    m = (zs >= piece.z0) & (zs <= piece.z1)
    z, r = zs[m], rs[m]
    k0, _ = np.polyfit(z, r, 1)
    best = None
    for k in np.linspace(k0 - abs(k0) * .4 - 1e-3, k0 + abs(k0) * .4 + 1e-3, 241):
        e = r - k * z
        dev = (e.max() - e.min()) / 2
        if best is None or dev < best[0]:
            best = (dev, k, (e.max() + e.min()) / 2)
    piece.dev, k, c = best
    piece.r0, piece.r1 = k * piece.z0 + c, k * piece.z1 + c
    if abs(piece.r1 - piece.r0) / piece.slant < 2e-3:
        piece.r0 = piece.r1 = float(rs[m].mean())


def develop(piece: Piece):
    """Warp the flat design (u around, v down the slant) onto the flattened frustum."""
    W, H, b = piece.width, piece.slant, BLEED
    design = piece.design
    if piece.cyl:
        piece.img = Image.fromarray(design)
        piece.outline = np.array([[b, b], [b + W, b], [b + W, b + H], [b, b + H]])
        return
    sin_a = abs(piece.r1 - piece.r0) / piece.slant
    rho_top, rho_bot = piece.r1 / sin_a, piece.r0 / sin_a
    rho_mid = piece.r_mid / sin_a
    up = rho_top < rho_bot          # apex above the label (narrower at the top)

    def fwd(u, v):
        psi = (u - W / 2) / rho_mid
        rho = rho_top + v if up else rho_top - v
        return rho * np.sin(psi), (rho * np.cos(psi) if up else -rho * np.cos(psi))

    us, vs = np.linspace(-b, W + b, 400), np.linspace(-b, H + b, 100)
    bu = np.concatenate([us, np.full_like(vs, W + b), us[::-1], np.full_like(vs, -b)])
    bv = np.concatenate([np.full_like(us, -b), vs, np.full_like(us, H + b), vs[::-1]])
    bx, by = fwd(bu, bv)
    x0, y0 = bx.min() - 0.5, by.min() - 0.5
    wp = int(math.ceil((bx.max() + 0.5 - x0) * PX))
    hp = int(math.ceil((by.max() + 0.5 - y0) * PX))

    out = np.zeros((hp, wp, 4), np.uint8)
    xs = (np.arange(wp) + 0.5) / PX + x0
    for r0 in range(0, hp, 512):
        ys = (np.arange(r0, min(hp, r0 + 512)) + 0.5) / PX + y0
        X, Yy = np.meshgrid(xs, ys)
        Yd = Yy if up else -Yy
        rho = np.hypot(X, Yd)
        psi = np.arctan2(X, Yd)
        u = W / 2 + psi * rho_mid
        v = rho - rho_top if up else rho_top - rho
        cu, cv = (u + b) * PX - 0.5, (v + b) * PX - 0.5
        inside = (u >= -b) & (u <= W + b) & (v >= -b) & (v <= H + b)
        for ch in range(4):
            out[r0:r0 + len(ys), :, ch] = np.where(
                inside, map_coordinates(design[:, :, ch], [cv, cu], order=1, mode="nearest"), 0)
    piece.img = Image.fromarray(out)

    cu = np.concatenate([np.linspace(0, W, 300), np.full(60, W), np.linspace(W, 0, 300), np.zeros(60)])
    cv = np.concatenate([np.zeros(300), np.linspace(0, H, 60), np.full(300, H), np.linspace(H, 0, 60)])
    ox, oy = fwd(cu, cv)
    piece.outline = np.stack([ox - x0, oy - y0], axis=1)


# ---------------------------------------------------------------- rendering
BASE_CSS = """
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; overflow: hidden; }
body { position: relative; font-family: 'Noto Sans', 'Liberation Sans', sans-serif; -webkit-font-smoothing: antialiased; }
.a { position: absolute; white-space: nowrap; line-height: 1; text-align: center; }
"""


def render(piece: Piece, inner: str) -> np.ndarray:
    tw, th = piece.width + 2 * BLEED, piece.slant + 2 * BLEED
    html = (f"<!doctype html><html><head><meta charset='utf-8'><style>{BASE_CSS}"
            f"body{{width:{tw}mm;height:{th}mm;}}</style></head><body>{inner}</body></html>")
    with tempfile.TemporaryDirectory() as td:
        f = Path(td) / "p.html"
        f.write_text(html, encoding="utf-8")
        png = Path(td) / "p.png"
        win = (math.ceil(tw * 96 / 25.4) + 1, math.ceil(th * 96 / 25.4) + 1)
        subprocess.run(["chromium", "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
                        f"--force-device-scale-factor={PX * 25.4 / 96}", f"--window-size={win[0]},{win[1]}",
                        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True)
        im = Image.open(png).convert("RGBA")
    return np.asarray(im.crop((0, 0, round(tw * PX), round(th * PX)))).copy()


# ---------------------------------------------------------------- previews
def preview(pieces, zs, rs, plastic, cap, out_png, scale=9.0):
    zmax = zs.max()
    cap_h = 12.0
    wpx, hpx = int((2 * rs.max() + 8) * scale), int((zmax + cap_h + 6) * scale)
    img = np.full((hpx, wpx, 3), 255, np.uint8)
    pc = np.array(Image.new("RGB", (1, 1), plastic))[0, 0].astype(float)
    cc = np.array(Image.new("RGB", (1, 1), cap))[0, 0].astype(float)
    x = (np.arange(wpx) + 0.5 - wpx / 2) / scale
    for row in range(hpx):
        z = zmax + cap_h + 3 - (row + 0.5) / scale
        if z < 0 or z > zmax + cap_h - 11:
            continue
        on_cap = z > zmax - 11
        r, col = (15.0, cc) if on_cap else (float(np.interp(z, zs, rs)), pc)
        m = np.abs(x) < r
        phi = np.arcsin(np.clip(x[m] / r, -1, 1))
        shade = 0.55 + 0.45 * np.cos(phi)
        rgb = np.outer(shade, col)
        if not on_cap:
            for p in pieces:
                if p.z0 <= z <= p.z1:
                    v = (p.z1 - z) / (p.z1 - p.z0) * p.slant
                    u = p.width / 2 + phi * p.r_mid
                    d = p.design
                    iu = np.clip(((u + BLEED) * PX).astype(int), 0, d.shape[1] - 1)
                    iv = int(np.clip((v + BLEED) * PX, 0, d.shape[0] - 1))
                    rgb = d[iv, iu, :3].astype(float) * (0.7 + 0.3 * shade[:, None])
        hl = np.exp(-((phi + 0.55) / 0.16) ** 2)[:, None] * 55
        img[row, m] = np.clip(rgb + hl, 0, 255).astype(np.uint8)
    Image.fromarray(img).save(out_png)


# ---------------------------------------------------------------- sheets
@dataclass
class Sheet:
    title: str
    items: list = field(default_factory=list)   # (piece, x_mm, y_mm)


def pack(pieces, title):
    sheets, cur = [], Sheet(title)
    top = MARGIN + 13
    x, yy, row_h = MARGIN, top, 0.0
    for p in sorted(pieces, key=lambda q: -q.img.size[1]):
        w, h = p.img.size[0] / PX, p.img.size[1] / PX
        if x + w > A4[0] - MARGIN:
            x, yy, row_h = MARGIN, yy + row_h + GAP + 3, 0.0
        if yy + h > A4[1] - MARGIN - 14:
            sheets.append(cur)
            cur = Sheet(title)
            x, yy, row_h = MARGIN, top, 0.0
        cur.items.append((p, x, yy))
        x += w + GAP
        row_h = max(row_h, h)
    sheets.append(cur)
    return sheets


def sheet_svg(sh: Sheet, n, total, cut_only=False):
    parts = [f"<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' "
             f"width='{A4[0]}mm' height='{A4[1]}mm' viewBox='0 0 {A4[0]} {A4[1]}'>"]
    if not cut_only:
        parts.append(f"<rect width='{A4[0]}' height='{A4[1]}' fill='#fff'/>")
        parts.append(f"<text x='{MARGIN}' y='{MARGIN + 2}' font-family='Noto Sans' font-size='3.4' font-weight='800' "
                     f"fill='#1d3f8c'>Etiquetas Puleva Health · {sh.title} · hoja {n}/{total}</text>")
        parts.append(f"<text x='{MARGIN}' y='{MARGIN + 7}' font-family='Noto Sans' font-size='2.3' fill='#555'>"
                     f"Imprimir al 100 % (tamaño real, sin ajustar a página). Cortar por la línea gris; el diseño "
                     f"continúa {BLEED} mm por fuera para que no quede borde blanco.</text>")
        ry = A4[1] - MARGIN - 4
        parts.append(f"<path d='M{MARGIN} {ry} h50 M{MARGIN} {ry - 2} v4 M{MARGIN + 50} {ry - 2} v4' "
                     f"stroke='#000' stroke-width='0.25' fill='none'/>")
        parts += [f"<path d='M{MARGIN + 5 * i} {ry - 1} v2' stroke='#000' stroke-width='0.15'/>" for i in range(1, 10)]
        parts.append(f"<text x='{MARGIN + 53}' y='{ry + 1}' font-family='Noto Sans' font-size='2.4'>"
                     f"← Comprobar: debe medir 50 mm exactos</text>")
    for p, x, yy in sh.items:
        if not cut_only:
            buf = io.BytesIO()
            p.img.save(buf, "PNG", optimize=True)
            w, h = p.img.size[0] / PX, p.img.size[1] / PX
            parts.append(f"<image x='{x}' y='{yy}' width='{w}' height='{h}' preserveAspectRatio='none' "
                         f"xlink:href='data:image/png;base64,{base64.b64encode(buf.getvalue()).decode()}'/>")
            parts.append(f"<text x='{x}' y='{yy - 1.2}' font-family='Noto Sans' font-size='2.3' fill='#333'>"
                         f"{p.bottle.upper()} · {p.name} · altura {p.z0:g}–{p.z1:g} mm desde la base · "
                         f"Ø {2 * p.r0:.1f}→{2 * p.r1:.1f} mm</text>")
        d = "M" + " L".join(f"{x + px:.3f},{yy + py:.3f}" for px, py in p.outline) + " Z"
        col = "#ec008c" if cut_only else "#6b6b6b"
        parts.append(f"<path id='CutContour' d='{d}' fill='none' stroke='{col}' stroke-width='0.12'/>")
    parts.append("</svg>")
    return "".join(parts)


def main():
    OUT.mkdir(exist_ok=True)
    groups = {"Daily": [], "Active": []}
    for key, cfg in BOTTLES.items():
        zs, rs = profile(ROOT / "modelos3d" / cfg["stl"])
        pieces = [Piece(key, n, z0, z1) for n, (z0, z1) in cfg["zones"].items()]
        for p in pieces:
            fit(p, zs, rs)
        r_ref = pieces[0].r_mid
        for p in pieces:
            print(f"{p.bottle:9s} {p.name:8s} z {p.z0:5.1f}-{p.z1:5.1f}  Ø {2 * p.r0:5.1f}->{2 * p.r1:5.1f}  "
                  f"alto {p.slant:5.1f}  largo {p.width:6.1f}  desv.max {p.dev:.2f} mm")
            p.design = render(p, diseno.piece_html(p, r_ref, BLEED))
            develop(p)
        preview(pieces, zs, rs, cfg["plastic"], cfg["cap"], OUT / f"preview_{key}.png")
        groups[cfg["line"]] += pieces

    for title, ps in groups.items():
        sheets = pack(ps, title)
        pdfs = []
        for i, sh in enumerate(sheets, 1):
            svg = OUT / f"_tmp_{title}_{i}.svg"
            svg.write_text(sheet_svg(sh, i, len(sheets)), encoding="utf-8")
            pdf = OUT / f"_tmp_{title}_{i}.pdf"
            subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(pdf), str(svg)], check=True)
            pdfs.append(str(pdf))
            (OUT / f"corte_{title.lower()}_{i}.svg").write_text(sheet_svg(sh, i, len(sheets), cut_only=True),
                                                               encoding="utf-8")
            svg.unlink()
        target = OUT / f"etiquetas_{title.lower()}.pdf"
        subprocess.run(["qpdf", "--empty", "--pages", *pdfs, "--", str(target)], check=True)
        for f in pdfs:
            Path(f).unlink()
        print("->", target.relative_to(ROOT), f"({len(sheets)} hoja/s)")


if __name__ == "__main__":
    main()
