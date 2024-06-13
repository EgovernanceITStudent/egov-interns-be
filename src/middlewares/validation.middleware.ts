import { Request, Response, NextFunction } from "express";
import Joi from "joi";

function validation(schema: Joi.Schema) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const validationOptions: Joi.AsyncValidationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      const value = await schema.validateAsync(req.body, validationOptions);
      req.body = value;
      return next();
    } catch (error: any) {
      let errors: string[] = [];

      error.details.forEach((error: Joi.ValidationError) =>
        errors.push(error.message)
      );

      res.status(400).json({
        success: false,
        errors,
      });
    }
  };
}

export default validation;
