# KWEIDER PRIVATE EVENTS — LUXURY EVENT BUILDER 2026

This is the clean starting baseline for the rebuilt private-events experience.

## Preserve from the supplied V13 base
- Brand palette: cream/beige + burgundy + rich black + gold.
- Mobile-first luxury direction.
- Hero, heritage, footer and current availability/calendar foundations.
- Venue Only duration pricing: 2h £400 / 4h £700 / 6h £1,000.
- Arabic brand spelling: قويدر.
- Latin/English numerals throughout the UI.

## Guest-routing rule for the rebuild
- Smaller parties are directed to Book a Table.
- Full private-event builder begins from 40 guests.
- Main quick private-hire counts: 40 / 60 / 80; maximum venue capacity remains 85.

## Hospitality duration rule for bookings of 40+ guests
- 2 hours included.
- 3 hours: +£150.
- 4 hours: +£250.
- More than 4 hours: contact management.

## New experience architecture
Venue Only remains standalone. All hospitality experiences use Classic / Super / Luxury tiers.

Planned experiences:
1. Venue Only
2. Breakfast
3. Lunch
4. Dinner
5. Damascene Sweets & Coffee
6. Wedding Hospitality
7. Corporate & Cultural Events
8. Special Events

## Confirmed breakfast prices
- Classic Breakfast: £4.99 pp base.
- Super Breakfast: £7.99 pp base.
- Luxury Damascene Sharing Breakfast: £13.99 pp base, sharing setting for every 2 guests.

Required breakfast main selection; booking cannot continue until assigned quantities match guest count:
- Olive Oil Foul: £7
- Yogurt Foul: £8
- Olive Oil Tesqiyeh: £7
- Ghee & Nuts Fatteh: £8

## Confirmed lunch / dinner direction
Lunch and Dinner currently use the same menu logic.
- Lunch Super: £17.99 pp base.
- Missing event items such as Moutabal, Chicken Freekeh and Meat Maqluba can be added to this builder first and to the public menu later.

## Confirmed wedding base prices
- Classic: £12 pp
- Super: £16 pp
- Luxury: £19.99 pp
Use the newly supplied event-specific dessert prices, not the older comparison figures.

## Damascene Sweets & Coffee
Use public-menu names and prices for selectable items.
The intended product name in the earlier £4 discussion is Cream Baklava, not Cream Namura; verify the exact public-menu representation before live launch.

## Pricing engine principle
Estimated total = (base package × guests) + required/selected item quantities + extra time + upgrades.
Where a required category applies, Continue remains disabled until assigned quantities equal the guest count.

## Media
`media/venue-preview.mp4` combines the two newly supplied portrait café videos into one muted cinematic loop for mobile-first presentation.


## V2 correction — package-first architecture
The old V13 item-list behavior has been removed from the active flow.
Breakfast, Lunch, Dinner, Damascene Sweets & Coffee, and Wedding Hospitality now show package levels first:
Classic / Super / Luxury.

Only after a package level is selected are included items and applicable required/optional choices shown.

Breakfast main assignment is enforced against the exact guest count.
Hospitality time pricing is now 2h included / 3h +£150 / 4h +£250.

## V3 locked rules
Required quantity coverage uses >= guest count, not strict equality. Extra portions are allowed and charged.
The submit request remains disabled until required guest coverage is satisfied.
Wedding Dinner is the only wedding package whose three dessert/gift extras are truly optional.
