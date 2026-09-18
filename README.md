# Shaunverse v0.3.0 — The Movie Nexus

Built from the stable v0.2.7 Listening Nexus release. This release adds an actor-first discovery layer for the Apple movie and television library while preserving the Audible dashboard and all prior fixes.

New in v0.3.0:
- Movie Nexus dashboard covering movies and grouped Apple TV series
- Embedded, privacy-minimized Wikidata cast index: only titles were used for public metadata matching
- Actor search and actor binge mode across the library
- Actor + genre filtering with Most Watched, Title, and Recently Purchased sorting
- Most-watched actor, genre-gravity, franchise, and most-watched-title analytics
- “What Should I Watch Tonight?” picker with reroll
- Actor chips on title details and direct actor-to-library navigation
- Where-to-watch and Apple TV search links
- Apple TV series grouping, play-count totals, artwork lookup, ratings, notes, favorites, and watch-again logs
- Recommendation branding updated from Spock to Skippy

Preserved from v0.2.7:

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
