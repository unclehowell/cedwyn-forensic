# Changelog — Forensic Assessments (Cedwyn webapp 39 of 59)

## [1.3.0] - 2026-11-10
### Changed
- Completed a mail and external-reference audit of The National Archives profile through 10 November 2026.
- Corrected the assessment from “nothing disclosed” to partial disclosure and substantive archival assistance; documented the HMC9/311 physical inspection, Judicial Papers A–C 1–63 release schedules and transfer manifest, National Farm Survey / Agricultural Executive Committee search routes, and the IR 131/4/96 map reference.
- Recorded the 10 November FOIA section 14(2) refusal as a repeat-request refusal, not a “not held” finding, and separated the unresolved IR 58 field-book location from OS’s ST1673 “Missing at Transfer” Object Name Book.
- Added third-party references from Glamorgan Archives, Cadw, Welsh Government, RCAHMW, Ordnance Survey, Companies House and HSE, with explicit source attribution and limits.
- Updated the institution directory and National Archives activity journal, including the current review and response position.

## [1.2.0] - 2026-11-03
### Added
- Activity journal at /forensic/journal/ with one page per institution (/forensic/journal/<slug>/, 50 institutions, 994 entries): every reply, request and website change on file, newest first, each with a plain reading and a link to the full email (/email/reference/…) or to the before and after copies of the page (/wayback/…).
- Journal entries with a fuller objective reading (what was done, what was not done, fair note, open questions). First entry: RCAHMW, 3 November 2026 (RC26-0375, cost limit and search terms).
- Each institution page now shows its journal in an "Activity journal" block above "Since last assessment"; the index links to the journal.
- Kept current by a recurring journal run (new mail and watchtower changes since the last run).

## [1.1.1] - 2026-11-03
### Fixed
- Kept the search input label separate from its Clear button so the directory controls use valid, keyboard-friendly HTML.

## [1.1.0] - 2026-11-03
### Changed
- Reworked the index into a responsive institution directory with full-text search, assessment-status filters, reading-indicator filters and sorting by priority, latest contact, next deadline, name or indicator.
- Kept the at-a-glance table as a collapsible priority snapshot and made the 64 assessed / 17 not-yet-assessed distinction visible in the directory controls.
- Replaced the light-only page palette with a day/night palette driven by Cedwyn's shared theme setting; the shared header, banner, navigation and footer remain the single site-wide implementations.
- Improved mobile layout, focus states, filter feedback and reduced-motion behaviour.

### Preserved
- All carried-forward assessment text, institution pages, status wording, correspondence summaries, evidence links and source references.
- The app's existing theme-local, read-only SQLite slice generated from the central catalogue at build time.
- Slot 39 of 59 and its adjacent navigation positions.

## [1.0.0] - 2026-11-01
### Added
- New webapp at /forensic/ (branch section/forensic): index of 64 institutional forensic assessments plus 17 bodies with recent correspondence not yet assessed.
- Each assessment carried over unchanged from its Legal Wiki page (old version and date shown), with a dated "Since last assessment" section listing every email on file since that page's cut-off (205 in all), cited by date and reference.
- Response status re-read from the latest reply; where it changed the earlier value is shown struck through beside the new one (19 changes).
- "NN of 59" parcel link (slot 39), language switcher (English; Welsh and Spanish interface strings, assessment text translation pending), scope tag data-scope="online".
- Company pages (Mountjoy Ltd, Western Ground Rents Ltd) list enquiries about each company made to other bodies, each row naming the body.
- Case file on every institution page: conduct timeline with verbatim quotations, inconsistencies and gaps, quarantined-name links, duty and liability (our reading), evidence still needed.
- Index: at-a-glance table with the column "Liability indicators (our reading): none / some / strong"; data.json carries the same value.
