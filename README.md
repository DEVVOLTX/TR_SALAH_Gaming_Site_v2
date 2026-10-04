# SALAH STORE

<div align="center">

![SALAH STORE](https://img.shields.io/badge/SALAH-STORE-red?style=for-the-badge&logo=gamepad&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=progress&logoColor=white)

</div>

Modern gaming top-up storefront and admin dashboard for a fast-selling digital products business.

This project is a premium-looking static web app built with HTML, CSS, and JavaScript, designed for selling in-game items, top-ups, and gaming services with WhatsApp order flow.

## ✨ Highlights

- Premium gaming storefront design
- Fast product browsing by category
- WhatsApp order button for instant sales
- Admin panel to manage products, prices, and categories
- Local persistence using `localStorage`
- PWA-ready manifest and service worker
- Responsive layout for mobile and desktop

## 🧩 Project Structure

```text
TR_SALAH_Gaming_Site_v2/
├── index.html            # Main storefront
├── admin/                # Admin dashboard
│   ├── index.html
│   ├── README.md
│   └── ...
├── assets/               # Game/player images
├── vendor/               # Frontend libraries
├── support.js            # App logic
├── sw.js                 # Service worker
├── manifest.json         # PWA manifest
├── favicon.svg           # Brand icon
├── README.md             # Project documentation
└── ...
```

## 🚀 Quick Start

### Option 1: Upload to hosting

1. Upload all files in this repository to your web root (for example `public_html` or `www`).
2. Open the site in your browser.
3. For the admin panel, visit:

```text
https://your-domain.com/admin/
```

### Option 2: Run locally

```bash
cd TR_SALAH_Gaming_Site_v2
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## 🛍️ What this app includes

- Storefront for gaming products such as:
  - Free Fire diamonds
  - Drops
  - Level-up bundles
  - FIFA/football coins
  - Player cards
- Quick order flow through WhatsApp
- Admin dashboard for editing inventory and pricing
- Shared configuration via `localStorage` on the same domain

## 🔐 Important note

This project is designed as a demo/static storefront. It uses browser `localStorage` to save products and settings, so it is suitable for a prototype or single-domain demo.

It is not a full backend database system, so it is not intended for real multi-user production authentication or large-scale order management without adding a backend API.

## 🧠 Admin panel

The admin area is located in:

```text
/admin/
```

Inside the dashboard, you can:

- Add/edit products
- Change prices
- Create categories
- Modify WhatsApp number
- Remove items from the store

## 📦 Tech stack

- HTML5
- CSS3
- JavaScript
- React runtime included locally in `vendor/`
- Progressive Web App support

## 🏗️ Deployment notes

- The site is best hosted on a static host or a standard web hosting account.
- Keep the folder structure unchanged when uploading.
- The storefront and admin panel share the same browser storage key: `salah_store_data` on the same origin.

## 📸 Project status

This repository is a stylish, ready-to-upload gaming storefront concept with admin features focused on a fast e-commerce workflow for digital game products.

## 📄 License

This project is distributed as-is for educational/demo purposes.

## 💬 Support

For questions or improvements, feel free to contact the project maintainer or customize the store content to match your brand and products.

---

Made for a premium gaming commerce experience.
