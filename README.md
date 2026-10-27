# Kismart Beauty Products

React + Vite + Tailwind v4 + Motion + React Router + Lucide storefront, with content managed in Sanity. Orders are sent through WhatsApp (no online payment).

## Run locally
```
npm install
cp .env.example .env     # fill in values
npm run dev              # site
npm run build            # production build
```
Without a Sanity project ID the site runs in preview mode with six placeholder products (no prices, no photos).

## Sanity setup
1. Create a project at sanity.io/manage and note the project ID.
2. Put it in `.env` as `VITE_SANITY_PROJECT_ID`, and for the studio set `SANITY_STUDIO_PROJECT_ID` (same value).
3. `cd studio && npm install && npm run dev` to open the dashboard locally (or `npm run deploy` to host it).
4. In sanity.io/manage > API > CORS origins, add your site URL (and `http://localhost:5173`).
5. Keep the dataset public-read (the default) so the site can read published content. No tokens are used in the frontend; only invited editors can sign in to the dashboard.

## Environment variables
`VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_WHATSAPP_NUMBER` (digits with country code; the dashboard value overrides it), `VITE_CURRENCY` (default UGX, an assumption: change it if needed).

## Owner guide
- **Add a product:** Studio > Products > Create. Enter name, price, description, upload photos, pick a category, Publish. It appears on the site automatically.
- **Replace photos:** open the product, remove or replace the image, Publish.
- **Categories:** Studio > Categories. New categories show in the shop filters; move a product by changing its category. Untick "Show on website" to hide one.
- **Featured:** tick "Feature on homepage" on a product. Use "Display order" to arrange items.
- **Homepage, FAQ, contact, social links, WhatsApp, footer, About text:** Studio > Homepage and Website settings.
- Jelly for men and women: create one product with options "Men" and "Women" in Sizes or options, or two separate products. Decide when the catalogue is final.

## Structure
`src/data.jsx` (one Sanity fetch), `src/cart.jsx` (cart + WhatsApp message), `src/ui.jsx` (cards, images, FAQ), `src/pages/pages.jsx`, `studio/` (Sanity schemas).

## Limitations and placeholders
- No prices, product details, policies, brand story, contact details or photos are invented; each shows a placeholder until entered.
- Host with an SPA fallback (all routes serve index.html).
- No payment, stock counts, or order storage.

## Checks performed
`npm install` and `npm run build` succeeded. Not run: automated tests and linting (none written), browser/responsive inspection, live Sanity retrieval (needs your project), studio install.
