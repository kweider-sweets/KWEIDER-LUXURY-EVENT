# KWEIDER PRIVATE EVENTS — LUXURY EVENT BUILDER 2026

New clean rebuild baseline based on the supplied V13 archive. See `PROJECT_BASELINE.md` for the newly approved rules.

# Kweider Private Events — New Build V1

This is a clean rebuild. It does **not** modify or depend on the V9 event-page code.

## Approved design identity
- Beige ground: `#F4EDE3`
- Ivory cards: `#FAF6F0`
- Burgundy: `#53131C`
- Deep Wine: `#3A0D16` / `#27080D`
- Rich Black: `#0F0F10`
- Gold: `#C6A15B`

## Booking structure
1. Venue Only
2. Venue + Sweets & Drinks
3. Venue + Breakfast
4. Venue + Dinner
5. Classic Wedding Hospitality
6. Super Wedding Hospitality
7. Luxury Wedding Hospitality

Maximum venue capacity: 85 guests.

## Menu rules applied
- Weekly/Special Offers are excluded as a category.
- Breakfast composite offers/sets are excluded:
  - Chef’s Selection
  - Dish of the Day
  - Single‑Serving Selection
  - Damascene Set for Two
- Individual breakfast products are used.
- Dinner uses the current dinner items.
- Package 2 uses only the user-approved sweets/drinks list.

Cream Baklava uses the regular £20 / 1KG price shown as the pre-offer price in the menu, not the £15 weekly offer.

## Wedding pricing logic
The Muhallaya £3 component was first removed from each package:
- Classic base: £6.99
- Super base: £10.99
- Luxury base: £12.99

Then the guest's selected hospitality is added once:
- Muhallaya: £3.00
- Cassata, 2 slices: £4.50
- Arabic Ice Cream, 2 slices: £6.00

Therefore per-person results are:
- Classic: £9.99 / £11.49 / £12.99
- Super: £13.99 / £15.49 / £16.99
- Luxury: £15.99 / £17.49 / £18.99

## Venue duration
The UI supports 2 / 4 / 6 hours for venue-based packages.
No 2h/4h/6h venue rates were guessed. Edit `VENUE_RATES` at the top of `script.js` once the three rates are confirmed.

## Images
- Venue/event images are copied from the approved previous project.
- Product images are loaded from `https://menu.kweidersweets.co.uk/` using the exact filenames found in the uploaded menu source.

## Submission
The request form is still front-end only. No email/database/backend connection has been added yet.


## V2 — Button / GitHub Pages reliability fix
The interactive data is now embedded directly inside `script.js`.

The page no longer depends on `fetch("data.json")` during startup. This prevents
the entire interface from becoming non-responsive when `data.json` is missing,
served from the wrong GitHub Pages path, or blocked when the HTML is opened locally.

`data.json` remains in the folder only as a readable reference copy.


## V3 — layout, identity and current review decisions
- Approved Kweider 2026 logo is used in the thinner black header.
- Hero image expanded to take more visual space.
- Hero and cards use subtle cinematic reveal / slow zoom effects.
- Dark fact strip reduced in height and updated to **8 booking options**.
- Temporary uploaded venue video added in an editorial film section. It is compressed and muted for layout use and can be replaced later.
- Added **Visit & Connect** with the uploaded Acton storefront photo, Google Maps, Google Reviews, Contact, Instagram, TikTok and Facebook.
- Booking order is now:
  1. Venue Only
  2. Venue + Breakfast
  3. Venue + Lunch
  4. Venue + Dinner
  5. Classic Wedding
  6. Super Wedding
  7. Luxury Wedding
  8. Special Events
- Lunch is intentionally not populated with invented menu items; the menu is marked as pending confirmation.
- Private-hire rule: 40–85 guests.
- Quick buttons 25 and 30 show a clear table-booking recommendation and link to the Book a Table page.
- Hospitality time policy:
  - 2 hours included
  - 3 hours +£100
  - 4 hours +£200
  - 4 hours maximum
- Recommended duration:
  - 40–55 → 2 hours
  - 56–70 → 3 hours
  - 71–85 → 4 hours
- Venue Only remains a separate duration/pricing policy and is not guessed.
- Breakfast and Dinner now include an optional **Complete Your Event** area to add drinks or sweets without changing the main package.


V4 updates: dark-floor palette refresh, corrected 4+4 package ordering, wedding pricing logic fixed, sixth drinks item added, English date selectors, and compact Visit & Connect section.

