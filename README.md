## v0.2.6b — Home rollback/stability fix
- Restores the known-good v0.2.5 Home renderer.
- Keeps Audible acquisition-history data embedded for later use.
- Temporarily removes the acquisition timeline from Home.
- Fixes a detail-view JavaScript initialization bug.
- Cache keys bumped to 026b.

Shaunverse v0.2.6a — Home Stability Fix

- Fixes blank Home tab introduced in v0.2.6.
- Audible history rendering is now isolated and guarded so malformed/missing history data cannot break Home navigation.
- Preserves all v0.2.6 Audible history data and prior features.
- Cache-busted assets updated to 026a.

# Shaunverse v0.2.6 — Audible History Merge

Built from v0.2.5. Adds the Aug 28 Audible extension JSON as a separate acquisition-history layer.

## New
- 507 Audible acquisition-history events embedded separately from Libation library state
- 331 unique Audible IDs represented in the history export
- Acquisition timeline by year
- Credit/free acquisition counts and recorded returns
- First known acquisition and recent acquisition list
- Audiobook detail now shows Audible acquisition date/history where IDs match
- Preserves v0.2.5 Libation refresh, v0.2.4a movie artwork, Harry Potter Local Audio, search, and prior fixes

Purchase/acquisition dates are not treated as listening dates.
