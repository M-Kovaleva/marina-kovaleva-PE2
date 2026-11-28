## 2026-10-26

**Tool:** ChatGPT
**Task:** Compared similar booking sites (Airbnb, Booking.com, Vrbo, and smaller venue/booking sites) to find UX ideas
**What AI did:** a comparative table of the strengths and weaknesses of each website’s solutions
**What I did myself:** Chose which ideas to use: search block with dates and guests, category chips, amenities and max guests on cards, total price before booking, "In N days" badges, empty states; and user flow

## 2026-10-29

**Tool:** ChatGPT
**Task:** Testing a light panel for color blindness, assistance with color matching
**What AI did:** Color blindness test result and recommendations for shades of the selected colors to improve contrast
**What I did myself:** Selecting options for the calendar so that the meaning is conveyed by more than just color

## 2026-10-30

**Tool:** ChatGPT
**Task:** Reviewed the brand idea (name, logo mark, mood, tone of voice)
**What AI did:** Comparison of several options and a list of the pros and cons of each option
**What I did myself:** I decided the product is about "a break and a change of scenery", not about nature or cabins. I kept the name and the red house logo, changed the mood words and tone of voice to be neutral about the type of stay, and changed the hero photo rule to "one clear main object, any place"

## 2026-11-05

**Tool:** ChatGPT
**Task:** Design an Open Graph image for link previews
**What AI did:** Suggested the standard OG size 1200 × 630 px, proposed the layout: the "postcard" idea from the home page hero, listed the meta tags needed
**What I did myself:** Created image, added the meta tags, checked the preview

## 2026-11-09

**Tool:** ChatGPT
**Task:** Store the Noroff API key in .env and Vercel, and add types for environment variables
**What AI did:** Explained how Vite reads .env (only variables with the `VITE_` prefix reach the app, and only after restarting the dev server) and why the key is visible in the browser anyway. Suggested a src/vite-env.d.ts file so `import.meta.env.VITE_NOROFF_API_KEY` is typed as `string` instead of `any`, and explained the parts: the `/// <reference types="vite/client" />` line, the `ImportMetaEnv` interface, and `readonly`. Explained the steps in Vercel: where to add the variable, why Vercel warns about the `VITE_` prefix, and why the site must be rebuilt (Redeploy or a new push) before the variable is used
**What I did myself:** Created the API key once, added it to .env (ignored by Git) and wrote .env.example. Wrote src/vite-env.d.ts and checked it with `tsc`, lint and Prettier. In Vercel I added `VITE_NOROFF_API_KEY` for Production, Preview and Development, chose the "Config" type because a `VITE_` value is public in the browser, and redeployed the site

## 2026-11-09

**Tool:** ChatGPT
**Task:** Add Lucide icons (`lucide-react`) and understand the `npm audit` warnings after installing it
**What AI did:** Explained the 10 moderate warnings: they all come from `minimatch`, which is used only by dev tools (ESLint, typescript-eslint), so they are not part of the built site. Suggested `npm audit --omit=dev` to check only the packages that reach the site, and warned not to run `npm audit fix --force`, because it would downgrade ESLint from 10 to 9 (a breaking change) and could break `eslint.config.js`
**What I did myself:** Installed `lucide-react`, ran `npm audit` and `npm audit --omit=dev`, checked that the site packages have 0 vulnerabilities

## 10.11.2026

**Tool:** ChatGPT
**Task:** Create a date helper for the search form. It gives today's date in the `YYYY-MM-DD` format.
**What AI did:** Explained the helper which reads the date in local time instead of using `new Date().toISOString().slice(0, 10)`. `toISOString()` returns the date in UTC (Greenwich time). In Norway (UTC+1, or UTC+2 in summer), between midnight and 01:00 (02:00 in summer) that would give yesterday's date, so `min` on the date input would allow a past day. The helper builds the string from `getFullYear()`, `getMonth()` and `getDate()`, which use local time. Also explained two details: `getMonth()` counts months from 0, so it needs `+ 1`, and `padStart(2, '0')` turns "5" into "05".
**What I did myself:** Typed the `toDateInputValue` helper into the project, checked that the search form blocks past dates.

## 10.11.2026

