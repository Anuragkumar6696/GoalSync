const Joi = require('joi');
const { ErrorResponse } = require('./errorMiddleware');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new ErrorResponse(message, 400));
    }
    next();
  };
};

// Auth schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('employee', 'manager', 'admin'),
  manager: Joi.string().hex().length(24),
});

// Goal schemas
const goalSchema = Joi.object({
  thrustArea: Joi.string().required(),
  goalTitle: Joi.string().required(),
  description: Joi.string().required(),
  unitOfMeasurement: Joi.string()
    .valid(
      'Numeric_Min',
      'Numeric_Max',
      'Percentage_Min',
      'Percentage_Max',
      'Timeline',
      'Zero'
    )
    .required(),
  target: Joi.number().required(),
  weightage: Joi.number().min(1).required(),
  quarter: Joi.string().valid('Q1', 'Q2', 'Q3', 'Q4').required(),
});

const goalsListSchema = Joi.object({
  goals: Joi.array().items(goalSchema).min(1).max(8).required(),
});

const updateGoalSchema = Joi.object({
  thrustArea: Joi.string(),
  goalTitle: Joi.string(),
  description: Joi.string(),
  unitOfMeasurement: Joi.string().valid(
    'Numeric_Min',
    'Numeric_Max',
    'Percentage_Min',
    'Percentage_Max',
    'Timeline',
    'Zero'
  ),
  target: Joi.number(),
  achievement: Joi.number(),
  weightage: Joi.number().min(10),
  status: Joi.string().valid('Not Started', 'On Track', 'Completed'),
  quarter: Joi.string().valid('Q1', 'Q2', 'Q3', 'Q4'),
});

const quarterlyUpdateSchema = Joi.object({
  achievement: Joi.number().required(),
  status: Joi.string().valid('Not Started', 'On Track', 'Completed').required(),
});

const checkInSchema = Joi.object({
  comment: Joi.string().required(),
});

module.exports = {
  validate,
  loginSchema,
  registerSchema,
  goalSchema,
  goalsListSchema,
  updateGoalSchema,
  quarterlyUpdateSchema,
  checkInSchema,
};
