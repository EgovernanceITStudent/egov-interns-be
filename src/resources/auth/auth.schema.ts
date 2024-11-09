import Joi from "joi";

export const userSignupSchema = Joi.object({
  firstName: Joi.string().min(1).required().trim(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(1).required(),
  password: Joi.string().min(8).required(),
  dob: Joi.date().required(),
  schoolName: Joi.string().min(1).required(),
  schoolDepartment: Joi.string().min(1).required(),
});
