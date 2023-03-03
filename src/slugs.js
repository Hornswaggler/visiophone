import config from '/src/config';

export const slugs = {
  PurchaseCompleteReturn: "F_PurchaseCompleteReturn",
  PurchaseGet: "F_PurchaseGet",

  SamplePackPurchase: "F_SamplePackPurchase",
  SampleSearch: "F_SampleSearch",
  SampleUpload: "F_SampleUpload",

  SamplePackUpload: "F_SamplePackUpload",
  SamplePackSearch: "F_SamplePackSearch",
  SamplePackGetById: "F_SamplePackGetById",

  StripeProfileGet: "F_StripeProfileGet",
  StripeUploadsGet: "F_StripeUploadsGet",
  StripeProvisionUser: "F_StripeProvisionUser",
  StripeProvisionUserReturn: "F_StripeProvisionUserReturn",

  UserProfileSet: "F_UserProfileSet",

  GetPurchasedSample: "F_GetPurchasedSample",
  GetPurchasedSamplePack: "F_GetPurchasedSamplePack"
}

export const getUriForSlug = slug => `${config.VITE_API_BASE_URL}${slug}`;

export default {
  slugs,
  getUriForSlug
}