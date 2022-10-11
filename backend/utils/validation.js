import Joi from "@hapi/joi";

export const registerValidation = (data) => {
  //validate email and password are as required
  const schema = Joi.object({
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data);
};
