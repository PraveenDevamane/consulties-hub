# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0195ab85-9ae7-4d5b-86c1-2078e275a173

# ConsultiesHub

This repository contains ConsultiesHub — a local business directory and publisher platform built with React, TypeScript, Vite, Tailwind CSS and Supabase.

This README documents the features implemented so far, how to run the app locally, how to seed sample data, and a brief note about Supabase Row-Level Security and publisher roles.

## Implemented features (high level)
This project is called COnsulties HUb using react tailwindcss,typescript 
Simply visit the [Lovable Project](https://lovable.dev/projects/0195ab85-9ae7-4d5b-86c1-2078e275a173) and start prompting.

- Split entry / Landing screen with two flows: "Login as User" and "Login as Publisher".
- Authentication and role-aware redirects (sign up can request the publisher role).
- Publisher module:
	- Publisher Dashboard with quick actions: Add Business, My Businesses, Advertisements, Feedback.
	- Add Business page with form (name, category, description, image url, lat/lng).
	- Advertisements page to create simple ads.
	- Publisher Feedback page: lists reviews for the publisher's businesses (shows "No ratings yet" when empty).
- User module:
	- User Dashboard with top search (debounced + optional voice input), horizontal category nav, featured businesses.
	- Category listing with card-based UI and sorting (Ratings, Near to You via geolocation, Non-busy placeholder).
	- User Bookings page showing service bookings made by the signed-in user.
	- User Feedback page showing reviews posted by the signed-in user (shows "No ratings yet" when none).
- Services & Bookings:
	- Services page with booking form that inserts into `service_bookings`.
	- Bookings are visible on the My Bookings page for the signed-in user.
- Seed script:
	- `scripts/seed-sample.mjs` — seed 18 sample businesses, a few bookings, and ads. Run with a service role key.

## Important notes about Supabase and roles

- The project uses Supabase with Row-Level Security (RLS). The DB migration defines policies such that:
	- Anyone authenticated can SELECT businesses and advertisements.
	- Only users with role `publisher` (in `user_roles`) may INSERT businesses or advertisements.
	- Users can INSERT feedback and service_bookings for themselves.

- Because of RLS, the app performs role checks before attempting publisher-only actions. If your user is not assigned the `publisher` role, the Add Business action will be rejected by the DB even if the client attempts to insert — you will see an informative toast.

## Run locally (macOS / zsh)

1. Install dependencies and start dev server

```bash
cd /Users/praveenkumardevamane/Desktop/consultiesHub/consulties-hub
npm install
npm run dev
```

2. Common routes during development

- `/` — Landing (choose User or Publisher flow)
- `/auth` — Login / Sign up
- `/user/dashboard` — User Home (search, categories, featured)
- `/user/bookings` — My Bookings
- `/user/feedback` — My Reviews
- `/publisher/dashboard` — Publisher Dashboard
- `/publisher/add-business` — Add Business form
- `/publisher/advertisements` — Publish advertisements
- `/publisher/feedback` — Publisher ratings & feedback

## Seed sample data

To populate the project with example businesses, bookings and ads, a seed script is included. It uses a Supabase service role key (admin) so it can bypass RLS.

1. Export environment variables and run the seed script (replace placeholders):

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
# optional: provide specific IDs
export PUBLISHER_ID="your-publisher-user-uuid"
export USER_ID="your-user-uuid"

npm run seed
```

2. Notes:
- The script fetches categories from the DB, so you don't need to supply category UUIDs.
- If you don't provide `PUBLISHER_ID`/`USER_ID`, it will try to list existing users (requires service role key) and use the first one.

## Seeding without service role key

If you can't use a service role key, run insert statements directly from the Supabase SQL editor (admin) or create a SQL file and execute it in the Supabase UI. See the `scripts/seed-sample.mjs` for reference sample data and SQL patterns.

## Troubleshooting

- Add Business fails with a permission or RLS error: Ensure the signed-in account has a `publisher` row in `user_roles`. If your DB doesn't allow client-side role assignment, create an admin SQL to insert a publisher role for the user:

```sql
INSERT INTO public.user_roles (user_id, role) VALUES ('<USER_UUID>', 'publisher');
```

- Search or category listing not showing new businesses: Confirm the insert succeeded in Supabase and that the business `category_id` references the correct category UUID.

## Next steps / TODOs

- Add publisher approval workflow (request/approve publisher role).
- Add real-time "Non-Busy" traffic status per business (requires external data or manual updates).
- Improve UI polish: serif headings, glassmorphism cards, and final color palette.

---

If you'd like, I can also add a short developer section with commands for linting, type-checking and running tests. Want me to add that? 
