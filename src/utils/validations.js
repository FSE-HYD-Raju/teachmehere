import * as yup from 'yup';
import validator from 'validator';

const postStep1ValidationSchema = yup.object({
  skillName: yup
    .string()
    .required()
    .min(4),
  skillLevel: yup.string().required(),
  totalHours: yup
    .number()
    .required()
    .min(1),
});

const postStep2ValidationSchema = yup.object({
  country: yup.string().required(),
  individualPrice: yup
    .number()
    .required()
    .min(1),
  noOfPeople: yup.number().min(1),
  groupPrice: yup.number().min(1),
  languages: yup.array().required(),
});


export const validateUsername = username => {
  let isValid = false;
  let message = '';

  if (validator.isEmpty(username)) {
    message = 'Please enter your username.';
  } else {
    isValid = true;
  }

  return { isValid, message };
};

export const validatePassword = password => {
  let isValid = false;
  let message = '';

  if (validator.isEmpty(password)) {
    message = 'Please enter your password.';
  } else if (password.length < 4) {
    message = 'Password is too short.';
  } else {
    isValid = true;
  }

  return { isValid, message };
};

export const validateEmail= email => {
  let isValid = false;
  let message = '';
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (validator.isEmpty(email)) {
    message = 'Please enter email.';
  } 
  // else if (password.length < 4) {
  //   message = 'email is too short.';
  // } 
  else if (reg.test(email) === false) {
    message = 'Please enter valid email.';
  }
   else {
    isValid = true;
  }

  return { isValid, message };
};

export const validatePhoneNumber= phonenumber => {
  let isValid = false;
  let message = '';
  let reg =  /[1-9]{1}[0-9]{9}/;

  if (validator.isEmpty(phonenumber)) {
    message = 'Please enter phonunumber.';
  } 
  // else if (password.length < 4) {
  //   message = 'email is too short.';
  // } 
  else if (reg.test(phonenumber) === false) {
    message = 'Please enter valid phonenumber.';
  }
   else {
    isValid = true;
  }

  return { isValid, message };
};

export { postStep1ValidationSchema, postStep2ValidationSchema };