**Tool:** ChatGPT
**Task:** Choose an image format for the home page hero photo
**What AI did:** Explained why WebP and not PNG. PNG is lossless: it keeps every pixel exactly, which is good for logos, icons, screenshots and images with transparency, but not for photos. In a photo almost every pixel is a bit different from its neighbours, so the file stays huge. WebP (like JPG) is lossy: it removes small details the eye does not notice, and it compresses better than JPG. Size comparison for the same 1920 px photo: PNG 3,326 KB, JPG 396 KB, WebP 231 KB. Why it matters: the hero is the largest image and loads first, so a lighter file makes the page open faster (Lighthouse also recommends "Serve images in modern formats"). All modern browsers support WebP. Rule for the project: photos - WebP or JPG; logos, icons and images with transparency - SVG or PNG. Resized my photo to 1920 px and 960 px and saved it as WebP.
**What I did myself:** Added the two WebP files (`hero-960.webp`, `hero-1920.webp`) to `public/images/`

## 10.11.2026

**Tool:** ChatGPT
**Task:** Fix the hero photo that showed locally but was missing on the live site (Vercel).
**What AI did:** Found the cause: `Hero.tsx` used paths with `/public` (`/public/hero-1920.webp`, `/public/hero-960.webp`, `/public/hero-mobile.webp`). The image files themselves were committed (`git ls-files` showed them), so only the paths were wrong. Explained why it worked locally but not in production. `npm run dev` accepts `/public/...` and still serves the file. `npm run build` copies the contents of `public/` straight into the root of `dist/`, with no `public` folder, so on Vercel the file is at `/hero-1920.webp` and `/public/hero-1920.webp` returns 404. Files from `public/` must be referenced from the root, without `public` (as in the Vite docs). Recommended checking the production build with `npm run build && npm run preview` (`http://localhost:4173`) before pushing changes to images, paths or environment variables, because `npm run dev` does not show this kind of error.
**What I did myself:** Removed `/public` from the three paths in `Hero.tsx`, checked the build with `npm run build` and `npm run preview`

## 10.11.2026

**Tool:** ChatGPT
**Task:** Filter search results by free dates and guests
**What AI did:**
Explaned

- How to implement it so nothing is missed, and which boundary cases to test
- How to check that dates overlap: two date ranges overlap when each one starts before the other ends: `from < bookedTo && bookedFrom < to`; strict `<` (not `<=`) makes the check-out day free: a new guest can check in on the day the previous guest checks out. Booking sites work this way; dates are compared as "YYYY-MM-DD" strings, which sort the same way as dates; only check-in without check-out (e.g. typed into the URL by hand): no date filter, only the guest filter.
- Time zones: the API stores dates in UTC, e.g. "2026-11-20T00:00:00.000Z". A booking made in Norway at local midnight can be stored as "2026-11-19T23:00:00.000Z"; cutting the first 10 characters (`slice(0, 10)`) would give 19 Nov instead of 20 Nov, one day off; fix: `toDateInputValue(new Date(booking.dateFrom))` converts to local time first, so both formats give 20 Nov in Norway.
  **What I did myself:** Added `isAvailable`, the `search` prop on `VenueCard`, the filter in `HomePage` and `VenueResults`. Tested on real data: `/?guests=10` shows only venues for 10+ guests; card links contain `?from=…&to=…`; changing dates updates the list without a loader. Tested on the real booking of "Villa in Norway" (9–12 Nov): no dates - shown; 10–11 Nov - hidden; 11–13 Nov - hidden; 12–14 Nov - shown (check-in on the check-out day)

## 10.11.2026

**Tool:** ChatGPT
**Task:** Choose how `VenueImage` should load photos on the venue page
**What AI did:** Explained why one loading mode for all photos is not enough. Until now every photo used `loading="lazy"`: the browser loads it only when it is about to scroll into view. This is good for the venue cards on the home page (many images, most of them below the fold). But the big photo at the top of the venue page is visible right away. With `lazy` the browser waits to load it, so it appears with a delay. This hurts LCP (Largest Contentful Paint), and Lighthouse lowers the Performance score. Suggested an optional `loading` prop (`'lazy' | 'eager'`) on `VenueImage` with `'lazy'` as the default, so the home page cards keep working as before and only the main gallery photo uses `loading="eager"`.
**What I did myself:** Added the `loading` prop to the `VenueImage` interface (`loading?: 'lazy' | 'eager'`), set the default in the function signature (`loading = 'lazy'`), replaced `loading="lazy"` with `loading={loading}` in `<img>`, used `loading="eager"` for the main photo in `VenueGallery`

## 2026-11-20 - 2026-12-06

**Tool:** ChatGPT
**Task:** Write alt text for the photos and description of my test venues
**What AI did:** Suggested a short alt text for each venue photo I shared. Suggested a descriptions for photo. Kept alt text under 120 characters. Followed simple alt text rules.
**What I did myself:** Chose the photos and checked that the image links are public (https). Read every suggested text. Entered the alt texts and descriptions in the venues form and saved the venues. Checked the result on the venue page and in the gallery.

