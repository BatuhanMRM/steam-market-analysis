"""Steam market analysis: runs the SQL layer and exports results for the site.

Usage:
    python analysis/run_analysis.py data/raw/steam_games.parquet
"""

import json
import re
import sys
from datetime import date
from pathlib import Path

import duckdb

ROOT = Path(__file__).resolve().parent.parent
SQL_DIR = ROOT / "sql"
OUT = ROOT / "site" / "data.js"


def split_named_queries(text: str) -> dict[str, str]:
    """Split a file of '-- name: x' tagged queries into a dict."""
    parts = re.split(r"^-- name:\s*(\w+)\s*$", text, flags=re.M)
    return {parts[i]: parts[i + 1].strip() for i in range(1, len(parts), 2)}


def rows(con, sql: str) -> list[dict]:
    rel = con.sql(sql)
    cols = rel.columns
    out = []
    for r in rel.fetchall():
        d = dict(zip(cols, r))
        d.pop("sort_key", None)
        out.append({k: (float(v) if hasattr(v, "is_integer") and not isinstance(v, int) else v)
                    for k, v in d.items()})
    return out


def main(parquet: str) -> None:
    con = duckdb.connect()
    con.read_parquet(parquet).to_table("raw_games")
    con.execute((SQL_DIR / "01_clean.sql").read_text())

    queries = split_named_queries((SQL_DIR / "02_analysis.sql").read_text())
    result = {name: rows(con, q) for name, q in queries.items()}
    result["concentration"] = result["concentration"][0]
    # The queries themselves, shown under each chart on the site
    result["sql"] = queries

    result["meta"] = {
        "total_games": con.sql("SELECT count(*) FROM games").fetchall()[0][0],
        "cohort_games": result["concentration"]["cohort_games"],
        "data_until": str(con.sql("SELECT max(release_dt) FROM games").fetchall()[0][0]),
        "generated": str(date.today()),
        "source": "FronkonGames/steam-games-dataset (MIT) — Steam API + SteamSpy",
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("window.STEAM_DATA = " + json.dumps(result, ensure_ascii=False, indent=1) + ";\n")
    print(json.dumps(result, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "data/raw/steam_games.parquet"))
