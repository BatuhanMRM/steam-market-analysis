-- 02_analysis.sql
-- Each query starts with "-- name: <key>"; the Python runner splits them and writes results to JSON.

-- name: releases_per_year
-- How many games are released on Steam each year?
SELECT release_year AS year, count(*) AS games
FROM games
WHERE release_year BETWEEN 2010 AND 2025
GROUP BY 1 ORDER BY 1;

-- name: review_buckets
-- How many games actually get played? Distribution by review count.
SELECT
    CASE
        WHEN reviews = 0    THEN '0'
        WHEN reviews < 10   THEN '1–9'
        WHEN reviews < 50   THEN '10–49'
        WHEN reviews < 500  THEN '50–499'
        WHEN reviews < 5000 THEN '500–4999'
        ELSE '5000+'
    END AS bucket,
    min(reviews) AS sort_key,
    count(*) AS games,
    round(100.0 * count(*) / sum(count(*)) OVER (), 1) AS pct_games,
    round(100.0 * sum(reviews) / sum(sum(reviews)) OVER (), 1) AS pct_reviews
FROM cohort
GROUP BY 1 ORDER BY sort_key;

-- name: concentration
-- What share of all reviews goes to the top 1% of games?
WITH ranked AS (
    SELECT reviews, is_visible,
           row_number() OVER (ORDER BY reviews DESC) AS rn,
           count(*) OVER () AS n
    FROM cohort
)
SELECT
    round(100.0 * sum(reviews) FILTER (WHERE rn <= n * 0.01) / sum(reviews), 1) AS top1_share,
    round(100.0 * sum(reviews) FILTER (WHERE rn <= n * 0.10) / sum(reviews), 1) AS top10_share,
    round(100.0 * sum(reviews) FILTER (WHERE rn >  n * 0.50) / sum(reviews), 1) AS bottom50_share,
    count(*) AS cohort_games,
    round(100.0 * avg(is_visible::INT), 1) AS visible_pct,
    median(reviews) AS median_reviews
FROM ranked;

-- name: price_bands
-- How price relates to being seen and to player satisfaction.
SELECT
    CASE
        WHEN price = 0   THEN 'Free'
        WHEN price < 5   THEN '$0–5'
        WHEN price < 10  THEN '$5–10'
        WHEN price < 20  THEN '$10–20'
        WHEN price < 30  THEN '$20–30'
        ELSE '$30+'
    END AS band,
    min(price) AS sort_key,
    count(*) AS games,
    round(100.0 * avg(is_visible::INT), 1) AS visible_pct,
    median(reviews) AS median_reviews,
    round(100.0 * median(positive_ratio) FILTER (WHERE reviews >= 50), 1) AS median_positive
FROM cohort
GROUP BY 1 ORDER BY sort_key;

-- name: genres
-- Supply vs. demand: a genre's share of releases vs. its share of reviews.
WITH g AS (
    SELECT unnest(genres) AS genre, reviews, is_visible FROM cohort
),
totals AS (SELECT count(*) AS n, sum(reviews) AS r FROM cohort)
SELECT
    genre,
    count(*) AS games,
    round(100.0 * count(*) / (SELECT n FROM totals), 1) AS pct_of_releases,
    round(100.0 * sum(reviews) / (SELECT r FROM totals), 1) AS pct_of_reviews,
    round(100.0 * avg(is_visible::INT), 1) AS visible_pct,
    median(reviews) AS median_reviews
FROM g
WHERE genre IN ('Indie','Casual','Action','Adventure','Simulation','Strategy',
                'RPG','Free To Play','Sports','Racing','Massively Multiplayer')
GROUP BY 1
ORDER BY games DESC;

-- name: features
-- "Care" signals: share of games seen, with vs. without each feature.
-- Note: correlation, not causation. Bigger teams add these features more often.
SELECT 'achievements' AS feature,
       round(100.0 * avg(is_visible::INT) FILTER (WHERE has_achievements), 1)     AS with_pct,
       round(100.0 * avg(is_visible::INT) FILTER (WHERE NOT has_achievements), 1) AS without_pct,
       round(100.0 * avg(has_achievements::INT), 1)                               AS adoption_pct
