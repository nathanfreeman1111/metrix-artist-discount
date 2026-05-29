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
          shipping: "No",
        },

        {
          tier: "2B",
          credits: 12,
          primer: 2,
          hydra: 2,
          wrap: 2,
          shipping: "No",
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
      data:result.data
    });

  }

  return null;

}

export default function Index() {

const {
shop,
features,
setup,
} = useLoaderData();

const actionData =
useActionData();

return (

<div style={{padding:"40px",background:"#F8FAFC",minHeight:"100vh",maxWidth:"1440px",margin:"0 auto",fontFamily:"Inter,sans-serif",color:"#111827"}}>

<div style={{marginBottom:"35px"}}>

<div style={{color:"#6D28FF",fontWeight:"700",fontSize:"14px",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"12px"}}>
Artist Discount System
</div>

<h1 style={{fontSize:"42px",fontWeight:"800",lineHeight:"1.05",margin:"0",letterSpacing:"-2px"}}>
Automatic Artist Discount Management
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

<div style={{background:"#fff",padding:"30px",borderRadius:"24px",marginBottom:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"20px"}}>

<div>

<h2 style={{fontSize:"32px",fontWeight:"800",margin:"0 0 10px 0"}}>
Required Store Setup
</h2>

<div style={{color:"#6B7280"}}>
Configure the following metafields and customer requirements before using artist automation.
</div>

</div>

<div style={{background:"#F3EEFF",padding:"10px 18px",borderRadius:"999px",fontWeight:"700",color:"#6D28FF"}}>
Manual Setup
</div>

</div>

<div style={{display:"grid",gap:"20px"}}>

<div style={{padding:"20px",background:"#F8FAFC",borderRadius:"20px",border:"1px solid #E5E7EB"}}>

<div style={{fontWeight:"800",fontSize:"20px",marginBottom:"18px"}}>
Artist Tier Metafield
</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"16px"}}>

<div>
<div style={{fontSize:"12px",fontWeight:"700",color:"#6B7280",marginBottom:"8px"}}>
NAMESPACE
</div>
<div style={{fontWeight:"700"}}>
custom
</div>
</div>

<div>
<div style={{fontSize:"12px",fontWeight:"700",color:"#6B7280",marginBottom:"8px"}}>
KEY
</div>
<div style={{fontWeight:"700"}}>
artist_tier
</div>
</div>

<div>
<div style={{fontSize:"12px",fontWeight:"700",color:"#6B7280",marginBottom:"8px"}}>
TYPE
</div>
<div style={{fontWeight:"700"}}>
Choice List(Single line text) set value 1a , 1b , 2a ,2b
</div>
</div>

</div>

</div>

<div style={{padding:"20px",background:"#F8FAFC",borderRadius:"20px",border:"1px solid #E5E7EB"}}>

<div style={{fontWeight:"800",fontSize:"20px",marginBottom:"18px"}}>
Artist Benefit Used Metafield
</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"16px"}}>

<div>
<div style={{fontSize:"12px",fontWeight:"700",color:"#6B7280",marginBottom:"8px"}}>
NAMESPACE
</div>
<div style={{fontWeight:"700"}}>
custom
</div>
</div>

<div>
<div style={{fontSize:"12px",fontWeight:"700",color:"#6B7280",marginBottom:"8px"}}>
KEY
</div>
<div style={{fontWeight:"700"}}>
artist_benefit_used
</div>
</div>

<div>
<div style={{fontSize:"12px",fontWeight:"700",color:"#6B7280",marginBottom:"8px"}}>
TYPE
</div>
<div style={{fontWeight:"700"}}>
True or false
</div>
</div>

</div>

</div>

<div style={{padding:"20px",background:"#FFF7ED",borderRadius:"20px",border:"1px solid #FED7AA"}}>

<div style={{fontWeight:"800",fontSize:"20px",marginBottom:"18px"}}>
Required Customer Tag
</div>

