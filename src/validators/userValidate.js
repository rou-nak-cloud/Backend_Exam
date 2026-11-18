import * as y from "yup";

export const registerUserValidate = y.object({
  userName: y
    .string()
    .trim()
    .min(3, "Minimum 3 characters long")
    .required("username is required")
    .lowercase(),
  email: y
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required.")
    .lowercase(),
  password: y
    .string()
    .trim()
    .required("password is required")
    .test(
      "minLength",
      "Minimum 8 characters long",
      (val) => val && val.length >= 8,
    )
    .test(
      "maxLength",
      "Maximum 12 characters long",
      (val) => val && val.length <= 12,
    )
    .test(
      "oneUppercase",
      "one uppercase is required",
      (val) => val && /[A-Z]/.test(val),
    )
    .test(
      "oneLowercase",
      "one lowercase is required",
      (val) => val && /[a-z]/.test(val),
    )
    .test(
      "oneNumber",
      "one number is required",
      (val) => val && /[0-9]/.test(val),
    )
    .test(
      "oneSpecial",
      "one special is required",
      (val) => val && /[!@#$%^&*]/.test(val),
    ),
});
export const loginUserValidate = y.object({
  email: y.string().trim().email("Invalid Email").required().lowercase(),
  password: y.string().trim().required("Password is required"),
});

export const validateUserSchema = (schema) => async (req, res, next) => {
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
