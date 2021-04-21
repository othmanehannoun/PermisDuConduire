
const Joi = require("joi");

// Register Conducteur validation
const registerValidation = data => {
  const validaionSchema = Joi.object({
    matricule: Joi.string().min(6).required(),
    nom: Joi.string().min(2).required(),
    prenom: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(14).required(),
    address: Joi.string().min(6).required(),
    numPermis: Joi.string().min(4).required(),
    password: Joi.string().min(10).required(),
    
  });
  return validaionSchema.validate(data);
};

// Register Admin validation
const registerAdminValidation = data => {
    const validaionSchema = Joi.object({
      full_name: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(14).required(),
      password: Joi.string().min(10).required(),
    });
    return validaionSchema.validate(data);
  };

// Login validation
const loginValidation = data => {
  const validaionSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required()
  });
  return validaionSchema.validate(data);
};

module.exports =
{
     registerValidation, 
     registerAdminValidation, 
     loginValidation
};