<div style={{display:"inline-flex",alignItems:"center",gap:"10px",background:"#F3EEFF",padding:"12px 18px",borderRadius:"999px",fontWeight:"700",color:"#6D28FF",marginBottom:"20px"}}>
✓ Sponsored Artist
</div>

<div style={{padding:"18px",background:"#FFFFFF",borderRadius:"16px",border:"1px solid #FCD34D"}}>

<div style={{fontWeight:"800",marginBottom:"12px",fontSize:"18px"}}>
Monthly Reset Flow Required
</div>

<div style={{color:"#6B7280",lineHeight:"1.8"}}>

A Shopify Flow automation must be configured to reset monthly artist usage and allow customers to reuse their artist rewards every month and get free shipping.
<br /><br />

The Flow should:
<br /><br />

• Reset <strong>artist_benefit_used</strong> metafield
<br />

• Reset artist usage counters
<br />

• Run once every month
<br />

• Target customers with the <strong>Sponsored Artist</strong> tag

</div>

</div>

</div>

<div style={{padding:"20px",background:"#EEF6FF",borderRadius:"20px",border:"1px solid #BFDBFE"}}>

<div style={{fontWeight:"800",fontSize:"20px",marginBottom:"12px"}}>
Setup Instructions
</div>

<div style={{color:"#475569",lineHeight:"1.8"}}>

1. Go to Shopify Settings → Custom Data → Customers
<br /><br />

2. Create the required customer metafields shown above
<br /><br />

3. Add the <strong>Sponsored Artist</strong> customer tag to eligible customers and customer must be login.
<br /><br />

4. Add required product tags to products eligible for artist rewards and one product with one artist tag only
<br /><br />

5. Create the automatic discount using the button below

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

{actionData?.data?.discountAutomaticAppCreate?.automaticAppDiscount && (

<div style={{marginTop:"24px",padding:"20px",background:"#DCFCE7",borderRadius:"18px",border:"1px solid #86EFAC",color:"#166534",fontWeight:"700"}}>

✓ Automatic discount created successfully

<div style={{marginTop:"14px"}}>

<a
href={`https://${shop}/admin/discounts`}
target="_blank"
rel="noreferrer"
style={{
display:"inline-block",
padding:"10px 16px",
background:"#166534",
color:"#fff",
textDecoration:"none",
borderRadius:"12px",
fontWeight:"700"
}}
>
Open Discounts
</a>

</div>

</div>

)}

</div>
<div style={{background:"#fff",padding:"30px",borderRadius:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<h2 style={{fontSize:"28px",fontWeight:"800",marginBottom:"24px"}}>
Required Product Tags(one tag per product)
</h2>

<div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>

{setup.tags.map((tag,index)=>(

<div key={index} style={{background:"#F3EEFF",color:"#6D28FF",padding:"10px 16px",borderRadius:"999px",fontWeight:"700",fontSize:"14px"}}>
{tag}
</div>

))}

</div>

</div>

<div style={{background:"#fff",padding:"30px",borderRadius:"24px",marginTop:"24px",border:"1px solid #EEF2F7",boxShadow:"0 10px 30px rgba(15,23,42,.04)"}}>

<h2 style={{fontSize:"28px",fontWeight:"800",marginBottom:"24px"}}>
Artist Tiers
</h2>

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

<td style={{padding:"18px",textAlign:"center",fontWeight:"700"}}>{tier.tier}</td>

<td style={{padding:"18px",textAlign:"center"}}>

<div style={{fontWeight:"700",marginBottom:"6px"}}>
{tier.credits} Credits
</div>

<div style={{fontSize:"13px",color:"#6B7280",lineHeight:"1.6"}}>
1 Signature = 1 Credit
<br />
1 Traditional = 2 Credits
</div>

</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.primer}</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.hydra}</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.wrap}</td>

<td style={{padding:"18px",textAlign:"center"}}>{tier.shipping}</td>

</tr>

))}

</tbody>

</table>

</div>
</div>

);

}