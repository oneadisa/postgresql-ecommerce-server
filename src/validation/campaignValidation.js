/* eslint-disable max-len */
import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates campaign parameters upon registration
 *
 * @param {object} campaign The campaign object
 * @return {boolean} returns true/false.
 */
export const validateCampaign = async (campaign) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    campaignName: Joi.string().required()
        .label('Please enter a name for your campaign.'),
    natureOfBusiness: Joi.string().valid('LLC', 'sole proprietorship', 'unregistered')
        .required()
        .label('Please provide your nature of business.'),
    campaignCategory: Joi.string().valid('community', 'transport', 'education',
        'hospitality', 'technology',
        'food and drink', 'retail', 'travel',
        'health and fitness', 'creative arts',
        'sports', 'entertainment', 'tourism',
        'politics', 'leisure').required()
        .label('Please provide a valid category for your campaign.'),
    businessAddressCountry: Joi.string().required()
        .label('Please provide the country of residence of your business or headquarters.'),
    businessAddressCity: Joi.string()
        .required()
        .label('Please provide the city of residence of your business or headquarters.'),
    businessAddressOffice: Joi.string()
        .required()
        .label('Please provide the address of your business or headquarters.'),
    phoneNumber: Joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/)
        .label('Please input a valid phone number'),
    investorBrief: Joi.string()
        .required()
        .label('Please provide your investors with a brief.'),
    campaignVideo: Joi.string()
        .required()
        .label('Please provide a link to your campaign video.'),
    pitchDeck: Joi.string()
        .required()
        .label('Please provide a pitch deck for your campaign.'),
    idealTargetAudienceAge: Joi.string().valid('children', 'youths', 'older')
        .label('Please provide your ideal target audience age.'),
    idealTargetAudienceHealthIssuesOrDisabilities: Joi.string().valid('physical disabilities', 'addiction issues',
        'cognitive or learning disabilities')
        .label('Please provide a valid disabled audience you want to serve.'),
    gender: Joi.string().valid('male', 'female', 'gender neutral', 'non-binary')
        .label('Please provide a valid gender audience.'),
    fundingType: Joi.string().valid('debt', 'equity')
        .required()
        .label('Please provide a type of campaign.'),
    categoryFunding: Joi.string().valid('tier 1', 'tier 2', 'tier 3',
        'tier 4')
        .required()
        .label('Please provide a category for funding.'),
    amountBeingRaised: Joi.number()
        .required()
        .label('Please indicate how much you intend to raise.'),
    pledgedProfitToLenders: Joi.number(),
    durationPledgedProfit: Joi.number().label('Please indicate the period you would like to repay your loan.'),
    duration: Joi.number().label('Please provide a period after which you would like to start repaying your loan.'),
    repaymentSchedulePledgedProfit: Joi.number(),
    equityOfferingPercentage: Joi.number(),
    bankCode: Joi.number()
        .required()
        .label('Please provide your bank code.'),
    bankAccountName: Joi.string()
        .required()
        .label('Please provide your Bank Account Name.'),
    bankAccountNumber: Joi.number()
        .required()
        .label('Please provide your Bank Account Number.'),
    familiarWithCrowdFunding: Joi.string().valid('yes', 'no')
        .required()
        .label('Please indicate wheteher or not you are familiar with crowdfunding.'),
    storeOnGaged: Joi.string().valid('yes', 'no')
        .required()
        .label('Please indicate wheteher of not you have a store on Gaged.'),
    goLiveSchedule: Joi.string(),
    ownerLogo: Joi.string(),
    business: Joi.string(),
    userId: Joi.number().required(),
  });
  const {error} = await schema.validateAsync(campaign);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
