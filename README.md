# The Shaunverse v0.2

Your personal media universe, organized.

## v0.2 highlights
- Movie posters and descriptions load on demand from Apple's public media catalog and cache locally.
- Personal 0–10 ratings, favorites, status, and notes for books and movies.
- Recommendation subgenres and lifecycle: Recommended → Want → Owned → Reading / Listening → Finished (or DNF).
- Finished recommendations move from Active to History instead of disappearing forever.
- Update Audible Library directly from a fresh Libation XLSX/CSV export.
- Audible imports are stored separately from personal notes/ratings so updates do not overwrite them.
- Manual Physical / Kindle / Audible books plus ISBN lookup.
- A completely unnecessary but mission-critical Easter egg.

## Updating from v0.1
Upload all files in this package to the root of the existing `shaunverse` GitHub repository and replace files with the same names. GitHub Pages will redeploy automatically.

The v0.2 service worker uses a network-first update strategy for app files, which makes future releases less likely to get stuck behind the installed PWA cache.

## Privacy
The deployed catalog contains sanitized media metadata only. Personal ratings, notes, favorites, recommendation state, and post-v0.2 Audible imports are stored in browser localStorage on the device where you enter them.

## Spreadsheet import
Libation XLSX/CSV parsing uses SheetJS Community Edition loaded from the official SheetJS CDN.
