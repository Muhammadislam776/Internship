/**
 * Utility to format Zod validation errors into a clean, key-value dictionary and list.
 * @param {import('zod').ZodError} zodError 
 * @returns {{ errors: Record<string, string>, errorList: Array<{field: string, message: string}> }}
 */
export const formatZodErrors = (zodError) => {
  const errors = {};
  const errorList = [];

  zodError.issues.forEach((issue) => {
    // Get path name (e.g. "email", "password", etc.)
    const pathKey = issue.path.length > 0 ? issue.path.join('.') : 'general';
    if (!errors[pathKey]) {
      errors[pathKey] = issue.message;
      errorList.push({
        field: pathKey,
        message: issue.message,
        code: issue.code
      });
    }
  });

  return { errors, errorList };
};
