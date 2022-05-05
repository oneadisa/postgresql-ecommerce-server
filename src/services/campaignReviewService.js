

import {findUserBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';
// const { Op } = require('@sequelize/core');
const {CampaignReview} = db;

/**
 * Creates a new Campaign Review.
 *
 * @param {object} campaignReviewInfo - The review to be saved in the database.
 * @memberof CampaignReviewService
 * @return {Promise<object>} A promise object with user detail.
 */
export const createCampaignReview = async (campaignReviewInfo) => {
  const user = findUserBy({id: campaignReviewInfo.userId});
  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);
  const newCampaignReview = await CampaignReview.create(campaignReviewInfo);

  return newCampaignReview.dataValues;
};

/**
 * Find a campaign review
 * @param {number | object | string} options - CampaignReview search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof CampaignReviewService
 */
export const findCampaignReviewBy = async (options) => {
  return CampaignReview.findOne({where: options});
};

/**
 * Find all campaign reviews given a query
 * @param {number | object | string} options - CampaignReview search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof CampaignReviewService
 */
export const findCampaignReviewsBy = async (options) => {
  return CampaignReview.findAll({where: options});
};

/**
 * Find all campaign reviews given a query
 * @param {number | object | string} options - CampaignReview search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof CampaignReviewService
 */
export const findCampaignReviewsRating = async (options) => {
  await CampaignReview.findAll({where: options,
    attributes: [
      [sequelize.fn('average', sequelize.col('rating')), 'total_ratings'],
    ],
  });

  // eslint-disable-next-line max-len
  // findAll({where: options}, {attributes: [[sequelize.fn('SUM', sequelize.col('rating')), 'ratings']]});
};

/**
   *
   * updates an existing CampaignReview by ID
   * @static
   * @param {object} CampaignReviewData user properties to be updated
    * @param {string} id user id
   * @return {Promise<object | null | string> } an object containing the updated
   * properties of the user is returned on success
   * or a null value if update fails, and an error message if a user is not
   *  found
   * @memberof CampaignReviewService
   */
export const updateCampaignReviewById = async (CampaignReviewData, id) => {
  const [rowaffected, [campaign]] = await CampaignReview.update(
      CampaignReviewData,
      {returning: true, where: {id}},
  );
  if (!rowaffected) throw new ApiError('Not Found');
  return campaign;
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {campaignEmail}
 * @memberof CampaignReviewService
 * @return {Promise<CampaignReview>} A promise object with campaign detail.
 */
export const updateCampaignReviewBy = async (newValues, obj) => {
  const campaign = await findCampaignReviewBy(obj);
  if (!campaign) {
    throw new ApiError(404, `CampaignReview with ${obj} does not exist`);
  }

  return await campaign.update(newValues);
};

/**
 * Find all product reviews given a query and give count
 * @param {number | object | string} options - Donation search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof DonationService
 */
export const findCampaignReviewsAndCountBy = async (options) => {
  return await CampaignReview.findAndCountAll({where: options});
};

/**
  * Fetches a campaign instance based on it's primary key.
  * @param {integer} campaignId - Primary key of the campaign to be fetched.
  * @param {object} options - Additional query information
  * @return {Promise<array>} - An instance of CampaignReview table including
  *  it's relationships.
  * @memberof CampaignReviewService
  */
export const findCampaignReviewById = async (campaignId, options = {}) => {
  return CampaignReview.findByPk(campaignId, options);
};

/**
 * Fetches all campaigns
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof CampaignReviewService
 */
export const fetchAllCampaignReviews = async () => {
  const campaigns = await CampaignReview.findAll({});
  return campaigns;
};


/**
    * Updates all campaigns' status to seen for a specific user.
    * @param {integer} campaignId - The campaign Id.
    * @return {Promise<array>} - An instance of campaign table including
    *  it's relationships.
    * @memberof CampaignReviewService
*/
export const deleteCampaignReview = async (campaignId) => {
  const deleted = await CampaignReview.destroy({
    where: {id: campaignId},
  });
  return deleted;
};

/**
* Get user's request history from database
* @param {integer} id - The user id
* @return {Promise<object>} A promise object with user requests.
* @memberof RequestService
*/
// export const getRequests = async (id) => {
//   return Request.findAll({
// include: [{
//   model: Status,
//   as: 'status',
//   attributes: ['label'],
// },
// {
//   model: User,
//   as: 'manager',
//   attributes: ['lineManager'],
// }],
// where: {requesterId: id},
//   });
// };
