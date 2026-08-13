import { formatZodErrors } from '../utils/validationErrors.js';
import { store } from '../utils/store.js';

/**
 * Express Middleware to validate incoming request body against a Zod schema.
 * 
 * @param {import('zod').ZodSchema} schema - Zod Schema to validate against
 * @returns {import('express').RequestHandler}
 */
export const validateUser = (schema) => async (req, res, next) => {
  const startTime = Date.now();

  try {
    // 1. Safely parse req.body using Zod schema
    const result = await schema.safeParseAsync(req.body);

    const duration = Date.now() - startTime;

    // 2. Handle Validation Failure
    if (!result.success) {
      const { errors, errorList } = formatZodErrors(result.error);
      const failedFields = errorList.map((e) => e.field);

      // Record rejection event in logs & metrics
      store.addLog({
        endpoint: req.originalUrl || req.baseUrl || '/api/users',
        method: req.method,
        status: 'REJECTED',
        statusCode: 400,
        responseTimeMs: duration,
        fieldsEvaluated: Object.keys(req.body || {}),
        failedFields,
        errors
      });

      // Return HTTP 400 with structured JSON response
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // 3. Handle Validation Success
    // Sanitize and replace req.body with parsed/transformed Zod data
    req.body = result.data;
    req.validationStartTime = startTime;

    // Record success event in logs & metrics
    store.addLog({
      endpoint: req.originalUrl || req.baseUrl || '/api/users',
      method: req.method,
      status: 'VALID',
      statusCode: 200,
      responseTimeMs: duration,
      fieldsEvaluated: Object.keys(result.data),
      failedFields: [],
      errors: {}
    });

    // Pass control to controller
    next();
  } catch (err) {
    // Fallback for unexpected validation runtime errors
    const duration = Date.now() - startTime;
    store.addLog({
      endpoint: req.originalUrl || '/api/users',
      method: req.method,
      status: 'REJECTED',
      statusCode: 500,
      responseTimeMs: duration,
      failedFields: ['server'],
      errors: { server: 'Internal schema validation failure' }
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error during validation",
      errors: { server: err.message }
    });
  }
};
