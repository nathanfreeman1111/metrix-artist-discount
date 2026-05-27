import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return Response.json({
    authenticated: true,
    shop: session.shop,
    appName: "Metrix Artist Discount",
    features: [
      "Automatic artist-tier discounts",
      "Product eligibility rules",
      "Customer tag support",
      "Benefit usage tracking",
    ],
  });
};

export default function Index() {
  const { shop, appName, features } = useLoaderData();

  return (
    <div style={{ padding: "30px" }}>
      <h1>{appName}</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <strong>Store:</strong> {shop}
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "15px",
        }}
      >
        <h2>Features</h2>

        <ul>
          {features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}