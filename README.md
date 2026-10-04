# SALAH STORE — Ready to Upload

- `/` = customer Home/storefront
- `/admin/` = admin dashboard
- Both use the same `localStorage` key (`salah_store_data`) when served from the same domain, so admin changes are reflected in Home on the same browser/origin.

Upload the **contents of this folder** to your hosting `public_html` (or equivalent web root).

Important: this package uses browser localStorage for the current demo. It is not a server database and is not suitable for real multi-device orders/authentication without a backend.
