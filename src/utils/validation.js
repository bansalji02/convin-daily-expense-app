import Joi from 'joi';
// Joi is a validation library that can be used to validate the data that is passed to the server.
//Here we are validating the user and expense data using Joi.   



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
        share: Joi.number(),
      })
    ).required(),
  });

  return schema.validate(expense);
};