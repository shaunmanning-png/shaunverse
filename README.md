# Shaunverse v0.2.7 — The Listening Nexus

Built from the stable v0.2.6e baseline. This release assimilates the full Amazon/Audible data export without shipping the enormous raw CSV files.

New in v0.2.7:
- Audible Listening Nexus dashboard with lifetime, annual, monthly, series, title, narrator, and streak statistics
- 91,023 raw playback rows deduplicated to 30,925 genuine events before aggregation
- Per-title playback hours, book-length equivalents, listening days, primary speed, and first/last dates
- Audible purchase type/date and active/revoked ownership details
- Human context cards, including the May 2025 COD interview-prep era
- Multi-format badges show every owned format on library and search cards
- Stable v0.2.6e render fallback, Home performance fix, search behavior, Apple assimilation, movie art, local audio, notes, and Easter egg preserved

Preserved from the stable baseline:
- Libation refresh and Audible Snapshot
- Movie artwork
- Apple archive integration
- Harry Potter Local Audio
- Search fixes
- Easter egg
- Personal notes/ratings stored in localStorage

Important data note: equivalent listens measure forward audiobook position divided by title length. They include sleep-listening and are not presented as conscious completions.


## v0.2.6e
Home performance fix: caches podcast grouping once instead of recalculating it for every book; adds visible render-error fallback.
