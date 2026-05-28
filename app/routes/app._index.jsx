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
          "Reset artist_benefit_used monthly"
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

export async function action({ request }) {

  const { admin } =
    await authenticate.admin(request);

  const formData =
    await request.formData();

  const actionType =
    formData.get("actionType");

  if(actionType === "createMetafields") {

    try {

    const response = await admin.graphql(`
    mutation {

    artistTier: metafieldDefinitionCreate(
    definition: {
    name: "Artist Tier"
    namespace: "custom"
    key: "artist_tier"
    description: "Artist Tier"
    type: "single_line_text_field"
    ownerType: CUSTOMER
    }
    ) {
    createdDefinition {
    id
    name
    }
    userErrors {
    message
    }
    }

    artistBenefit: metafieldDefinitionCreate(
    definition: {
    name: "Artist Benefit Used"
    namespace: "custom"
    key: "artist_benefit_used"
    description: "Artist Benefit Used"
    type: "single_line_text_field"
    ownerType: CUSTOMER
    }
    ) {
    createdDefinition {
    id
    name
    }
    userErrors {
    message
    }
    }

    }
    `);

    const result = await response.json();

    console.log(
    JSON.stringify(result, null, 2)
    );

    return Response.json(result);

    } catch(error) {

    console.log(error);

    return Response.json({
    error: error.message
    });

    }

    }

  if(actionType === "createDiscount"){

    const response =
      await admin.graphql(

`
mutation CreateAutomaticDiscount(
$functionId:String!,
$startsAt:DateTime!
){

discountAutomaticAppCreate(

automaticAppDiscount:{
title:"Artist Automatic Discount"
functionId:$functionId
startsAt:$startsAt
discountClasses:[PRODUCT]
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
functionId:FUNCTION_ID,
startsAt:new Date().toISOString()
}
}

);

    const result =
      await response.json();

    return Response.json({
      type:"discount",
      data:result
    });

  }

  return null;

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

<div style={{padding:"40px",background:"#F8FAFC",minHeight:"100vh",maxWidth:"1440px",margin:"0 auto",fontFamily:"'Inter',sans-serif",color:"#111827"}}>

<div style={{marginBottom:"35px"}}>

<div style={{color:"#6D28FF",fontWeight:"700",fontSize:"14px",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"12px"}}>
Artist Discount System
</div>

<h1 style={{fontSize:"52px",fontWeight:"800",lineHeight:"1.05",margin:"0",letterSpacing:"-2px"}}>
Automatic Artist
<br />
Discount Management
</h1>

<div style={{marginTop:"20px",maxWidth:"700px",fontSize:"18px",lineHeight:"1.7",color:"#6B7280"}}>
Manage artist rewards, metafields, automatic discounts, free shipping tiers and product eligibility directly from your Shopify admin.
</div>

</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"20px",marginBottom:"24px"}}>

<div style={{background:"#fff",padding:"28px",borderRadius:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<div style={{fontSize:"14px",fontWeight:"700",color:"#6D28FF",marginBottom:"12px"}}>
CONNECTED STORE
</div>

<div style={{fontSize:"24px",fontWeight:"800",marginBottom:"8px"}}>
{shop}
</div>

<div style={{color:"#6B7280"}}>
Embedded Shopify App Connected Successfully
</div>

</div>

<div style={{background:"linear-gradient(135deg,#7C3AED,#6D28FF)",padding:"28px",borderRadius:"24px",color:"#fff",boxShadow:"0 15px 35px rgba(109,40,255,.25)"}}>

<div style={{fontSize:"14px",fontWeight:"700",opacity:".8",marginBottom:"12px"}}>
SYSTEM STATUS
</div>

<div style={{fontSize:"30px",fontWeight:"800",marginBottom:"10px"}}>
Active
</div>

<div style={{opacity:".9"}}>
All automatic artist systems are configured and operational.
</div>

</div>

</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(420px,1fr))",gap:"24px"}}>

<div style={{background:"#fff",padding:"30px",borderRadius:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<h2 style={{fontSize:"28px",fontWeight:"800",marginBottom:"24px"}}>
App Setup
</h2>

<p style={{color:"#6B7280",marginBottom:"24px",lineHeight:"1.7"}}>
Automatically create all required customer metafields and prepare the store for artist discount automation.
</p>

<Form method="post">

<input
type="hidden"
name="actionType"
value="createMetafields"
/>

<button type="submit" style={{background:"linear-gradient(135deg,#7C3AED,#6D28FF)",color:"#fff",padding:"14px 22px",border:"none",borderRadius:"14px",cursor:"pointer",fontWeight:"700",fontSize:"15px",boxShadow:"0 10px 20px rgba(109,40,255,.25)"}}>
Create Metafields
</button>

</Form>

</div>

<div style={{background:"#fff",padding:"30px",borderRadius:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<h2 style={{fontSize:"28px",fontWeight:"800",marginBottom:"24px"}}>
Customer Requirements
</h2>

<div style={{fontWeight:"700",marginBottom:"18px"}}>
Required Customer Tag
</div>

<div style={{marginBottom:"24px"}}>

{setup.customerTags.map((tag,index)=>(

<span key={index} style={{background:"#F3EEFF",color:"#6D28FF",padding:"10px 16px",borderRadius:"999px",marginRight:"10px",fontWeight:"700",fontSize:"14px"}}>
{tag}
</span>

))}

</div>

<div style={{padding:"20px",background:"#FFF7ED",borderRadius:"18px",border:"1px solid #FED7AA"}}>

<div style={{fontWeight:"800",marginBottom:"12px"}}>
Monthly Reset Required
</div>

<div style={{color:"#6B7280",lineHeight:"1.7"}}>
{setup.automation.monthlyReset}
</div>

<div style={{marginTop:"12px",color:"#6B7280",lineHeight:"1.7"}}>
{setup.automation.resetAction}
</div>

</div>

</div>

</div>

<div style={{background:"#fff",padding:"30px",borderRadius:"24px",marginTop:"24px",marginBottom:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"20px"}}>

<div>

<h2 style={{fontSize:"32px",fontWeight:"800",margin:"0 0 10px 0"}}>
Platform Features
</h2>

<div style={{color:"#6B7280"}}>
Everything included in the artist automation engine.
</div>

</div>

<div style={{background:"#F3EEFF",padding:"10px 18px",borderRadius:"999px",fontWeight:"700",color:"#6D28FF"}}>
{features.length} Features
</div>

</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"16px"}}>

{features.map((feature,index)=>(

<div key={index} style={{background:"#F5F3FF",padding:"20px",borderRadius:"20px",border:"1px solid #E9D5FF"}}>

<div style={{fontSize:"18px",marginBottom:"10px"}}>
✓
</div>

<div style={{fontWeight:"700",color:"#4C1D95",lineHeight:"1.6"}}>
{feature}
</div>

</div>

))}

</div>

</div>

<div style={{background:"#fff",padding:"30px",borderRadius:"24px",marginBottom:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"20px"}}>

<div>

<h2 style={{fontSize:"32px",fontWeight:"800",margin:"0 0 10px 0"}}>
Automatic Discount
</h2>

<div style={{color:"#6B7280"}}>
Create Shopify automatic discounts connected directly to your function extension.
</div>

</div>

<div style={{background:"#DCFCE7",padding:"10px 18px",borderRadius:"999px",fontWeight:"700",color:"#166534"}}>
Shopify Functions
</div>

</div>

<Form method="post">

<input
type="hidden"
name="actionType"
value="createDiscount"
/>

<button type="submit" style={{background:"linear-gradient(135deg,#7C3AED,#6D28FF)",color:"#fff",padding:"14px 22px",border:"none",borderRadius:"14px",cursor:"pointer",fontWeight:"700",fontSize:"15px",boxShadow:"0 10px 20px rgba(109,40,255,.25)"}}>
Create Automatic Discount
</button>

</Form>

{actionData?.data?.discountAutomaticAppCreate?.userErrors?.map((error,index)=>{

const alreadyExists =
error.message.includes("Title must be unique");

return (

<div key={index} style={{marginTop:"24px",padding:"20px",background:"#FFF7ED",borderRadius:"18px",border:"1px solid #FED7AA"}}>

{alreadyExists ? (

<>

<div style={{fontWeight:"800",marginBottom:"12px",fontSize:"18px"}}>
⚠ Automatic discount already exists
</div>

<div style={{marginBottom:"18px",color:"#6B7280"}}>
You already created the Artist Automatic Discount.
</div>

<a href={`https://${shop}/admin/discounts`} target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"12px 18px",background:"linear-gradient(135deg,#7C3AED,#6D28FF)",color:"#fff",textDecoration:"none",borderRadius:"14px",fontWeight:"700"}}>
Open Discount Page
</a>

</>

) : (

<div style={{color:"red"}}>
{error.message}
</div>

)}

</div>

);

})}

