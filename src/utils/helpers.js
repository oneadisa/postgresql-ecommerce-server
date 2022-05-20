import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {updateAny} from '../services';


/**
 * Hashes a password
 * @param {string} password Password to encrypt.
 * @memberof Helpers
 * @return {Promise<string>} Encrypted password.
*/
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, bcrypt.genSaltSync(10));
};

/**
 * Compares a password with a given hash
 * @param {string} password Plain text password.
 * @param {string} hash Encrypted password.
 * @memberof Helpers
 * @return {boolean} returns true if there is a match and false otherwise.
*/
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 *  Synchronously sign the given payload into a JSON Web Token string.
 * @param {string | number | Buffer | object} payLoad Payload to sign.
 * @param {string | number} expiresIn Expressed in seconds or a string
 * describing a time span. Eg: 60, "2 days", "10h", "7d". Default specified
 * is 1day.
 * @memberof Helpers
 * @return {string} JWT token.
 */
export const generateToken = (payLoad, expiresIn = '1d') => {
  return jwt.sign(payLoad, '' + process.env.SECRET, {expiresIn});
};

/**
*  Synchronously sign the given payload into a JSON Web Token
*  string that never expires.
* @static
* @param {string | number | Buffer | object} payLoad Payload to sign.
* @memberof Helpers
* @return {string} JWT token.
*/
export const generateTokenAlive = (payLoad) => {
  return jwt.sign(payLoad, process.env.SECRET);
};

/**
*  Synchronously sign the given payload into a JSON Web Token
*  string that never expires.
* @memberof Helpers
* @param {object} user The input param.
* @return {string} JWT token.
*/
export const getResetPasswordToken = async (user) => {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString('hex');
  // Hashing and adding resetPasswordToken to userSchema
  user.resetPasswordToken =
  crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await updateAny({
    resetPasswordToken: crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex'), resetPasswordExpire: Date.now() + 15 * 60 * 1000,
  }, {id: user.id});
  return resetToken;
};

const Peep = function(firstName) {
  'use strict';
  const peep = {};
  peep.firstName = firstName;

  peep.innerSayHello = function() {
    console.log('Hello, I\'m ' + peep.firstName + '.');
  };

  return peep;
};

const peep1 = new Peep('Bob');
const peep2 = new Peep('Doug');

peep1.innerSayHello();
peep2.innerSayHello();


/**
 * Generates a JSON response for success scenarios.
 * @param {Response} res Response object.
 * @param {object} data The payload.
 * @param {number} code HTTP Status code.
 * @memberof Helpers
//  * @return {Response} A JSON success response.
*/
export const successResponse = (res, data, code = 200) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.status(code).json({
    status: 'success',
    data,
  });
};

/**
 * Generates a JSON response for failure scenarios.
 * @param {Response} res Response object.
 * @param {object} options The payload.
 * @param {number} options.code HTTP Status code, default is 500.
 * @param {string} options.message Error message.
 * @param {object} options.errors A collection of  error message.
 * @memberof Helpers
//  * @return {Response} A JSON failure response.
*/
export const errorResponse = (res,
    {code = 500,
      message = 'Some error occurred while processing your Request',
      errors}) => {
  res.header('Access-Control-Allow-Origin', '*',
      // 'Access-Control-Allow-Methods', '*',
      // 'Access-Control-Allow-Headers', '*'
  );
  res.status(code).json({
    status: 'fail',
    error: {
      message,
      errors,
    },
  });
};

/**
 *  Generates token upon first signup to be used by subesquent users
 * @param {string} letterIdentifier - one letter identifier of establishment.
 * @param {number} id - one letter identifier of establishment
 * @memberof Helpers
 * @return {string} JWT token.
 */
export const generateTokenOnSignup = (letterIdentifier, id) => {
  const randomNumber = Math.floor(Math.random() * 8999 + 1000);
  const anotherRandomNumber = Math.floor(Math.random() * 8999 + 1000);
  const token =
    `${letterIdentifier}.${id}.${randomNumber}@${anotherRandomNumber}`;
  return token;
};

/**
* Checks token from request header for user authentication
* @param {object} req - The request from the endpoint
* @memberof Helpers
* @return {Token} Token
*/
export const checkToken = async (req) => {
  const {
    headers: {authorization},
    cookies: {token: cookieToken},
  } = req;
  let bearerToken = null;
  if (authorization) {
    bearerToken = authorization.split(' ')[1] ?
      authorization.split(' ')[1] : authorization;
  }
  return cookieToken || bearerToken || req.headers['x-access-token'] ||
    req.headers.token || req.body.token;
};

/**
   *
   *  Synchronously verify the given JWT token using a secret
   * @param {*} token - JWT token.
   * @return {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   * @memberof Helpers
   */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (err) {
    throw new Error('Invalid Token');
  }
};

/**
   * Generates email verification link
   * @static
   * @param { Request } req - Request object
   * @param { object } options - Contains user's data to be signed within Token.
   * @param { string } options.id - User's unique ID.
   * @param { string } options.email - User's email.
   * @param { string } options.role - User's role.
   * @memberof Helpers
   * @return {URL} - Verification link.
   */
