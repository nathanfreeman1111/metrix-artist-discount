import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } =
    await authenticate.admin(request);

  console.log("Shop:", session.shop);
  console.log("Online:", session.isOnline);
  return Response.json({
      authenticated: true,
    shop: session.shop,
    online: session.isOnline,
    appName: "Metrix Artist Discount",
    features: [
      "Automatic artist-tier discounts",
      "Product eligibility rules",
      "Customer tag support",
      "Benefit usage tracking"
    ]
  });
};

export default function Index() {
  const { shop, appName, features } =
    useLoaderData();

  return (
    <div style={{padding:"30px"}}>
      <h1>{appName}</h1>

      <div
        style={{
          border:"1px solid #ddd",
          borderRadius:"8px",
          padding:"15px",
          marginBottom:"20px"
        }}
      >
        <strong>Store:</strong> {shop}
      </div>

      <div
        style={{
          border:"1px solid #ddd",
          borderRadius:"8px",
          padding:"15px"
        }}
      >
        <h2>Features</h2>

        <ul>
          {features.map((item,index)=>(
            <li key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}