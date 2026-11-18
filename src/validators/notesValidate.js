import * as y from "yup";
export const createNoteValidate = y.object({
  title: y
    .string()
    .trim()
    .min(3, "Minimum 3 characters long")
    .max(100, "Maximum 100 characters long.")
    .required("title is required")
    .lowercase(),
  description: y
    .string()
    .trim()
    .min(3, "Minimum 3 characters long")
    .max(300, "Maximum 300 characters long.")
    .required("description is required")
    .lowercase(),
});
export const updateNoteValidate = y.object({
  title: y
    .string()
    .trim()
    .min(3, "Minimum 3 characters long")
    .max(100, "Maximum 100 characters long.")
    .required("title is required")
    .lowercase(),
  description: y
    .string()
    .trim()
    .min(3, "Minimum 3 characters long")
    .max(300, "Maximum 300 characters long.")
    .required("description is required")
    .lowercase(),
});

export const noteValidateSchema = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: `Validation is required.`,
      errors: error.errors,
    });
  }
};
