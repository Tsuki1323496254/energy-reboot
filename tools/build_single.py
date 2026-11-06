# -*- coding: utf-8 -*-
"""把 PWA 打包成单个 HTML 文件（离线可用、方便直接发到手机）。"""
import os
import re

ROOT = r"C:\Users\姜姜deMagicBook\Documents\deepseek-harness\default-workspace\energy-reboot"
OUT = os.path.join(ROOT, "精力重启-单文件版.html")

html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
css = open(os.path.join(ROOT, "css", "style.css"), encoding="utf-8").read()
js = open(os.path.join(ROOT, "js", "app.js"), encoding="utf-8").read()

# 去掉外部引用
html = re.sub(r'\s*<link rel="manifest"[^>]*>', "", html)
html = re.sub(r'\s*<link rel="icon"[^>]*>', "", html)
html = re.sub(r'\s*<link rel="apple-touch-icon"[^>]*>', "", html)
html = re.sub(r'\s*<link rel="stylesheet" href="css/style.css">',
              "\n<style>\n" + css + "\n</style>", html)
html = html.replace('<script src="js/app.js"></script>',
                    "<script>window.__SINGLE_FILE__ = true;</script>\n<script>\n" + js + "\n</script>")

open(OUT, "w", encoding="utf-8").write(html)
print("saved:", OUT, round(len(html) / 1024, 1), "KB")
