# Shaunverse v0.2.3 — Apple Assimilation Edition

Updated August 28, 2026.

## What changed
- Apple movie purchase history merged into the movie library
- Apple-recorded playback counts shown on movie cards/details
- “Explain Yourself™” dashboard shelf for most-played Apple movies
- Apple archive summary includes TV, iOS/tvOS apps, Mac apps, Apple Books and podcasts
- Search input debounced to prevent mobile keyboard/focus drops
- Book result cap increased to 600 (including Kindle)
- Legacy Traveler note repair hardened so “Holy Shit!!” stays with The Traveler
- Easter egg finally revealed in Add & Update: tap the SHAUNVERSE logo 7 times quickly
- Version/build updated and service-worker cache bumped

Apple play counts are labeled **Apple-recorded plays** because the export is not a complete lifetime viewing history.


## v0.2.3a hotfix
- Replaced the misleading ‘Holy Shit!!’ note placeholder with ‘Add a note…’.
- Reworked the 7-tap Easter egg trigger for iPhone and disabled double-tap zoom on the Shaunverse logo.
- Bumped the service-worker cache so the hotfix is fetched immediately.


## v0.2.3b hotfix
- Purges any legacy note beginning with ‘Holy Shit’ from every non-The Traveler personal record, regardless of punctuation/capitalization.
- Also scrubs the same legacy text from recommendation notes.
- Adds a render-time guard so stale browser storage cannot display it on other titles.
- Service-worker cache bumped to v0.2.3b.
