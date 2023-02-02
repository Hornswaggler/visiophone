import config from '/src/config';

export const slugs = {
  PurchaseCompleteReturn: "F_PurchaseCompleteReturn",
  PurchaseGet: "F_PurchaseGet",

  SamplePurchase: "F_SamplePurchase",
  SampleSearch: "F_SampleSearch",
  SampleUpload: "F_SampleUpload",

  SamplePackUpload: "F_SamplePackUpload",
  StripeProfileGet: "F_StripeProfileGet",
  StripeProvisionUser: "F_StripeProvisionUser",
  StripeProvisionUserReturn: "F_StripeProvisionUserReturn",

  UserProfileSet: "F_UserProfileSet",
}

export const getUriForSlug = slug => `${config.VITE_API_BASE_URL}${slug}`;

export default {
  slugs,
  getUriForSlug
}