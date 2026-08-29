# Shaunverse v0.2.6c — Stability Rollback

This build is a clean rollback to the known-good v0.2.5 application and data baseline, with only the visible version/cache keys changed to 0.2.6c.

Temporarily removed:
- Audible acquisition-history embedded dataset
- Audible acquisition-history detail fields/timeline

Preserved from the stable baseline:
- Libation refresh and Audible Snapshot
- Movie artwork
- Apple archive integration
- Harry Potter Local Audio
- Search fixes
- Easter egg
- Personal notes/ratings stored in localStorage

Purpose: isolate the blank Home regression by removing every 0.2.6 runtime/data change.
