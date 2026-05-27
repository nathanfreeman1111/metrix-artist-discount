import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop } =
      await authenticate.webhook(request);

    console.log(`Webhook ${topic} from ${shop}`);

    return new Response("OK", {
      status: 200,
    });

  } catch (error) {
    console.error(error);

    return new Response("Unauthorized", {
      status: 401,
    });
  }
};