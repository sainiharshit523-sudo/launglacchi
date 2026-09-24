# Laung Laachi Website Plan

## Goal

Build a premium, mobile-first single-page website for **Laung Laachi, Brahmpur** that makes food, roadside convenience, atmosphere, directions, and phone access immediately clear without inventing business details.

## Experience

- Create a sticky responsive header with a newly designed **LAUNG LAACHI** English wordmark and simple clove-inspired symbol, plus Home, Menu, About, Gallery, Location, and Call Now.
- Build an image-led first screen with the supplied headline direction, concise Brahmpur travel-stop copy, and working View Menu, Get Directions, and Call Now actions.
- Add the compact facts strip: ₹200–₹400 per person, dine-in, takeaway, delivery, and 7 AM–12 AM.
- Create focused sections for the introduction, menu highlights, full menu, traveler stop, dining options, Google rating summary, gallery, location, hours, contact, and footer.
- Add a compact mobile action bar for Menu, Call, and Directions.

## Visual Direction

- Use a warm ivory foundation with restrained spice red, turmeric gold, fresh green, and charcoal semantic colors.
- Pair a bold contemporary display face with a highly readable sans-serif body face.
- Use subtle Punjabi-inspired borders/textures, compact rounded cards, warm image treatments, and restrained reveal/hover motion.
- Keep the interface colorful but premium—never cartoonish, chain-like, or styled as a delivery app.
- Produce a simple, original clove/road-inspired brand concept suitable for the header and favicon, clearly treated as a new website identity.

## Content and Authenticity

- Centralize all verified restaurant facts, menu highlights, opening hours, review figures, services, and links for easy updates.
- Use only the supplied nine food references as highlights unless authentic menu photos provide additional readable items.
- Do not invent dish descriptions, prices, categories, testimonials, reservations, ordering links, social profiles, email addresses, awards, history, or staff details.
- Show **3.9★ and 653 Google reviews** as a factual summary without fabricated quotes.
- Use the exact Brahmpur address to create a Google Maps directions/search link and `tel:+919915716739` for every call action; never label the phone as WhatsApp.
- Keep photo and menu-image collections centralized so authentic uploads can replace assets without redesign. If no authentic files are available during implementation, use clearly intentional branded visual treatments rather than unrelated restaurant photography or fabricated menu data.

## Menu and Gallery

- Build category-ready, searchable structured menu data, initially limited to verified highlights and verification-safe labels.
- Include a prominent View Full Menu action leading to an accessible menu-image viewer when authentic menu images exist.
- Build a responsive gallery with filters, keyboard-accessible lightbox controls, lazy loading, and mobile-friendly navigation.
- Omit empty photo categories rather than displaying fake content.

## Conversion and Accessibility

- Make View Menu, Directions, and Call Now the only primary actions and repeat them selectively.
- Use semantic headings, visible focus states, large touch targets, keyboard-operable navigation/lightbox, descriptive alt text, reduced-motion support, and sufficient contrast.
- Ensure the layout remains stable without horizontal scrolling or overlapping controls from 320px through wide desktop screens.

## Search and Performance

- Add route-specific title, description, Open Graph text, Twitter card data, and a self-referencing canonical URL.
- Add Restaurant structured data using only the verified name, address, phone, ₹₹ price range, and daily 07:00–00:00 hours.
- Use natural local-search wording around Brahmpur and the Nangal–Chandigarh Road without keyword stuffing.
- Keep JavaScript light, defer below-the-fold media, reserve image dimensions, and use responsive optimized image formats when authentic images are available.

## Verification

- Check all menu, navigation, phone, directions, gallery, and mobile-menu interactions in the running preview.
- Review desktop and mobile layouts, including a 320px-wide viewport, for clipping, overlap, readability, and tap-target quality.
- Confirm the final page contains no unrelated Laung Laachi information, WhatsApp references, fabricated claims, dead CTAs, or accidental placeholders.
- Confirm the current preview build has no errors before completion.

## Technical Notes

- Keep the single scrolling experience at `/`, as explicitly requested, with reusable React sections and data modules.
- Extend the existing Tailwind v4 semantic token system rather than hardcoding visual colors in page markup.
- Update the root font links/site defaults and give the home route complete page metadata and JSON-LD.
- Replace the existing blank placeholder entirely and keep business/menu/gallery content independently editable.
