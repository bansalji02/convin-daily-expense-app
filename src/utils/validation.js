import Joi from 'joi';

export const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
};

export const validateExpense = (expense) => {
  const schema = Joi.object({
    description: Joi.string().required(),
    amount: Joi.number().positive().required(),
    paidBy: Joi.string().required(),
    splitMethod: Joi.string().valid('equal', 'exact', 'percentage').required(),
    participants: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        share: Joi.number().required(),
      })
    ).required(),
  });

  return schema.validate(expense);
};