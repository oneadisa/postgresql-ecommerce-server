import {changePasswordSchema, passwordResetEmailSchema}
  from '../validation/passwordValidator';
// import {Helpers} from '../utils';

// const {validate, errorResponse} = Helpers;


/**
     * Middleware for password reset form
     *
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @param {Next} next
     * @return {next} - Continue with the request.
     * @memberof PasswordMiddleware
     */
export const checkParameters=(req, res, next) => {
  try {
    const result = validate(req.body,
(req.body.email)?passwordResetEmailSchema :
changePasswordSchema);
    if (result.error !== null) {
      const {message} = result.error.details[0];
      return errorResponse(res, {code: 400, message});
    }
    next();
  } catch (err) {
    errorResponse(res, {code: 500, message: err.message});
  }
};


// export default PasswordMiddleware;
