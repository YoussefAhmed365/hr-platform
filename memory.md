# Memory — HR SaaS Auth & Onboarding Implementation

Last updated: 2026-09-28T22:30:00+03:00

## What was built

- Created complete, responsive, RTL-first authentication flow UI in `apps/landing/components/auth/` and `apps/landing/src/app/[locale]/(auth)/`.
- Developed individual components for Login, Signup (multi-step: Company, Admin Account), Email Verification, Password Recovery (Forgot/Reset), 2FA, and Company Onboarding (Structure, Team Setup, Branch Setup).
- Implemented reusable core UI components: `AuthInput`, `PasswordInput` (with strength indicator), `AuthButton`, `AuthAlert`, and `AuthProgress`.
- Established a dedicated `AuthLanguageProvider` ensuring independent translation contexts away from `next-intl`.
- Finalized visual identity drawing heavily from the landing page: centered card layouts, blur blob background accents, specific border radius/shadow logic, minimal inputs matching the brand's Green+Lime palette.

## Decisions made

- Maintained complete separation between Auth UI and next-intl by using a raw context provider `AuthLanguageContext`.
- Designed an abstracted, API-agnostic auth service (`authService` in `lib/auth/service.ts`) using simulated responses for now, which can easily be wired to NestJS later.
- Avoided 3rd party UI libraries like Tailwind UI in favor of highly customized, brand-specific Vanilla Tailwind CSS to ensure pixel-perfect fidelity to the product's landing page aesthetic.
- Avoided all mentions of technical jargon like AI or PostgreSQL per product requirements.

## Problems solved

- Solved relative import issues in TypeScript type-checking that broke when restructuring auth sub-folders.
- Isolated auth styles and context so they do not accidentally collide or conflict with the `portal` app or non-auth `landing` routes.
- Adjusted duplicate html/body tags out of the `(auth)/layout.tsx` to ensure `[locale]/layout.tsx` is the sole owner of root HTML tags, preventing hydration mismatch errors.

## Current state

- The frontend authentication and onboarding components are entirely built, styled, and type-checked.
- Form validation (using manual validations logic mimicking Zod for simplicity) works perfectly, and RTL flips logically.
- Fake `authService` handles state transitions realistically with delays and mock errors (like expired tokens or incorrect credentials).

## Next session starts with

- Wiring the `authService` implementations to actual backend endpoints.
- Verifying cookie management (session handling) on Next.js server actions.

## Open questions

- Will the JWT session be handled via Next.js Middleware or solely via client-side Context/Cookies?
- What are the exact actual backend URL routes in the NestJS application for authentication and onboarding?