V5 updates: rebalanced palette to beige-burgundy-black with stronger menu-style gold accents and reduced full-page black dominance.

V6 updates: lower Visit & Connect section switched back to a refined black floor, building image cropping improved, and a slim burgundy online-shop CTA banner added above the footer.

V7 updates: burgundy main-site CTA strip moved above the social/heritage section, heritage copy updated with 'From Damascus to London', building banner enlarged and image crop refined.

V8 updates: improved contrast for price/text on dark backgrounds, wedding package pricing locked to base rates (Classic 6.99 / Super 10.99 / Luxury 12.99) until a dessert is chosen, and summary formulas now show dessert cost clearly.

V9 updates: refined hero and heritage image framing, reduced headline copy scale for a more luxurious look, converted the venue film into a portrait/mobile-style frame, added English founder-history text, standardised Arabic spelling to ‘قويدر’, and normalised guest-count input to Latin digits only.

V11 updates: restored the cinematic video/text banner back to the V9 proportions and replaced the lower Acton exterior image with the newly uploaded building photo, displayed as a complete image inside the dark framed banner.

V12 updates: Venue Only now uses fixed pricing based on duration (2h £400, 4h £700, 6h £1,000). The final heritage/building banner now renders the entire uploaded building image without cropping, using contain-fit styling.

V13 updates: Venue Only now scrolls directly to the duration/rate selector. Replaced separate month/day/year dropdowns with a compact luxury English calendar popover (Mon–Sun, month navigation, disabled past/unavailable dates) while keeping the existing availability rules and time selector.


## V2 — PACKAGE-FIRST REBUILD
This version fixes the main architecture error in V1.
The Dinner/Breakfast/Lunch flow no longer opens as a raw list of menu items.
It now opens Classic / Super / Luxury first, then package details and choices.

## V3 — VALIDATED QUANTITIES & WEDDING DINNER
- Quantity fields are directly editable from the phone keyboard; +/- remain available.
- Required hospitality categories must cover at least the full guest count before submission.
- Breakfast, Lunch, Dinner, Sweets & Coffee, and Wedding Classic/Super/Luxury use guest coverage validation.
- Wedding "No Dessert" was removed.
- Wedding Dinner added at £29.99 pp with optional extras:
  - Cream Baklava — 2 pieces £2
  - Cream Mabrouma — 2 pieces £3
  - Sugared Almond Pouch £1.50
- Time rules verified: 2h included / 3h +£150 / 4h +£250.
- Venue Only remains 2h £400 / 4h £700 / 6h £1,000.
- Desktop category placement fixed into two deliberate columns; mobile keeps a clean 1–8 sequence.


## V4 — MOBILE-FIRST PRODUCTION CLEANUP
- Removed the historical V4–V12 CSS override stack and consolidated responsive behavior into one definitive layer.
- Removed visible developer/prototype wording.
- Reduced Hero and cinematic video banner height using aspect-ratio rather than fixed large heights.
- Mobile touch targets, quantity inputs, package cards, calendar, bottom summary and safe-area spacing refined for 320px+ screens.
- Tablet/Desktop layouts constrained for consistent presentation up to 4K.
- Pricing and booking logic from V3 intentionally unchanged.

## V5 — COMPACT MOBILE UI
- Guest quick counts are compact pill chips.
- The table-booking notice is hard-hidden at 40+ guests and shown only below 40.
- The lower heritage building image is ~30% smaller on mobile.
- Social / Maps / Reviews / Contact links use six lightweight inline SVG icons in a 3×2 mobile grid.
- No external icon library or additional network request was added.
- The V4 definitive responsive block was replaced by one V5 responsive layer rather than stacking another override set.

## V6 — MOBILE FIX
- Fixed missing experience descriptions on mobile by removing the historical hidden paragraph behavior.
- Rebuilt mobile experience cards as compact horizontal image + text cards.
- Fixed the Acton building frame by matching the 1:1 source image exactly; no inherited 440px min-height remains.
- Reduced social/contact card height and enlarged the useful names; secondary labels are hidden on phones.
- Fixed the blank View Summary drawer by removing the cloned `reveal` state and forcing the drawer summary visible.
- Added footer clearance so the fixed mobile summary does not cover the last black footer row.
- Pricing and package calculation logic was not changed.

## V7 — MOBILE GRID HOTFIX
Fixed the mobile experience grid specificity conflict. The historical `.package-grid.eight` selector had higher specificity than the newer one-column mobile rule, causing half-width cards. Mobile now explicitly uses one full-width column. No pricing, calculations, content or media were changed.
