// Import statements
import { withAccelerate } from "npm:@prisma/extension-accelerate@1.0.0";
import { PrismaClient } from "../_shared/client/deno/edge.ts";
// import { withPulse } from "npm:@prisma/extension-pulse";
import { Hono } from "https://deno.land/x/hono@v4.1.0/mod.ts";
import { upgradeWebSocket } from "https://deno.land/x/hono@v4.1.0/helper.ts";

const app = new Hono();

// app.get(
//   "/hello-accelerate/ws",
//   upgradeWebSocket(async (c) => {
//     const prismaPulse = new PrismaClient().$extends(
//       withPulse({
//         apiKey: Deno.env.get("PULSE_API_KEY")!,
//       })
//     );

//     const personStream = await prismaPulse.person.subscribe();

//     return {
//       async onMessage(event, ws) {
//         if (personStream instanceof Error) {
//           console.log(personStream);
//           ws.send("Hey ankur, something happened");
//         } else {
//           console.log(`Message from client: ${event.data}`);
//           for await (const event of personStream) {
//             ws.send(JSON.stringify(event));
//           }
//         }
//       },

//       onClose: () => {
//         console.log("Connection closed");
//         personStream.stop();
//       },
//     };
//   })
// );

app.get("/hello-accelerate/add-user", async (c) => {
  // Create Prisma client
  const prisma = new PrismaClient({
    datasourceUrl: Deno.env.get("DATABASE_URL"),
  }).$extends(withAccelerate());

  const user = Math.floor(Math.random() * 1000);

  const person = await prisma.person.create({
    data: {
      name: `Person ${user}`,
      description: `Just user ${user}`,
    },
  });

  return c.json(person);
});

app.get("/hello-accelerate", async (c) => {
  // Create Prisma client
  const prisma = new PrismaClient({
    datasourceUrl: Deno.env.get("DATABASE_URL"),
  }).$extends(withAccelerate());

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