export const generateVerificationLink = (req, {id, email, role}) => {
  const token = generateToken({id, email, role});
  // eslint-disable-next-line max-len
  const host = req.hostname === 'localhost' ? `${req.hostname}:${process.env.PORT}` :
    req.hostname;
  return `${req.protocol}://${host}/api/auth/verify?token=${token}`;
};


/**
* Extracts a new user object from the one supplied
* @param {object} user - The user data from which a new user
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractUserData = (user) => {
  return {
    id: user.id,
    isVerified: user.isVerified,
    token: user.token,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accountType: user.accountType,
    role: user.role,
    gender: user.gender,
    phoneNumber: user.phoneNumber,
    avatar: user.avatar,
    meansOfID: user.meansOfID,
    IDpic: user.IDpic,
    bankCode: user.bankCode,
    bankAccountName: user.bankAccountName,
    bankAccountNumber: user.bankAccountNumber,
    walletBalance: user.walletBalance,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
* Extracts a new business object from the one supplied
* @param {object} business - The user data from which a new business
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractBusinessData = (business) => {
  return {
    id: business.id,
    businessName: business.businessName,
    natureOfBusiness: business.natureOfBusiness,
    businessAddress: business.businessAddress,
    businessType: business.businessType,
    cacCertURL: business.cacCertURL,
    formCO7: business.formCO7,
    userId: business.userId,
    createdAt: business.createdAt,
    updatedAt: business.updatedAt,
  };
};

/**
* Extracts a new store object from the one supplied
* @param {object} store - The user data from which a new store
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractStoreData = (store) => {
  return {
    id: store.id,
    storeName: store.storeName,
    storeTagline: store.storeTagline,
    storeDescription: store.storeDescription,
    storeLink: store.storeLink,
    category: store.category,
    storeLogo: store.storeLogo,
    storeBackground: store.storeBackground,
    deliveryPrice: store.deliveryPrice,
    businessId: store.businessId,
    userId: store.userId,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
};

/**
* Extracts a new product object from the one supplied
* @param {object} product - The user data from which a new product
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractProductData = (product) => {
  return {
    id: product.id,
    productTitle: product.productTitle,
    shortDescription: product.shortDescription,
    productDetails: product.productDetails,
    images: product.images,
    discountedPrice: product.discountedPrice,
    price: product.price,
    productUnitCount: product.productUnitCount,
    deliveryPrice: product.deliveryPrice,
    numberOfReviews: product.numberOfReviews,
    ratings: product.ratings,
    category: product.category,
    storeId: product.storeId,
    userId: product.userId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};


/**
* Extracts a new product Review object from the one supplied
* @param {object} productReview - The user data from which a new product Review
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractProductReviewData = (productReview) => {
  return {
    id: productReview.id,
    comment: productReview.comment,
    firstName: productReview.firstName,
    lastName: productReview.lastName,
    businessName: productReview.businessName,
    rating: productReview.rating,
    productId: productReview.productId,
    userId: productReview.userId,
    ownerId: productReview.ownerId,
    createdAt: productReview.createdAt,
    updatedAt: productReview.updatedAt,
  };
};

/**
* Extracts a new order object from the one supplied
* @param {object} order - The user data from which a new product Review
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractOrderData = (order) => {
  return {
    id: order.id,
    address: order.address,
    city: order.city,
    state: order.state,
    country: order.country,
    pinCode: order.pinCode,
    phoneNumber: order.phoneNumber,
    email: order.email,
    productName: order.productName,
    price: order.price,
    quantity: order.quantity,
    image: order.image,
    paymentInfoId: order.paymentInfoId,
    paymentInfoStatus: order.paymentInfoStatus,
    paidAt: order.paidAt,
    itemsPrice: order.itemsPrice,
    taxPrice: order.taxPrice,
    deliveryPrice: order.deliveryPrice,
    vendorsPay: order.vendorsPay,
    totalPrice: order.totalPrice,
    orderStatus: order.orderStatus,
    deliveredAt: order.deliveredAt,
    firstName: order.firstName,
    lastName: order.lastName,
    businessName: order.businessName,
    userId: order.userId,
    productId: order.productId,
    owner: order.owner,
    store: order.store,
    business: order.business,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

/**
* Extracts a new campaign object from the one supplied
* @param {object} campaign - The user data from which a new product Review
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractCampaignData = (campaign) => {
  return {
    id: campaign.id,
    campaignName: campaign.campaignName,
    natureOfBusiness: campaign.natureOfBusiness,
    campaignCategory: campaign.campaignCategory,
    businessAddressCountry: campaign.businessAddressCountry,
    businessAddressCity: campaign.businessAddressCity,
    businessAddressOffice: campaign.businessAddressOffice,
    phoneNumber: campaign.phoneNumber,
    investorBrief: campaign.investorBrief,
    campaignVideo: campaign.campaignVideo,
    pitchDeck: campaign.pitchDeck,
    idealTargetAudienceAge: campaign.idealTargetAudienceAge,
    idealTargetAudienceHealthIssuesOrDisabilities:
      campaign.idealTargetAudienceHealthIssuesOrDisabilities,
    gender: campaign.gender,
    ownerLogo: campaign.ownerLogo,
    fundingType: campaign.fundingType,
    categoryFunding: campaign.categoryFunding,
    amountBeingRaised: campaign.amountBeingRaised,
    amountAlreadyRaised: campaign.amountAlreadyRaised,
    amountRepaid: campaign.amountRepaid,
    amountToBeRepaid: campaign.amountToBeRepaid,
    amountToBeRepaidPerPayout: campaign.amountToBeRepaidPerPayout,
    pledgedProfitToLenders: campaign.pledgedProfitToLenders,
    durationPledgedProfit: campaign.durationPledgedProfit,
    repaymentSchedulePledgedProfit: campaign.repaymentSchedulePledgedProfit,
    endDatePledgedProfit: campaign.endDatePledgedProfit,
    endDatePledgedProfitStrin: campaign.endDatePledgedProfitString,
    timePerPayment: campaign.timePerPayment,
    equityOfferingPercentage: campaign.equityOfferingPercentage,
    bankCode: campaign.bankCode,
    bankAccountName: campaign.bankAccountName,
    bankAccountNumber: campaign.bankAccountNumber,
    duration: campaign.duration,
    goLiveSchedule: campaign.goLiveSchedule,
    familiarWithCrowdFunding: campaign.familiarWithCrowdFunding,
    storeOnGaged: campaign.storeOnGaged,
    endDate: campaign.endDate,
    firstPaymentDate: campaign.firstPaymentDate,
    firstPaymentDateString: campaign.firstPaymentDateString,
    endDateString: campaign.endDateString,
    twitter: campaign.twitter,
    facebook: campaign.facebook,
    whatsApp: campaign.whatsApp,
    business: campaign.business,
    userId: campaign.userId,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
};

/**
* Extracts a new campaign Review object from the one supplied
* @param {object} campaignReview - The user data
 from which a new campaign Review
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractCampaignReviewData = (campaignReview) => {
  return {
    id: campaignReview.id,
    comment: campaignReview.comment,
    firstName: campaignReview.firstName,
    lastName: campaignReview.lastName,
    businessName: campaignReview.businessName,
    campaignId: campaignReview.campaignId,
    userId: campaignReview.userId,
    createdAt: campaignReview.createdAt,
    updatedAt: campaignReview.updatedAt,
  };
};

/**
* Extracts a new donation object from the one supplied
* @param {object} donation - The user data from which a new donation
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractDonationData = (donation) => {
  return {
    id: donation.id,
    amount: donation.amount,
    firstName: donation.firstName,
    lastName: donation.lastName,
    businessName: donation.businessName,
    amountToBeRepaid: donation.amountToBeRepaid,
    amountToBeRepaidPerTime: donation.amountToBeRepaidPerTime,
    amountAlreadyRepaid: donation.amountAlreadyRepaid,
    firstPaymentDate: donation.firstPaymentDate,
    lastPaymentDate: donation.lastPaymentDate,
    campaignId: donation.campaignId,
    campaignName: donation.campaignName,
    ownerLogo: donation.ownerLogo,
    investorBrief: donation.investorBrief,
    userId: donation.userId,
    createdAt: donation.createdAt,
    updatedAt: donation.updatedAt,
  };
};

/**
* Extracts a new product Image object from the one supplied
* @param {object} productImage - The user data from which a new product Image
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractProductImageData = (productImage) => {
  return {
    id: productImage.id,
    publicId: productImage.publicId,
    url: productImage.url,
    userId: productImage.userId,
    productId: productImage.productId,
    createdAt: productImage.createdAt,
    updatedAt: productImage.updatedAt,
  };
};


/**
* Extracts a new product Image object from the one supplied
* @param {object} wallet - The user data from which a new product Image
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractWalletData = (wallet) => {
  return {
    id: wallet.id,
    userId: wallet.userId,
    balance: wallet.balance,
    createdAt: wallet.createdAt,
    updatedAt: wallet.updatedAt,
  };
};


/**
* Extracts a new payout object from the one supplied
* @param {object} payout - The user data from which a new payout
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractPayoutData = (payout) => {
  return {
    id: payout.id,
    amount: payout.amount,
    firstName: payout.firstName,
    lastName: payout.lastName,
    businessName: payout.businessName,
    amountToBeRepaid: payout.amountToBeRepaid,
    amountToBeRepaidPerTime: payout.amountToBeRepaidPerTime,
    amountAlreadyRepaid: payout.amountAlreadyRepaid,
    firstPaymentDate: payout.firstPaymentDate,
    lastPaymentDate: payout.lastPaymentDate,
    campaignId: payout.campaignId,
    campaignName: payout.campaignName,
    ownerLogo: payout.ownerLogo,
    investorBrief: payout.investorBrief,
    userId: payout.userId,
    createdAt: payout.createdAt,
    updatedAt: payout.updatedAt,
  };
};

