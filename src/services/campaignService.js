import {findUserBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';

const {Campaign} = db;

/**
 * Adds campaign to the database
 * @param {object} campaign The campaign to be added to the database.
 * @memberof CampaignService
 * @return {Promise<Campaign>} A promise object with campaign detail.
 */
export const createCampaign = async (campaign) => {
  const user = findUserBy({id: campaign.userId});
  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);
  const newCampaign = await Campaign.create(campaign);

  return newCampaign.dataValues;
};

/**
 *
 * updates an existing campaign by ID
 * @param {object} campaignData campaign properties to be updated
 * @param {number} id campaign id
 * @memberof CampaignService
 */
export const updateCampaignById = async (campaignData, id) => {
  const campaign = await findCampaignBy({id: id});

  if (!campaign) {
    throw new ApiError(404,
        `Campaign with id: ${id} does not exist`);
  }

  return await campaign.update(campaignData);
};

/**
 * Finds campaign in the database
 *
 * @param {object} options An object containing query options
 * @return {Promise<Campaign>} A promise object with campaign
 * detail if campaign exists.
 */
export const findCampaignBy = async (options) => {
  return await Campaign.findOne({where: options});
};

/**
 * Find all product reviews given a query
 * @param {number | object | string} options - Campaign search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof CampaignService
 */
export const findCampaignsBy = async (options) => {
  return Campaign.findAll({where: options});
};

/**
   * Find all product reviews given a query
   * @param {number | object | string} options - Campaign search value
   * @return {Promise<object>} A promise object with user detail.
   * @memberof CampaignService
   */
export const findCampaignsRating = async (options) => {
  await Campaign.findAll({
    attributes: [{where: options},
      [sequelize.fn('average', sequelize.col('rating')), 'total_ratings'],
    ],
  });
};

/**
 * Fetches all campaigns
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof CampaignService
 */
export const fetchAllCampaigns = async () => {
  const campaigns = await Campaign.findAll({});
  return campaigns;
};

/**
 * Find all campaigns given a query and give count
 * @param {number | object | string} options - Campaign search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof CampaignService
 */
export const findCampaignsAndCountBy = async (options) => {
  return await Campaign.findAndCountAll({where: options});
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {campaignEmail}
 * @memberof CampaignService
 * @return {Promise<Campaign>} A promise object with campaign detail.
 */
export const updateCampaignBy = async (newValues, obj) => {
  const campaign = await findCampaignBy(obj);
  if (!campaign) {
    throw new ApiError(404, `Campaign with ${obj} does not exist`);
  }

  return await campaign.update(newValues);
};

/**
 * Deletes a campaign record from the database.
 * @param {number} campaignId - id of campaign to be deleted from the database.
 * @return {Promise<object>} - A promise object which resolves
 * to the newly created campaign.
 * @memberof CampaignService
 */
export const deleteCampaignById= (campaignId) => {
  return Campaign.destroy({where: {id: campaignId}});
};
