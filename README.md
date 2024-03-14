# Supabase edge function with Prisma Accelerate

This project demonstrates the integration of Prisma ORM with
[Prisma Accelerate](https://www.prisma.io/data-platform/accelerate) within
[Supabase edge functions](https://supabase.com/docs/guides/functions).

## Prerequisites

- Have Deno installed
- Have Docker installed for testing Supabase edge functions
- Meet the
  [requirements]((https://www.prisma.io/docs/accelerate/getting-started#prerequisites))
  for using Prisma Accelerate

1. Fill in your `.env` file with the `DATABASE_URL` (Prisma Accelerate
   connection string) and a `DIRECT_URL` (for database migrations):

   ```bash
   DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key="
   DIRECT_URL="postgres://root:password@127.0.0.1:5432/postgres"
   ```

2. Generate a `PrismaClient`:

   ```bash
   deno run -A --unstable npm:prisma generate --no-engine
   ```

## Test App Locally

1. Start the app:

   ```bash
   npx supabase start
   ```

2. Watch logs and debug:

   ```bash
   npx supabase functions serve --env-file ./supabase/.env --no-verify-jwt
   ```

3. Visit `http://127.0.0.1:54321/functions/v1/hello-accelerate`

## Deploy to Production

1. Add secrets to production:

   ```bash
   npx supabase secrets set --env-file ./supabase/.env
   ```

2. Deploy to production:

   ```bash
   npx supabase deploy --no-verify-jwt
   ```
