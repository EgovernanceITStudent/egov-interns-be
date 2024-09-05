import Joi from "joi";

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(1).required(),
  dob: Joi.date().required(),
  bio: Joi.string().min(1).required(),
  schoolName: Joi.string().min(1).required(),
  schoolDepartment: Joi.string().min(1).required(),
  // profileImage: Joi.string().min(1).required(),
  // linkedInLink: Joi.string().min(1).required(),
  // githubLink: Joi.string().min(1).required(),
});