FROM cohort
UNION ALL
SELECT 'controller',
       round(100.0 * avg(is_visible::INT) FILTER (WHERE has_controller), 1),
       round(100.0 * avg(is_visible::INT) FILTER (WHERE NOT has_controller), 1),
       round(100.0 * avg(has_controller::INT), 1)
FROM cohort
UNION ALL
SELECT 'cloud',
       round(100.0 * avg(is_visible::INT) FILTER (WHERE has_cloud), 1),
       round(100.0 * avg(is_visible::INT) FILTER (WHERE NOT has_cloud), 1),
       round(100.0 * avg(has_cloud::INT), 1)
FROM cohort
UNION ALL
SELECT 'coop',
       round(100.0 * avg(is_visible::INT) FILTER (WHERE has_coop), 1),
       round(100.0 * avg(is_visible::INT) FILTER (WHERE NOT has_coop), 1),
       round(100.0 * avg(has_coop::INT), 1)
FROM cohort
UNION ALL
SELECT 'mac_linux',
       round(100.0 * avg(is_visible::INT) FILTER (WHERE mac OR linux), 1),
       round(100.0 * avg(is_visible::INT) FILTER (WHERE NOT (mac OR linux)), 1),
       round(100.0 * avg((mac OR linux)::INT), 1)
FROM cohort
ORDER BY with_pct - without_pct DESC;

-- name: languages
-- How does the number of supported languages relate to being seen?
SELECT
    CASE
        WHEN n_languages <= 1  THEN '1'
        WHEN n_languages <= 3  THEN '2–3'
        WHEN n_languages <= 6  THEN '4–6'
        WHEN n_languages <= 10 THEN '7–10'
        ELSE '11+'
    END AS langs,
    min(n_languages) AS sort_key,
    count(*) AS games,
    round(100.0 * avg(is_visible::INT), 1) AS visible_pct
FROM cohort
GROUP BY 1 ORDER BY sort_key;

-- name: turkish_support
-- Share of games supporting Turkish, by release year.
SELECT release_year AS year,
       round(100.0 * avg(supports_turkish::INT), 1) AS pct_turkish,
       round(100.0 * avg(supports_turkish::INT) FILTER (WHERE reviews >= 500), 1) AS pct_turkish_visible
FROM games
WHERE release_year BETWEEN 2014 AND 2025
GROUP BY 1 ORDER BY 1;

-- name: release_month
-- Which months are most crowded, and which launches get seen more?
SELECT release_month AS month,
       count(*) AS games,
       round(100.0 * avg(is_visible::INT), 1) AS visible_pct
FROM cohort
GROUP BY 1 ORDER BY 1;

-- name: rating_vs_reviews
-- Does being liked help a game get seen? Share seen by rating band.
SELECT
    CASE
        WHEN positive_ratio < 0.5  THEN '<50%'
        WHEN positive_ratio < 0.7  THEN '50–69%'
        WHEN positive_ratio < 0.8  THEN '70–79%'
        WHEN positive_ratio < 0.9  THEN '80–89%'
        WHEN positive_ratio < 0.95 THEN '90–94%'
        ELSE '95%+'
    END AS rating,
    min(positive_ratio) AS sort_key,
    count(*) AS games,
    round(100.0 * avg(is_visible::INT), 1) AS visible_pct
FROM cohort
WHERE reviews >= 10
GROUP BY 1 ORDER BY sort_key;

-- name: languages_controlled
-- Control: is the language effect just "big team = expensive game"?
-- Compare within the same price band.
SELECT
    CASE WHEN price < 5 THEN '$0–5' WHEN price < 10 THEN '$5–10' ELSE '$10–20' END AS band,
    CASE WHEN n_languages <= 1 THEN '1' WHEN n_languages <= 6 THEN '2–6' ELSE '7+' END AS langs,
    count(*) AS games,
    round(100.0 * avg(is_visible::INT), 1) AS visible_pct
FROM cohort
WHERE price > 0 AND price < 20
GROUP BY 1, 2
ORDER BY min(price), min(n_languages);
