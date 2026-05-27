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
      customerMetafield:
        "artist_tier",

      benefitFlag:
        "artist_benefit_used",

      customerTags: [
        "Sponsored Artist"
      ],

      automation: {
        monthlyReset:
          "Shopify Flow required",

        resetAction:
          "Reset artist_benefit_used and usage counters monthly"
      },

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
    await authenticate.admin(
      request
    );

  const response =
    await admin.graphql(
`
#graphql

mutation CreateAutomaticDiscount(
$functionId:String!,
$startsAt:DateTime!
){

discountAutomaticAppCreate(

automaticAppDiscount:{

title:
"Artist Automatic Discount"

functionId:
$functionId

startsAt:
$startsAt

discountClasses:[
PRODUCT
]

}

){

automaticAppDiscount{
discountId
title
}

userErrors{
field
message
}

}

}

`,
{
variables:{
functionId:
FUNCTION_ID,

startsAt:
new Date()
.toISOString()
}
}
);

const result =
await response.json();

console.log(
JSON.stringify(
result,
null,
2
)
);

return Response.json(
result
);
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
padding:"30px",
background:"#f6f6f7",
minHeight:"100vh",
maxWidth:"1400px",
margin:"0 auto"
}}
>

<h1
style={{
fontSize:"32px",
marginBottom:"20px"
}}
>
{appName}
</h1>

<div
style={{
background:"#fff",
padding:"20px",
borderRadius:"12px",
marginBottom:"20px",
boxShadow:
"0 1px 3px rgba(0,0,0,.08)"
}}
>

<strong>
Connected Store
</strong>

<div
style={{
marginTop:"8px",
color:"#666"
}}
>
{shop}
</div>

</div>

<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(400px,1fr))",
gap:"20px"
}}
>

<div
style={{
background:"#fff",
padding:"20px",
borderRadius:"12px"
}}
>

<h2>
Setup Configuration
</h2>

<p>
<strong>
Customer Metafield:
</strong>
{" "}
{setup.customerMetafield}
</p>

<p>
<strong>
Benefit Flag:
</strong>
{" "}
{setup.benefitFlag}
</p>

</div>

<div
style={{
background:"#fff",
padding:"20px",
borderRadius:"12px"
}}
>

<h2>
Customer Requirements
</h2>

<strong>
Required Customer Tag
</strong>

<div
style={{
marginTop:"15px",
marginBottom:"20px"
}}
>

{setup.customerTags.map(
(tag,index)=>(
<span
key={index}
style={{
background:"#E3F1DF",
padding:"8px 15px",
borderRadius:"30px",
marginRight:"10px"
}}
>
{tag}
</span>
)
)}

</div>

<div
style={{
padding:"15px",
background:"#FFF7E6",
borderRadius:"8px"
}}
>

<strong>
Monthly Reset:
</strong>

<div
style={{
marginTop:"10px"
}}
>
{setup.automation.monthlyReset}
</div>

<div
style={{
marginTop:"10px"
}}
>
{setup.automation.resetAction}
</div>

</div>

</div>

</div>

<div
style={{
background:"#fff",
padding:"20px",
borderRadius:"12px",
marginTop:"20px",
marginBottom:"20px"
}}
>

<h2>
Features
</h2>

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
(feature,index)=>(
<div
key={index}
style={{
background:"#F1F8FF",
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

<div
style={{
background:"#fff",
padding:"20px",
borderRadius:"12px",
marginBottom:"20px"
}}
>

<h2>
Automatic Discount
</h2>

<p>
Creates a Shopify automatic
discount linked directly to
your Artist Function
</p>

<Form method="post">

<button
type="submit"
style={{
background:"#008060",
color:"#fff",
padding:"12px 20px",
border:"none",
borderRadius:"8px",
cursor:"pointer"
}}
>

Create Automatic Discount

</button>

</Form>

{actionData?.data
?.discountAutomaticAppCreate
?.userErrors
?.map((error,index)=>{

const alreadyExists =
error.message.includes(
"Title must be unique"
);

return (

<div
key={index}
style={{
marginTop:"20px",
padding:"15px",
background:"#FFF7E6",
borderRadius:"8px",
border:"1px solid #FFD79D"
}}
>

{alreadyExists ? (

<>

<div
style={{
fontWeight:"bold",
marginBottom:"10px"
}}
>
⚠ Automatic discount already exists
</div>

<div
style={{
marginBottom:"15px"
}}
>
You have already created
the Artist Automatic Discount.
</div>

<a
href={`https://${shop}/admin/discounts`}
target="_blank"
rel="noreferrer"
style={{
display:"inline-block",
padding:"10px 16px",
background:"#008060",
color:"#fff",
textDecoration:"none",
borderRadius:"8px"
}}
>
Open Discount Page
</a>

</>

) : (

<div
style={{
color:"red"
}}
>
{error.message}
</div>

)}

</div>

);

})}

{actionData?.data
?.discountAutomaticAppCreate
?.userErrors
?.map(
(error,index)=>(
<div
key={index}
style={{
marginTop:"10px",
color:"red"
}}
>
{error.message}
</div>
)
)}

</div>

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
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
    textAlign: "center"
  }}
>
  <thead>
    <tr
      style={{
        background: "#f5f5f5"
      }}
    >
      <th style={{padding:"12px"}}>
        Tier
      </th>

      <th style={{padding:"12px"}}>
        Credits
      </th>

      <th style={{padding:"12px"}}>
        Primer
      </th>

      <th style={{padding:"12px"}}>
        Hydra
      </th>

      <th style={{padding:"12px"}}>
        Wrap
      </th>

      <th style={{padding:"12px"}}>
        Shipping
      </th>
    </tr>
  </thead>

  <tbody>
    {setup.tiers.map(
      (tier,index)=>(
        <tr
          key={index}
          style={{
            borderBottom:
              "1px solid #eee"
          }}
        >
          <td style={{padding:"14px"}}>
            {tier.tier}
          </td>

          <td style={{padding:"14px"}}>
            {tier.credits}
          </td>

          <td style={{padding:"14px"}}>
            {tier.primer}
          </td>

          <td style={{padding:"14px"}}>
            {tier.hydra}
          </td>

          <td style={{padding:"14px"}}>
            {tier.wrap}
          </td>

          <td style={{padding:"14px"}}>
            {tier.shipping}
          </td>

        </tr>
      )
    )}
  </tbody>

</table>

</div>

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
(tag,index)=>(
<div
key={index}
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