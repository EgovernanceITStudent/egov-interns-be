import Joi from "joi";

export const projectCreationSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  technologies: Joi.string().min(1).required(),
  link: Joi.string().min(1).uri().required(),
  githubRepo: Joi.string().min(1).uri().required(),
});

export const projectUpdateSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  technologies: Joi.string().min(1).required(),
  link: Joi.string().min(1).required(),
  githubRepo: Joi.string().min(1).required(),
});
