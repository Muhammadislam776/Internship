import { z } from 'zod';

// Strong password regex: 8+ chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Phone number regex allowing international formats (e.g., +1-555-0192, +44 20 7946 0912)
const phoneRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,16}$/;

/**
 * Reusable Zod User Schema for request validation
 */
export const userSchema = z.object({
  name: z.string({
    required_error: "Full Name is required",
    invalid_type_error: "Name must be a string"
  })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: z.string({
    required_error: "Email address is required"
  })
    .email("Invalid email address format")
    .toLowerCase()
    .trim(),

  password: z.string({
    required_error: "Password is required"
  })
    .min(8, "Password must be at least 8 characters long")
    .regex(
      passwordRegex,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)"
    ),

  confirmPassword: z.string({
    required_error: "Password confirmation is required"
  }),

  age: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a valid number"
    })
      .int("Age must be an integer")
      .min(18, "User must be at least 18 years old")
      .max(120, "Age cannot exceed 120 years")
  ),

  phone: z.string({
    required_error: "Phone number is required"
  })
    .regex(phoneRegex, "Invalid phone number format (e.g., +1-555-0192)"),

  country: z.string({
    required_error: "Country is required"
  })
    .min(2, "Country name must be at least 2 characters")
    .trim(),

  role: z.enum(["admin", "developer", "analyst", "user"], {
    errorMap: () => ({ message: "Role must be one of: admin, developer, analyst, user" })
  }).default("user")
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
