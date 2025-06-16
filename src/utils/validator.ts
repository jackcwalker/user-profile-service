export function validateCreateInput(data: any): { valid: boolean; message?: string } {
  const { firstName, lastName, dateOfBirth } = data;

  if (!firstName || !lastName || !dateOfBirth) {
    return {
      valid: false,
      message: 'firstName, lastName, and dateOfBirth are required',
    };
  }

  const dateValidation = validateDateOfBirth(dateOfBirth);
  if (!dateValidation.valid) return dateValidation;

  return { valid: true };
}

export function validateUpdateInput(data: any): { valid: boolean; message?: string } {
  const hasUpdatableFields = data.firstName || data.lastName || data.dateOfBirth;
  if (!hasUpdatableFields) {
    return {
      valid: false,
      message: 'Nothing to update',
    };
  }

  if (data.dateOfBirth) {
    const dateValidation = validateDateOfBirth(data.dateOfBirth);
    if (!dateValidation.valid) return dateValidation;
  }

  return { valid: true };
}

export function validateDateOfBirth(date: string): { valid: boolean; message?: string } {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(date)) {
    return {
      valid: false,
      message: 'dateOfBirth must be in ISO 8601 format (YYYY-MM-DD)',
    };
  }

  const parsed = new Date(date);
  const isValidDate = !isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);

  if (!isValidDate) {
    return {
      valid: false,
      message: 'dateOfBirth is not a valid date',
    };
  }

  return { valid: true };
}
