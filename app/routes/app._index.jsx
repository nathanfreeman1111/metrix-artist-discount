import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

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

export default function Index() {
  const {
    shop,
    appName,
    features,
    setup,
  } = useLoaderData();

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
        <strong>Connected Store:</strong>
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
        <h2>Setup Configuration</h2>

        <div
          style={{
            marginTop: "20px"
          }}
        >
          <p>
            <strong>
              Customer Metafield:
            </strong>{" "}
            {setup.customerMetafield}
          </p>

          <p>
            <strong>
              Benefit Usage Flag:
            </strong>{" "}
            {setup.benefitFlag}
          </p>
        </div>
      </div>

      {/* Features */}

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
        <h2>Features</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "15px",
            marginTop: "20px"
          }}
        >
          {features.map(
            (feature, i) => (
              <div
                key={i}
                style={{
                  background:
                    "#f1f8ff",
                  padding: "15px",
                  borderRadius: "8px",
                  border:
                    "1px solid #d4e7ff",
                }}
              >
                ✓ {feature}
              </div>
            )
          )}
        </div>
      </div>

      {/* Tier Table */}

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
        <h2>Artist Tiers</h2>

        <div
          style={{
            overflowX: "auto",
            marginTop: "20px"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse"
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "#f1f1f1"
                }}
              >
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
                (tier, i) => (
                  <tr key={i}>
                    <td>{tier.tier}</td>
                    <td>{tier.credits}</td>
                    <td>{tier.primer}</td>
                    <td>{tier.hydra}</td>
                    <td>{tier.wrap}</td>
                    <td>
                      {tier.shipping}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tags */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 1px 3px rgba(0,0,0,.08)"
        }}
      >
        <h2>Required Product Tags</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {setup.tags.map(
            (tag, i) => (
              <div
                key={i}
                style={{
                  background:
                    "#eee",
                  padding:
                    "8px 14px",
                  borderRadius:
                    "30px",
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