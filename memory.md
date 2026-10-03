# Memory — HR SaaS Auth & Onboarding Implementation

Last updated: 2026-10-01T21:00:00+03:00

## What was built

- Ported the Dashboard from the `landing` app to the `portal` app (React/Vite).
- Set up Tailwind CSS v4 in the `portal` app, migrating the Material 3 design tokens from the landing app to `index.css`.
- Recreated the dashboard layout, navigation (`react-router-dom`), metric tiles, and employee table in `apps/portal/src/components` and `src/pages`.
- Adapted the `authService` mock in the portal to read from the same `localStorage` key so session state persists across apps.
- Updated `landing` app's onboarding and 2FA completion to redirect to `portal` via the `NEXT_PUBLIC_PORTAL_URL` environment variable.

## Decisions made

- Chose to port Tailwind v4 directly to `apps/portal` instead of rewriting styles in vanilla CSS, as it was faster and ensured visual consistency with the `landing` app.
- Replaced `next-intl` from the landing app with a custom, lightweight `LanguageProvider` context in the portal that detects language from URL query parameters (e.g., `?lang=ar`), `localStorage`, or browser defaults.
- Used an environment variable (`NEXT_PUBLIC_PORTAL_URL`) in the `landing` app for the redirect to decouple the local development port from production.

## Problems solved

- Resolved module resolution errors in the portal by fixing relative import paths (`../` instead of `../../`) in the migrated React components.
- Avoided port collisions by configuring Vite to run on port `5174` since the default ports might overlap with Turbo repo execution.

## Current state

- The frontend authentication and onboarding components in `landing` redirect correctly to the dashboard in `portal`.
- The `portal` app runs independently on Vite with a full working mock of the dashboard (Overview, Employees, Branches tabs).
- Both apps use the same mock `authService` backed by `localStorage` for seamless state transitions in the MVP.

## Next session starts with

- Wiring the `authService` implementations to actual backend endpoints.
- Verifying cookie management (session handling) on Next.js server actions vs Vite client-side requests.

## Open questions

- Will the JWT session be handled via Next.js Middleware or solely via client-side Context/Cookies across domains?
- What are the exact actual backend URL routes in the NestJS application for authentication and onboarding?
