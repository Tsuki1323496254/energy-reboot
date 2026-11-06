# -*- coding: utf-8 -*-
"""生成「精力重启」卡通风 App 图标（512 逻辑坐标，4 倍超采样）。"""
import math
import os
from PIL import Image, ImageDraw

OUT = r"C:\Users\姜姜deMagicBook\Documents\deepseek-harness\default-workspace\energy-reboot\icons"
os.makedirs(OUT, exist_ok=True)

INK = (46, 42, 59, 255)
CORAL = (255, 139, 115, 255)
CORAL_D = (240, 100, 76, 255)
LEAF = (67, 190, 143, 255)
CREAM = (255, 248, 236, 255)
PINK = (255, 157, 176, 255)


def make_icon(size=512, safe=1.0):
    S = size * 4
    k = (S / 512.0) * safe
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, S, S], fill=CREAM)

    def pt(x, y):
        return (S / 2 + (x - 256) * k, S / 2 + (y - 256) * k)

    def box(x0, y0, x1, y1):
        (ax, ay), (bx, by) = pt(x0, y0), pt(x1, y1)
        return [ax, ay, bx, by]

    def ell(x0, y0, x1, y1, **kw):
        d.ellipse(box(x0, y0, x1, y1), **kw)

    # 背景装饰圆
    for (cx, cy, r, col) in [(92, 82, 66, (255, 232, 210, 255)),
                             (432, 100, 48, (226, 240, 255, 255)),
                             (412, 424, 62, (226, 251, 240, 255)),
                             (82, 442, 44, (255, 242, 204, 255))]:
        ell(cx - r, cy - r, cx + r, cy + r, fill=col)

    # 阴影
    ell(150, 404, 362, 442, fill=(46, 42, 59, 30))

    # 身体
    ell(106, 146, 406, 424, fill=CORAL, outline=INK, width=int(13 * k))
    # 高光
    ell(150, 186, 250, 250, fill=(255, 255, 255, 48))

    # 叶子（3 片）
    def leaf(cx, cy, rx, ry, ang):
        pts = []
        n = 46
        for i in range(n):
            t = 2 * math.pi * i / n
            x = rx * math.cos(t)
            y = ry * math.sin(t) * (1 - 0.55 * max(0, math.cos(t)))
            xr = x * math.cos(ang) - y * math.sin(ang)
            yr = x * math.sin(ang) + y * math.cos(ang)
            pts.append(pt(cx + xr, cy + yr))
        d.polygon(pts, fill=LEAF)
        d.line(pts + [pts[0]], fill=INK, width=int(7 * k), joint="curve")

    lx, ly = 256, 150
    for ang in (-0.85, 0.0, 0.85):
        leaf(lx + (-56 if ang < -0.2 else (56 if ang > 0.2 else 0)), ly + 6, 60, 26, ang)
    # 茎
    (sx, sy) = pt(256, 128)
    d.line([sx, sy, *pt(256, 84)], fill=INK, width=int(18 * k))
    d.line([sx, sy, *pt(256, 84)], fill=LEAF, width=int(9 * k))

    # 眼睛
    for ex in (202, 310):
        r = 22
        ell(ex - r, 256 - r, ex + r, 256 + r, fill=INK)
        g = 7
        ell(ex - g - 4, 256 - g - 6, ex + g - 4, 256 + g - 6, fill=(255, 255, 255, 255))

    # 腮红
    for bx in (164, 348):
        ell(bx - 24, 292, bx + 24, 312, fill=PINK)

    # 笑嘴
    d.arc(box(212, 300, 300, 352), start=20, end=160, fill=INK, width=int(11 * k))

    # 小脚
    for fx in (194, 318):
        ell(fx - 25, 404, fx + 25, 432, fill=CORAL_D, outline=INK, width=int(8 * k))

    return img.resize((size, size), Image.LANCZOS)


def save(img, name):
    path = os.path.join(OUT, name)
    img.save(path)
    print("saved", path, img.size)


save(make_icon(512, 1.0), "icon-512.png")
save(make_icon(192, 1.0), "icon-192.png")
save(make_icon(512, 0.80), "icon-512-maskable.png")
save(make_icon(180, 1.0), "apple-touch-icon.png")
save(make_icon(64, 1.0), "favicon.png")