</div>

<div style={{background:"#fff",padding:"30px",borderRadius:"24px",marginBottom:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"20px"}}>

<div>

<h2 style={{fontSize:"32px",fontWeight:"800",margin:"0 0 10px 0"}}>
Artist Tiers
</h2>

<div style={{color:"#6B7280"}}>
Tier-based reward allocation and free shipping configuration.
</div>

</div>

<div style={{background:"#F3EEFF",padding:"10px 18px",borderRadius:"999px",fontWeight:"700",color:"#6D28FF"}}>
{setup.tiers.length} Tiers
</div>

</div>

<table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 12px"}}>

<thead>

<tr>

<th style={{padding:"14px",textAlign:"center",color:"#6B7280",fontSize:"14px",textTransform:"uppercase"}}>Tier</th>

<th style={{padding:"14px",textAlign:"center",color:"#6B7280",fontSize:"14px",textTransform:"uppercase"}}>Credits</th>

<th style={{padding:"14px",textAlign:"center",color:"#6B7280",fontSize:"14px",textTransform:"uppercase"}}>Primer</th>

<th style={{padding:"14px",textAlign:"center",color:"#6B7280",fontSize:"14px",textTransform:"uppercase"}}>Hydra</th>

<th style={{padding:"14px",textAlign:"center",color:"#6B7280",fontSize:"14px",textTransform:"uppercase"}}>Wrap</th>

