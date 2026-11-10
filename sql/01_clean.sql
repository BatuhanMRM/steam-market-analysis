-- 01_clean.sql
-- Turns the raw Steam data into a single analysis-ready table.
-- Source: FronkonGames/steam-games-dataset (MIT), Steam API + SteamSpy.

CREATE OR REPLACE TABLE games AS
WITH parsed AS (
    SELECT
        CAST(appID AS INTEGER)                                   AS app_id,
        trim(name)                                               AS name,
        coalesce(
            try_strptime(release_date, '%b %d, %Y'),
            try_strptime(release_date, '%b %Y'),
            try_strptime(release_date, '%d %b, %Y')
        )::DATE                                                  AS release_dt,
        price,
        coalesce(positive, 0)                                    AS positive,
        coalesce(negative, 0)                                    AS negative,
        -- Split ranges like "0 - 20000" into lower/upper bounds
        CAST(split_part(estimated_owners, ' - ', 1) AS BIGINT)   AS owners_low,
        CAST(split_part(estimated_owners, ' - ', 2) AS BIGINT)   AS owners_high,
        coalesce(achievements, 0)                                AS achievements,
        coalesce(len(supported_languages), 0)                    AS n_languages,
        list_contains(supported_languages, 'Turkish')            AS supports_turkish,
        mac, linux,
        coalesce(genres, [])                                     AS genres,
        coalesce(categories, [])                                 AS categories
    FROM raw_games
    WHERE name IS NOT NULL AND trim(name) <> ''
)
SELECT
    *,
    year(release_dt)                                             AS release_year,
    month(release_dt)                                            AS release_month,
    positive + negative                                          AS reviews,
    CASE WHEN positive + negative > 0
         THEN positive::DOUBLE / (positive + negative) END       AS positive_ratio,
    price = 0                                                    AS is_free,
    list_contains(categories, 'Co-op')
        OR list_contains(categories, 'Online Co-op')
        OR list_contains(categories, 'Shared/Split Screen Co-op') AS has_coop,
    list_contains(categories, 'Steam Achievements')              AS has_achievements,
    list_contains(categories, 'Full controller support')         AS has_controller,
    list_contains(categories, 'Steam Trading Cards')             AS has_trading_cards,
    list_contains(categories, 'Steam Cloud')                     AS has_cloud,
    list_contains(categories, 'Multi-player')                    AS has_multiplayer
FROM parsed
-- Drop software/tools: products without any game genre
WHERE len(list_filter(genres, lambda x: x IN (
        'Indie','Casual','Action','Adventure','Simulation','Strategy',
        'RPG','Free To Play','Sports','Racing','Massively Multiplayer'))) > 0;

-- Cohort for success analysis: games that have had at least ~1.5 years to collect reviews.
-- "Seen" = at least 500 user reviews. Using the common Boxleiter estimate (~30-60 sales
-- per review), that is roughly 15-30k sales.
CREATE OR REPLACE VIEW cohort AS
SELECT *, reviews >= 500 AS is_visible
FROM games
WHERE release_year BETWEEN 2018 AND 2024;
