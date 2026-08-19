// Valid promotional codes for checkout
const COUPONS = {
  "PAYFLOW20": { code: "PAYFLOW20", discountType: "percentage", value: 20, description: "20% off your total order" },
  "WELCOME10": { code: "WELCOME10", discountType: "fixed", value: 10, description: "$10 off initial subscription" },
  "STRIPE50": { code: "STRIPE50", discountType: "percentage", value: 50, description: "50% Special Partner Discount" }
};

module.exports = COUPONS;
