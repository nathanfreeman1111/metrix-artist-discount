import {
  useLoaderData,
  useActionData,
  Form,
} from "react-router";

import { authenticate } from "../shopify.server";

const FUNCTION_ID =
  "019e4ea0-9846-73a0-b0b3-d2ab84d90055";

export const loader = async ({ request }) => {
  const { session } =
    await authenticate.admin(request);

  return Response.json({
    shop: session.shop,

    appName: "Metrix Artist Discount",

    features: [
      "Artist tier automatic discounts",
      "Customer metafield support",
      "One-time benefit protection",
      "Credit-based product rewards",
      "Automatic Primer allocation",
      "Automatic Hydra allocation",
      "Automatic Wrap allocation",
      "Signature product support",
      "Traditional product support",
      "Cheapest item calculation",
      "Tier-based free shipping",
    ],

    setup: {
      customerMetafield: "artistTier",
      benefitFlag: "benefitUsed",

      tiers: [
        {
          tier: "1A",
          credits: 10,
          primer: 1,
          hydra: 1,
          wrap: 1,
          shipping: "Free",
        },
        {
          tier: "1B",
          credits: 10,
          primer: 1,
          hydra: 1,
          wrap: 1,
          shipping: "No",
        },
        {
          tier: "2A",
          credits: 6,
          primer: 1,
          hydra: 1,
          wrap: 1,
          shipping: "Free",
        },
        {
          tier: "2B",
          credits: 12,
          primer: 2,
          hydra: 2,
          wrap: 2,
          shipping: "Free",
        },
      ],

      tags: [
        "artist-signature",
        "artist-traditional",
        "artist-primer",
        "artist-hydra",
        "artist-wrap",
      ],
    },
  });
};

export async function action({
  request,
}) {
  const { admin } =
    await authenticate.admin(request);

  const code =
    "ARTIST-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  const response =
    await admin.graphql(
      `#graphql

mutation CreateDiscount(
$code:String!,
$functionId:String!,
$startsAt:DateTime!
){

discountCodeAppCreate(
codeAppDiscount:{

title:"Artist Discount"

code:$code

functionId:$functionId

startsAt:$startsAt

discountClasses:[
PRODUCT
]

}
){

codeAppDiscount{
discountId
}

userErrors{
field
message
}

}

}
`,
      {
        variables: {
          code,
          functionId:
            FUNCTION_ID,

          startsAt:
            new Date()
              .toISOString(),
        },
      }
    );

  const result =
    await response.json();

  return Response.json({
    code,
    result,
  });
}

export default function Index() {
  const {
    shop,
    appName,
    features,
    setup,
  } = useLoaderData();

  const actionData =
    useActionData();

  return (
    <div
      style={{
        padding: "30px",
        background: "#f6f6f7",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "10px",
        }}
      >
        {appName}
      </h1>

      {/* Store */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow:
            "0 1px 3px rgba(0,0,0,.08)"
        }}
      >
        <strong>
          Connected Store:
        </strong>

        <div
          style={{
            marginTop: "8px",
            color: "#666"
          }}
        >
          {shop}
        </div>
      </div>

      {/* Setup */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow:
            "0 1px 3px rgba(0,0,0,.08)"
        }}
      >
        <h2>
          Setup Configuration
        </h2>

        <p>
          <strong>
            Customer Metafield:
          </strong>{" "}
          {
            setup.customerMetafield
          }
        </p>

        <p>
          <strong>
            Benefit Flag:
          </strong>{" "}
          {
            setup.benefitFlag
          }
        </p>
      </div>

      {/* Features */}

      <div
        style={{
          background:"#fff",
          padding:"20px",
          borderRadius:"12px",
          marginBottom:"20px"
        }}
      >
        <h2>Features</h2>

        <div
          style={{
            display:"grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap:"15px",
            marginTop:"20px"
          }}
        >
          {features.map(
            (feature,i)=>(
              <div
                key={i}
                style={{
                  background:"#f1f8ff",
                  padding:"15px",
                  borderRadius:"8px"
                }}
              >
                ✓ {feature}
              </div>
            )
          )}
        </div>
      </div>

      {/* Coupon */}

      <div
        style={{
          background:"#fff",
          padding:"20px",
          borderRadius:"12px",
          marginBottom:"20px"
        }}
      >
        <h2>
          Coupon Generator
        </h2>

        <p>
          Create discount code
          connected to your
          Artist Function
        </p>

        <Form method="post">

          <button
            type="submit"
            style={{
              background:"#008060",
              color:"#fff",
              border:"none",
              padding:"12px 20px",
              borderRadius:"8px",
              cursor:"pointer"
            }}
          >
            Create Coupon Code
          </button>

        </Form>

        {actionData?.code && (

          <div
            style={{
              marginTop:"20px",
              padding:"15px",
              background:"#E3F1DF",
              borderRadius:"8px"
            }}
          >
            <strong>
              Coupon Created:
            </strong>

            <div
              style={{
                marginTop:"10px",
                fontSize:"18px",
                fontWeight:"700"
              }}
            >
              {actionData.code}
            </div>
          </div>

        )}

        {actionData?.result
          ?.data
          ?.discountCodeAppCreate
          ?.userErrors
          ?.map(
            (error,index)=>(
              <div
                key={index}
                style={{
                  color:"red",
                  marginTop:"10px"
                }}
              >
                {error.message}
              </div>
            )
        )}

      </div>

      {/* Tiers */}

      <div
        style={{
          background:"#fff",
          padding:"20px",
          borderRadius:"12px",
          marginBottom:"20px"
        }}
      >
        <h2>
          Artist Tiers
        </h2>

        <table
          style={{
            width:"100%",
            marginTop:"20px"
          }}
        >
          <thead>
            <tr>
              <th>Tier</th>
              <th>Credits</th>
              <th>Primer</th>
              <th>Hydra</th>
              <th>Wrap</th>
              <th>Shipping</th>
            </tr>
          </thead>

          <tbody>
            {setup.tiers.map(
              (tier,i)=>(
                <tr key={i}>
                  <td>{tier.tier}</td>
                  <td>{tier.credits}</td>
                  <td>{tier.primer}</td>
                  <td>{tier.hydra}</td>
                  <td>{tier.wrap}</td>
                  <td>{tier.shipping}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Tags */}

      <div
        style={{
          background:"#fff",
          padding:"20px",
          borderRadius:"12px"
        }}
      >
        <h2>
          Required Product Tags
        </h2>

        <div
          style={{
            display:"flex",
            gap:"10px",
            flexWrap:"wrap",
            marginTop:"20px"
          }}
        >
          {setup.tags.map(
            (tag,i)=>(
              <div
                key={i}
                style={{
                  background:"#eee",
                  padding:"8px 14px",
                  borderRadius:"30px"
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>

    </div>
  );
}