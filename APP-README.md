# Forensic Assessments — Cedwyn webapp 39 of 59

Served at `/forensic/` from the snapshot branch `section/forensic`, pinned by `sections.lock` and registered as slot 39 in the shared 59-slot navigation.

## What is here

The directory brings together 64 carried-forward institutional assessments and 17 additional institutional records with correspondence but no completed assessment. Each institution has its own page. Earlier published assessment text remains intact; later correspondence is presented in dated “Since last assessment” sections. Status and liability-indicator wording is explicitly the archive's reading, not a formal finding.

The directory supports name/content search, filters for assessed and not-yet-assessed entries, filters for the three reading-indicator levels, and sorting by priority order, recent contact, next deadline, institution name or indicator. The At a glance table is retained as a collapsible priority snapshot.

## Cedwyn integration

- The shared Cedwyn header supplies navigation, the day/night choice and the Garden City Cymru store banner. Do not add local duplicates.
- `tools/nav.py` stamps and checks the shared slot navigation. This app remains **39 of 59**, between That Old Chestnut (38) and Mr Wolf (40).
- The common agent footer and guestbook script provide the page change-history table and agent guestbook.
- The build creates a compact, read-only SQLite slice at `/forensic/_db/` from the central catalogue. It includes this theme's relevant artifact locations, linked artifacts, evidence-register rows, assessments, observations and references, plus the contextual parcel model and graph links needed by this theme. The central catalogue remains authoritative; this app does not maintain a second master evidence database.
- Detail pages carry their original assessment and correspondence text. The index redesign does not rewrite those findings or their source references.

## Editing

Source branch: `section/forensic`. A push is checked by Sections CI, pinned in `sections.lock`, and triggers the Cedwyn build. Interface strings are in `lang.json`; assessment text remains English pending reviewed translations.

Version: 1.1.1. See `CHANGELOG.md`.
