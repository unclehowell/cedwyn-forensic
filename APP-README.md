# Forensic Assessments — webapp 39 of 59

This repository is the source of truth for the webapp served at `/forensic/` (slot 39 of 59). The retired `section/forensic` branch in `unclehowell/cedwyn` is not the editing source.

## What is here

The directory contains 64 published institutional assessments and 17 further institutional records with correspondence but no completed assessment. Each assessed institution has its own page. Published assessments remain intact; later correspondence is recorded in dated “Since last assessment” sections and the activity journal.

The directory provides full-text search, assessment-status and indicator filters, and sorting by priority, recent contact, next deadline, institution name or indicator. The directory is the single index; individual report pages hold the detailed assessment and source references.

## Cedwyn integration

- The shared Cedwyn header supplies navigation, the day/night choice and the Garden City Cymru store banner. Do not add local duplicates.
- The webapp remains **39 of 59**, between That Old Chestnut (38) and Mr Wolf (40).
- The common agent footer and guestbook script provide the page change-history table and agent guestbook.
- The build creates a compact, read-only SQLite slice at `/forensic/_db/` from the central catalogue. The central catalogue remains authoritative; this app does not maintain a second master evidence database.
- Detail pages retain their assessment, correspondence and source references. Index edits do not rewrite those findings.

## Editing

Edit this repository's `main` branch. Keep public changes evidence-attributed, neutral and explicit about limitations. Do not expose private correspondence or CRM identifiers.

Version: 1.4.1. See `CHANGELOG.md`.