<th style={{padding:"14px",textAlign:"center",color:"#6B7280",fontSize:"14px",textTransform:"uppercase"}}>Shipping</th>

</tr>

</thead>

<tbody>

{setup.tiers.map((tier,index)=>(

<tr key={index} style={{background:"#F9FAFB"}}>

<td style={{padding:"18px",textAlign:"center",fontWeight:"800"}}>{tier.tier}</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.credits}</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.primer}</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.hydra}</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.wrap}</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.shipping}</td>

</tr>

))}

</tbody>

</table>

</div>

<div style={{background:"#fff",padding:"30px",borderRadius:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"20px"}}>

<div>

<h2 style={{fontSize:"32px",fontWeight:"800",margin:"0 0 10px 0"}}>
Required Product Tags
</h2>

<div style={{color:"#6B7280"}}>
Products must contain these tags to participate in artist reward automation.
</div>

</div>

<div style={{background:"#DCFCE7",padding:"10px 18px",borderRadius:"999px",fontWeight:"700",color:"#166534"}}>
Product Rules
</div>

</div>

<div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>

{setup.tags.map((tag,index)=>(

<div key={index} style={{background:"#F3EEFF",color:"#6D28FF",padding:"12px 18px",borderRadius:"999px",fontWeight:"700",fontSize:"14px"}}>
{tag}
</div>

))}

</div>

</div>

</div>

);

}