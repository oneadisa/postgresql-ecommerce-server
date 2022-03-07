import {successResponse, errorResponse} from '../utils/helpers';
import {createBusiness} from '../services';

/**
 * Creates a new Business.
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof BusinnessController
 * @return {JSON} A JSON response with the created Business's details.
 */
export const addBusiness = async (req, res) => {
  try {
    const {body} = req;
    const business = await createBusiness(body);

    successResponse(res, {...business}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};
