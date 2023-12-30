import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.log("[WEBHOOK_ERROR]", error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return new Response("Webhook error: Missing metadata", { status: 400 });
    }

    await db.purchase.create({
      data: {
        userId,
        courseId,
      },
    });
  } else {
    return new Response(`Webhook error: Invalid event: ${event.type}`, {
      status: 200,
    });
  }

  return new Response(null, { status: 200 });
}
