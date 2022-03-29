/* eslint-disable max-len */
import {errorResponse} from '../utils/helpers';
import {findUserBy, findBusinessBy, findStoreBy,
  findOrdersAndCountBy} from '../services';
import {validateCampaign} from '../validation';

/**
 * Middleware method for campaign validation during campaign creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onCampaignCreation = async (req, res, next) => {
  try {
    const validated = await validateCampaign(req.body);
    if (validated) {
      const {userId} = req.body;
      const user = await findUserBy({id: userId});
      const business = await findBusinessBy({userId});
      const store = await findStoreBy({userId});
      const {orderNo, orders} = await findOrdersAndCountBy({ownerId: userId});
      const amountBeingRaised = Number(req.body.amountBeingRaised);
      // const {storeLink}= req.body;
      // const user = await findUserBy({id: req.user.id});
      // const campaign = await findBusinessBy({userId: req.user.id});
      // const store = await findCampaignBy({storeLink});
      if (!user) {
        errorResponse(res, {
          code: 404,
          message: `User with id: ${userId} does not exist`,
        });
      } else if (user.accountType !== 'business') {
        errorResponse(res, {
          code: 403,
          message: 'Only Business users are allowed to start a campaign.',
        });
      } else if (!business) {
        errorResponse(res, {
          code: 404,
          message: `User with id: ${userId} does not yet have a business,
           please create one to be able to create a campaign.`,
        });
      } else if (!store) {
        errorResponse(res, {
          code: 404,
          message: `User with id: ${userId} does not yet have a store,
   please create one to be able to create a campaign.`,
        });
      } else if (req.body.categoryFunding === 'tier 1' && orderNo < 5 ) {
        errorResponse(res, {
          code: 403,
          message: `This user ser with id: ${userId} does not yet have
           enough orders, you need at least 20 customers to create
            this tier of campaign.`,
        });
      } else if (req.body.categoryFunding === 'tier 2' && orderNo < 20) {
        errorResponse(res, {
          code: 403,
          message: `This user ser with id: ${userId} does not yet have
 enough orders, you need at least 20 customers to create
  this tier of campaign.`,
        });
      } else if (req.body.categoryFunding === 'tier 3' && orderNo < 50) {
        errorResponse(res, {
          code: 403,
          message: `This user ser with id: ${userId} does not yet have
 enough orders, you need at least 50 customers to create
  this tier of campaign.`,
        });
      } else if (req.body.categoryFunding === 'tier 4' && orderNo < 200) {
        errorResponse(res, {
          code: 403,
          message: `This user ser with id: ${userId} does not yet have
 enough orders, you need at least 200 customers to create
  this tier of campaign.`,
        });
      } else if (req.body.categoryFunding === 'tier 1' && amountBeingRaised > 100000) {
        errorResponse(res, {
          code: 403,
          message: `This category of funding does not permit more than #100,000.`,
        });
      } else if (req.body.categoryFunding === 'tier 2' && amountBeingRaised > 1000000) {
        errorResponse(res, {
          code: 403,
          message: `This category of funding does not permit more than #1,000,000.`,
        });
      } else if (req.body.categoryFunding === 'tier 3' && amountBeingRaised > 10000000) {
        errorResponse(res, {
          code: 403,
          message: `This category of funding does not permit more than #10,000,000.`,
        });
      } else if (req.body.categoryFunding === 'tier 4' && amountBeingRaised > 100000000) {
        errorResponse(res, {
          code: 403,
          message: `This category of funding does not permit more than #100,000,000.`,
        });
      } else {
        console.log(orders);
        next();
      }
    }
  } catch (error) {
    errorResponse(res, {
      code: error.status, message: error.message,
    });
  }
};

// else if (!user) {
// errorResponse(res, {
// code: 404,
// message: `User with id: ${userId} does not exist`,
// });
// }
