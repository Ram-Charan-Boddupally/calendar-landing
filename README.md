# Dinbox landing page

A mobile-first landing page for the calendar and gift-box business. All selling happens on WhatsApp, and website enquiries can be logged in a Google Sheet. "Dinbox" is a placeholder name.

## Folder

```
index.html            page structure + icon sprite
css/styles.css        all styles (mobile first, then 600 / 900 / 1100px)
js/config.js          EVERYTHING you edit: brand, WhatsApp, prices, box items, reviews
js/main.js            hero calendar, catalog, date preview, chat demo, form, WhatsApp links
js/box.js             3D "make your box" builder
assets/whatsapp-qr.svg  placeholder QR (replace)
assets/reviews/       put real customer photos here
apps-script/Code.gs   Google Sheet logger for enquiries
```

## Before launch (10 minutes)

1. **Brand:** in `js/config.js`, set `brand`, `tagline`, `instagram`. Also update the `<title>` and description in `index.html`.
2. **WhatsApp:** set `whatsappNumber` (digits only, with 91) and `whatsappDisplay`.
3. **QR code:** save your WhatsApp QR as `assets/whatsapp-qr.png` and set `qrImage: "assets/whatsapp-qr.png"`. To get it, open WhatsApp Business > Settings > QR code > Share.
4. **Prices and offer:** edit `mrp` values. `discount: 0.20` gives the 20% off shown everywhere. Set `orderCutoff` and `cutoffLabel`.
5. **Reviews:** replace the sample reviews. For each one, add `photo: "assets/reviews/ananya.jpg"` and set `sample: false`. The yellow "sample" note hides itself once no review is marked as a sample.
6. **FAQ:** check delivery times and policies in `index.html` (FAQ section) and make sure they match how you work.
7. **Sheet logging (optional but recommended):** follow the steps at the top of `apps-script/Code.gs`, then paste the web app URL into `sheetWebhook`.

## How the WhatsApp flow works

- **On phones**, every WhatsApp button opens a chat with a pre-filled message (which calendar, which box, extras and total).
- **On desktops**, the same buttons open a pop-up with your QR code, the ready message, a Copy button and an "Open WhatsApp here" link.
- **Enquiry form:** it checks the name and number, logs the enquiry to your sheet if `sheetWebhook` is set, then shows a "Continue on WhatsApp" button with the enquiry already typed.

## Your order pipeline (Sheet "Status" column)

New > Chatting > Paid > Dates added > Preview approved > Printing > Packed > Shipped > Delivered

Columns are already set up for the address, payment ref, custom dates, Canva link, printer and tracking number, so one sheet covers the whole journey from enquiry to delivery.

## Hosting

### GitHub Pages

This repository includes a GitHub Actions workflow that publishes the site whenever you push to `main`.

1. Push the repository to GitHub.
2. In the repository, open **Settings > Pages** and set **Build and deployment > Source** to **GitHub Actions**.
3. Push to `main` (or run **Actions > Deploy static site to GitHub Pages > Run workflow**). The deployed URL appears in the workflow run.

The HTML, CSS, JavaScript and asset URLs are relative, so they also work when GitHub Pages serves the site from a repository subpath (for example, `https://username.github.io/repository/`). No build step or path editing is needed.

Before sharing the site, replace the placeholder WhatsApp number and other launch settings in `js/config.js`.

### Other free hosts

- **Netlify:** drag this folder onto app.netlify.com/drop.
- **Vercel / Cloudflare Pages:** upload the folder as is. There's no build step.

Fonts load from Google Fonts (Shrikhand, Hanken Grotesk, Caveat).
