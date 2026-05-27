import {
  ProductDiscountSelectionStrategy,
} from '../generated/api';
/**
 * @typedef {import("../generated/api").CartInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

const TIERS = {

  "artist-tier-1a": {
    credits: 10,
    primer: 1,
    hydra: 1,
    wrap: 1,
    freeShipping: true,
  },

  "artist-tier-1b": {
    credits: 10,
    primer: 1,
    hydra: 1,
    wrap: 1,
    freeShipping: false,
  },

  "artist-tier-2a": {
    credits: 6,
    primer: 1,
    hydra: 1,
    wrap: 1,
    freeShipping: true,
  },

  "artist-tier-2b": {
    credits: 12,
    primer: 2,
    hydra: 2,
    wrap: 2,
    freeShipping: true,
  },
};

/**
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {

  /*
  |--------------------------------------------------------------------------
  | CUSTOMER
  |--------------------------------------------------------------------------
  */

  const customer =
    input.cart.buyerIdentity?.customer;

  if (!customer) {
    return {
      operations: [],
    };
  }

  /*
  |--------------------------------------------------------------------------
  | BLOCK SECOND ORDER
  |--------------------------------------------------------------------------
  */

  const benefitUsed =
    customer.benefitUsed?.value === "true";

  if (benefitUsed) {
    return {
      operations: [],
    };
  }

  /*
  |--------------------------------------------------------------------------
  | DETECT TIER FROM METAFIELD
  |--------------------------------------------------------------------------
  */

  let tier = null;

  const artistTier =
    customer.artistTier?.value?.toLowerCase();

  const tierMap = {
    "1a": "artist-tier-1a",
    "1b": "artist-tier-1b",
    "2a": "artist-tier-2a",
    "2b": "artist-tier-2b",
  };

  const tierKey =
    tierMap[artistTier];

  if (tierKey) {
    tier = TIERS[tierKey];
  }

  if (!tier) {
    return {
      operations: [],
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ALLOWANCES
  |--------------------------------------------------------------------------
  */

  let remainingCredits =
    tier.credits;

  let remainingPrimer =
    tier.primer;

  let remainingHydra =
    tier.hydra;

  let remainingWrap =
    tier.wrap;

  const targets = [];
  const creditLines = [];

  /*
  |--------------------------------------------------------------------------
  | LOOP CART
  |--------------------------------------------------------------------------
  */

  for (const line of input.cart.lines) {

    const product =
      line.merchandise.product;

    const quantity =
      line.quantity;

    const tags =
      product.productTags;

    const isSignature =
      tags.some(
        t =>
          t.tag === "artist-signature"
          && t.hasTag
      );

    const isTraditional =
      tags.some(
        t =>
          t.tag === "artist-traditional"
          && t.hasTag
      );

    const isPrimer =
      tags.some(
        t =>
          t.tag === "artist-primer"
          && t.hasTag
      );

    const isHydra =
      tags.some(
        t =>
          t.tag === "artist-hydra"
          && t.hasTag
      );

    const isWrap =
      tags.some(
        t =>
          t.tag === "artist-wrap"
          && t.hasTag
      );

    const unitPrice =
      parseFloat(
        line.cost.amountPerQuantity.amount
      );

    /*
    |--------------------------------------------------------------------------
    | PRIMER
    |--------------------------------------------------------------------------
    */

    if (isPrimer && remainingPrimer > 0) {

      const freeQty =
        Math.min(quantity, remainingPrimer);

      remainingPrimer -= freeQty;

      targets.push({
        cartLine: {
          id: line.id,
          quantity: freeQty,
        },
      });

      continue;
    }

    /*
    |--------------------------------------------------------------------------
    | HYDRA
    |--------------------------------------------------------------------------
    */

    if (isHydra && remainingHydra > 0) {

      const freeQty =
        Math.min(quantity, remainingHydra);

      remainingHydra -= freeQty;

      targets.push({
        cartLine: {
          id: line.id,
          quantity: freeQty,
        },
      });

      continue;
    }

    /*
    |--------------------------------------------------------------------------
    | WRAP
    |--------------------------------------------------------------------------
    */

    if (isWrap && remainingWrap > 0) {

      const freeQty =
        Math.min(quantity, remainingWrap);

      remainingWrap -= freeQty;

      targets.push({
        cartLine: {
          id: line.id,
          quantity: freeQty,
        },
      });

      continue;
    }

    /*
    |--------------------------------------------------------------------------
    | SIGNATURE / TRADITIONAL
    |--------------------------------------------------------------------------
    */

    if (isSignature || isTraditional) {

      creditLines.push({
        line,
        quantity,
        unitPrice,
        creditValue:
          isTraditional ? 2 : 1,
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SORT CHEAPEST FIRST
  |--------------------------------------------------------------------------
  */

  creditLines.sort((a, b) => {
    return a.unitPrice - b.unitPrice;
  });

  /*
  |--------------------------------------------------------------------------
  | APPLY CREDIT LOGIC
  |--------------------------------------------------------------------------
  */

  for (const item of creditLines) {

    const {
      line,
      quantity,
      creditValue,
    } = item;

    const maxFreeQty =
      Math.floor(
        remainingCredits / creditValue
      );

    if (maxFreeQty <= 0) {
      continue;
    }

    const freeQty =
      Math.min(quantity, maxFreeQty);

    remainingCredits -=
      freeQty * creditValue;

    targets.push({
      cartLine: {
        id: line.id,
        quantity: freeQty,
      },
    });
  }

  if (!targets.length) {
    return {
      operations: [],
    };
  }

  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates: [
            {
              message:
                'Artist Tier Free Products',

              targets,

              value: {
                percentage: {
                  value: 100,
                },
              },
            },
          ],

          selectionStrategy:
            ProductDiscountSelectionStrategy.First,
        },
      },
    ],
  };
}