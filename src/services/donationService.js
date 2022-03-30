import {findUserBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';

const {Donation} = db;

/**
 * Adds donation to the database
 * @param {object} donation The donation to be added to the database.
 * @memberof DonationService
 * @return {Promise<Donation>} A promise object with donation detail.
 */
export const createDonation = async (donation) => {
  const user = findUserBy({id: donation.userId});
  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);
  const newDonation = await Donation.create(donation);

  return newDonation.dataValues;
};

/**
 *
 * updates an existing donation by ID
 * @param {object} donationData donation properties to be updated
 * @param {number} id donation id
 * @memberof DonationService
 */
export const updateDonationById = async (donationData, id) => {
  const donation = await findDonationBy({id: id});

  if (!donation) {
    throw new ApiError(404,
        `Donation with id: ${id} does not exist`);
  }

  return await donation.update(donationData);
};

/**
 * Finds donation in the database
 *
 * @param {object} options An object containing query options
 * @return {Promise<Donation>} A promise object with donation
 * detail if donation exists.
 */
export const findDonationBy = async (options) => {
  return await Donation.findOne({where: options});
};

/**
 * Find all product reviews given a query
 * @param {number | object | string} options - Donation search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof DonationService
 */
export const findDonationsBy = async (options) => {
  return Donation.findAll({where: options});
};

/**
   * Find all product reviews given a query
   * @param {number | object | string} options - Donation search value
   * @return {Promise<object>} A promise object with user detail.
   * @memberof DonationService
   */
export const findDonationsRating = async (options) => {
  await Donation.findAll({
    attributes: [{where: options},
      [sequelize.fn('average', sequelize.col('rating')), 'total_ratings'],
    ],
  });
};

/**
 * Fetches all donations
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof DonationService
 */
export const fetchAllDonations = async () => {
  const donations = await Donation.findAll({});
  return donations;
};

/**
 * Find all donations given a query and give count
 * @param {number | object | string} options - Donation search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof DonationService
 */
export const findDonationsAndCountBy = async (options) => {
  return await Donation.findAndCountAll({where: options});
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {donationEmail}
 * @memberof DonationService
 * @return {Promise<Donation>} A promise object with donation detail.
 */
export const updateDonationBy = async (newValues, obj) => {
  const donation = await findDonationBy(obj);
  if (!donation) {
    throw new ApiError(404, `Donation with ${obj} does not exist`);
  }

  return await donation.update(newValues);
};

/**
 * Deletes a donation record from the database.
 * @param {number} donationId - id of donation to be deleted from the database.
 * @return {Promise<object>} - A promise object which resolves
 * to the newly created donation.
 * @memberof DonationService
 */
export const deleteDonationById= (donationId) => {
  return Donation.destroy({where: {id: donationId}});
};
