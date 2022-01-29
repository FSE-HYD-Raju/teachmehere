import * as yup from 'yup';

const postStep1ValidationSchema = yup.object({
  skillName: yup
    .string()
    .required()
    .min(1),
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
});

const postStep4ValidationSchema = yup.object({
  // platform: yup.string().required(),
  //tags: yup.string().test(),
  experience: yup.number().min(0),
});

export {
  postStep1ValidationSchema,
  postStep2ValidationSchema,
  postStep4ValidationSchema,
};
