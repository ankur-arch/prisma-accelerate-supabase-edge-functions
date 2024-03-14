// Import statements
import { withAccelerate } from "npm:@prisma/extension-accelerate@1.0.0";
import { PrismaClient } from "../_shared/client/deno/edge.ts";
import { Hono } from "https://deno.land/x/hono@v4.1.0/mod.ts";

const app = new Hono();

// Create Prisma client
const prisma = new PrismaClient({
  datasourceUrl: Deno.env.get("DATABASE_URL"),
}).$extends(withAccelerate());

app.get("/hello-accelerate", async (c) => {
  const person = await prisma.person
    .findFirst({
      select: {
        name: true,
      },
      cacheStrategy: {
        ttl: 60,
      },
    })
    .withAccelerateInfo();

  return c.json(person);
});

Deno.serve(app.fetch);

/* To invoke locally:
  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-accelerate' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'
*/
