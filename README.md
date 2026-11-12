# Seen in the Crowd: a Steam market analysis

A data analysis of **75,551 games** released on Steam between 2018 and 2024, built around one question:
**which games get noticed, and which disappear in the crowd?**

The results are presented as an interactive, plain-language story site (`site/`), in English with a Turkish version.

**Live site: https://batuhanmrm.github.io/steam-market-analysis/** ([Türkçe](https://batuhanmrm.github.io/steam-market-analysis/?lang=tr))

## Key findings

- Yearly game releases on Steam grew **14×** from 2014 to 2025 (1,488 → 21,530).
- Only **7.9%** of games reach 500 user reviews. The top 1% of games collect **77.6%** of all reviews.
- Being cheap doesn't help: **5%** of paid games under $5 get seen, versus **29.7%** in the $20–30 range.
- Language support is the strongest signal, and it holds within the same price band: among $10–20 games, **7.2%** of single-language titles get seen versus **44.6%** of those with 7+ languages.
- Casual games are 45.7% of releases but get only 17.1% of reviews: supply far exceeds demand.

## How it works

| Step | Tool | File |
|---|---|---|
| Clean raw data, parse dates and prices, drop software/tools | DuckDB SQL | `sql/01_clean.sql` |
| Analysis queries (distribution, concentration, price, genre, language, features) | DuckDB SQL | `sql/02_analysis.sql` |
| Run the queries and export results for the site | Python | `analysis/run_analysis.py` |
| Interactive presentation, hand-built SVG charts (no chart library) | HTML/CSS/JS | `site/` |

Every chart on the site has a **table view** and a **"How I calculated it (SQL)"** toggle showing the exact query behind it.

**"Seen" definition:** at least 500 user reviews. Using the common Boxleiter estimate (~30–60 sales per review), that's roughly 15,000–30,000 sales.

**Cohort:** success metrics use games released 2018–2024. Newer games haven't had time to collect reviews yet.

**A robustness check:** the language effect could simply mean "big teams make expensive, multilingual games". To test that, the comparison is repeated within the same price band (`languages_controlled` query). The effect holds in every band.

**Limits:** these are correlations, not causation. Review count is a rough proxy for sales. Only Steam is covered.

## Run it locally

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
mkdir -p data/raw
curl -L -o data/raw/steam_games.parquet \
  "https://huggingface.co/datasets/FronkonGames/steam-games-dataset/resolve/main/data/train-00000-of-00001.parquet"
.venv/bin/python analysis/run_analysis.py data/raw/steam_games.parquet
python3 -m http.server 8765 --directory site
```

Then open http://localhost:8765. Add `?lang=tr` for the Turkish version.

## Data source

[FronkonGames/steam-games-dataset](https://huggingface.co/datasets/FronkonGames/steam-games-dataset) (MIT license), compiled from the Steam API and SteamSpy.

---

Analysis and design by **Batuhan Mermi** · [GitHub](https://github.com/BatuhanMRM) · [LinkedIn](https://linkedin.com/in/batuhan-mermi)

Built with AI-assisted development.
