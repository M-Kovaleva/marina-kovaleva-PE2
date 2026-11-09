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