## 2026-11-25

**Tool:** ChatGPT
**Task:** Decide if the home page needs a way to clear the whole search (word, dates, guests) with one click, and how to do it.
**What AI did:**

- Listed the ways to reset the search that already existed and why they were not enough
- Pointed out the real gap: after a search with dates and guests, the user had to clear each field by hand and search again to see all venues.
- Explained the common pattern: a "Clear search" / "Clear all" link next to the results, shown only while a filter is active.
- Gave three options with pros and cons:
  1. a "Clear search" link next to the results heading (recommended);
  2. a "Clear" button inside the search form (the form is already tight on phones);
  3. no change
     **What I did myself:** Chose option 1 and agreed to remove the duplicate "Show all venues" button, created the GitHub issue and added the code to `VenueResults.tsx`, `VenueResults.module.css` and `NoResults.tsx`.

## 25.11.2026

**Tool:** ChatGPT
**Task:** A discussion on where short-lived, pop-up notifications ("toasts") might be useful.
**What AI did:** Gave a rule: use a toast when an action succeeds but the result is not visible on the screen (a modal closes or the page changes). Do not use one when the result is already visible, or for errors. Checked each action: delete a venue: the app goes to the profile or the card just disappears, so a toast is needed; create and edit a venue: the modal closes and the change is easy to miss, so a toast is useful; book a stay: the "Booking created!" block already confirms it with more detail, so no toast; avatar, login, register: the result is visible at once, so no toast.
**What I did myself:** Suggested toasts for deleting and creating a venue and for booking a stay, avatar changing. Agreed on three places, all for the venue manager: create, edit and delete a venue. Booking keeps its "Booking created!" block.

## 2026-11-27

**Tool:** ChatGPT
**Task:** Brainstorm: review the "+ List your venue" (header) and "+ Create venue" (profile) buttons for the venue manager: colour hierarchy, layout and common sense.
**What AI did:** gave the rule: one action, one name, one prominent place per screen. The header button exists to create a venue from any page, so it is not needed where the page has its own button. Gave options: hide the header button on the profile page and call it "Create venue" for managers everywhere, keeping "List your venue" only for visitors, where it means "become a host"; keep both buttons with one name; remove the profile button.
**What I did myself:** Noticed the two similar buttons on the profile page and asked for a review of their colour, layout and logic. Chose option

## 2026-11-27

**Tool:** ChatGPT
**Task:** Brainstorm: redesign the "+ Create venue" button in the header: use the secondary colour (Spruce) and rethink the hover.
**What AI did:** Gave three options: (A) a filled Spruce button: very visible, but it competes with the red main action, and Spruce already means "selected dates, success"; (B) a Spruce outline and text with a light Spruce background on hover; (C) Spruce text only: too small to tap. Recommended B. Explained that B follows the same pattern as `.dangerOutline` (coloured outline, light tint on hover) and checked the contrast: Spruce on white 7.5:1, on light Spruce 6.5:1.
**What I did myself:** Wanted the header button to look different and suggested the secondary colour and a better hover. Chose option B and decided to use it for all secondary buttons, not only in the header

## 2026-11-28

**Tool:** hatGPT
**Task:** Change style of venues ctaegories chips
**What AI did:** Suggested options: (B) tabs with the icon above the word and a Spruce line under the selected one; (C) soft light Spruce chips with a filled selected chip. Recommended B as calmer next to the red search button.
**What I did myself:** Chose variant C .Added the code.

## 2026-11-28

**Tool:** ChatGPT
**Task:** Brainstorm: how to let users get back to the top of the home page after a long list of venues.
**What AI did:** Gave four options: (A) a floating arrow button that shows after scrolling: familiar, but it covers cards on phones and needs a scroll listener and extra state; (B) a "Back to top" button at the end of the list next to "Show more venues": shows up where the user stops scrolling, covers nothing, needs no listener and stays in the normal Tab order; (C) the logo scrolls to the top: hidden, and the logo link to "/" clears the search; (D) do nothing and rely on browser keys and gestures: not everyone knows them. Recommended B, with no animation when the user prefers reduced motion and focus moved to the search so keyboard users do not stay at the bottom. Also suggested "Back to search", which scrolls to the search form instead of the very top.
**What I did myself:** Noticed that getting back to the top of the home page is hard after loading more venues and asked for options. Chose option B
