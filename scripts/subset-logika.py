"""
Vyřízne z písma Noto Sans Math (SIL OFL 1.1) jen logické a další znaky, které ostatní písma hry
nemají, a uloží je jako src/assets/fonts/svetlo-logika.woff2 (záložní písmo „Svetlo Logika“).

Spuštění (potřebuje fontTools a brotli, Noto Sans Math stažené z @fontsource/noto-sans-math):
    python scripts/subset-logika.py cesta/k/noto-sans-math-latin-400-normal.woff2

Když se v textech objeví nový znak, přidej ho do ZNAKY i do unicode-range v src/app.css.
"""
import os
import sys

from fontTools import subset

# ∧ ∨ ⊻ ⇔ ⇒ šipky, ≈ ≠ ≤ ≥ ⊕ Σ, kolečka a fajfka.
ZNAKY = '∧∨⊻⇔⇒→←↔≈≠≤≥⊕Σ●○✓'

src = sys.argv[1]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
out = os.path.join(root, 'src', 'assets', 'fonts', 'svetlo-logika.woff2')
os.makedirs(os.path.dirname(out), exist_ok=True)

opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['*']
opts.name_IDs = ['*']
opts.notdef_outline = True
opts.desubroutinize = True
font = subset.load_font(src, opts)
sub = subset.Subsetter(opts)
sub.populate(text=ZNAKY)
sub.subset(font)
# Upravená verze písma dostane vlastní jméno (OFL to u výřezů doporučuje).
for rec in font['name'].names:
    if rec.nameID in (1, 4, 16):
        rec.string = 'Svetlo Logika'
    elif rec.nameID == 6:
        rec.string = 'SvetloLogika-Regular'
subset.save_font(font, out, opts)
print(out, os.path.getsize(out), 'B')
