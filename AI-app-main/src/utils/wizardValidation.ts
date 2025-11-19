/**
 * Validation utilities for wizard forms
 * Provides comprehensive validation with clear error messages
 */

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate app name
 */
export function validateAppName(name: string): ValidationError | null {
  if (!name || !name.trim()) {
    return { field: 'name', message: 'App name is required', type: 'error' };
  }

  if (name.trim().length < 3) {
    return {
      field: 'name',
      message: 'App name must be at least 3 characters',
      type: 'error',
    };
  }

  if (name.length > 50) {
    return {
      field: 'name',
      message: 'App name must be under 50 characters',
      type: 'error',
    };
  }

  // Check for invalid characters
  if (!/^[a-zA-Z0-9\s\-_']+$/.test(name)) {
    return {
      field: 'name',
      message: 'App name can only contain letters, numbers, spaces, hyphens, and underscores',
      type: 'error',
    };
  }

  return null;
}

/**
 * Validate description
 */
export function validateDescription(description: string): ValidationError | null {
  if (!description || !description.trim()) {
    return {
      field: 'description',
      message: 'Description is required',
      type: 'error',
    };
  }

  if (description.trim().length < 10) {
    return {
      field: 'description',
      message: 'Description should be at least 10 characters',
      type: 'warning',
    };
  }

  if (description.length > 500) {
    return {
      field: 'description',
      message: 'Description must be under 500 characters',
      type: 'error',
    };
  }

  return null;
}

/**
 * Validate purpose
 */
export function validatePurpose(purpose: string): ValidationError | null {
  if (!purpose || !purpose.trim()) {
    return {
      field: 'purpose',
      message: 'Purpose is required',
      type: 'error',
    };
  }

  if (purpose.trim().length < 10) {
    return {
      field: 'purpose',
      message: 'Purpose should be at least 10 characters',
      type: 'warning',
    };
  }

  if (purpose.length > 300) {
    return {
      field: 'purpose',
      message: 'Purpose must be under 300 characters',
      type: 'error',
    };
  }

  return null;
}

/**
 * Validate target users
 */
export function validateTargetUsers(users: string): ValidationError | null {
  if (users && users.length > 200) {
    return {
      field: 'targetUsers',
      message: 'Target users must be under 200 characters',
      type: 'error',
    };
  }

  return null;
}

/**
 * Validate feature name
 */
export function validateFeatureName(
  name: string,
  existingFeatures: Array<{ name: string }>
): ValidationError | null {
  if (!name || !name.trim()) {
    return {
      field: 'featureName',
      message: 'Feature name is required',
      type: 'error',
    };
  }

  if (name.trim().length < 3) {
    return {
      field: 'featureName',
      message: 'Feature name should be at least 3 characters',
      type: 'warning',
    };
  }

  if (name.length > 50) {
    return {
      field: 'featureName',
      message: 'Feature name must be under 50 characters',
      type: 'error',
    };
  }

  // Check for duplicates (case-insensitive)
  const isDuplicate = existingFeatures.some(
    (f) => f.name.toLowerCase().trim() === name.toLowerCase().trim()
  );

  if (isDuplicate) {
    return {
      field: 'featureName',
      message: 'A feature with this name already exists',
      type: 'error',
    };
  }

  return null;
}

/**
 * Validate feature description
 */
export function validateFeatureDescription(description: string): ValidationError | null {
  if (description && description.length > 200) {
    return {
      field: 'featureDescription',
      message: 'Feature description must be under 200 characters',
      type: 'error',
    };
  }

  return null;
}

/**
 * Validate features list
 */
export function validateFeatures(features: any[]): ValidationError | null {
  if (!features || features.length === 0) {
    return {
      field: 'features',
      message: 'At least one feature is required',
      type: 'error',
    };
  }

  if (features.length > 20) {
    return {
      field: 'features',
      message: 'Consider breaking your app into phases. More than 20 features may be too complex.',
      type: 'warning',
    };
  }

  return null;
}

/**
 * Validate color value
 */
export function validateColor(color: string): ValidationError | null {
  if (!color) return null;

  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexPattern.test(color)) {
    return {
      field: 'primaryColor',
      message: 'Color must be a valid hex color (e.g., #00ffcc)',
      type: 'error',
    };
  }

  return null;
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationError | null {
  if (!email) return null;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return {
      field: 'email',
      message: 'Please enter a valid email address',
      type: 'error',
    };
  }

  return null;
}

/**
 * Validate URL
 */
export function validateUrl(url: string): ValidationError | null {
  if (!url) return null;

  try {
    new URL(url);
    return null;
  } catch {
    return {
      field: 'url',
      message: 'Please enter a valid URL',
      type: 'error',
    };
  }
}

/**
 * Comprehensive validation for basic info step
 */
export function validateBasicInfo(data: {
  name: string;
  description: string;
  purpose: string;
  targetUsers?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  const nameError = validateAppName(data.name);
  if (nameError) {
    if (nameError.type === 'error') errors.push(nameError);
    else warnings.push(nameError);
  }

  const descError = validateDescription(data.description);
  if (descError) {
    if (descError.type === 'error') errors.push(descError);
    else warnings.push(descError);
  }

  const purposeError = validatePurpose(data.purpose);
  if (purposeError) {
    if (purposeError.type === 'error') errors.push(purposeError);
    else warnings.push(purposeError);
  }

  const usersError = validateTargetUsers(data.targetUsers || '');
  if (usersError) {
    if (usersError.type === 'error') errors.push(usersError);
    else warnings.push(usersError);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get character count with limit
 */
export function getCharacterCount(text: string, limit: number): {
  count: number;
  remaining: number;
  isOverLimit: boolean;
  percentage: number;
} {
  const count = text.length;
  const remaining = limit - count;
  const isOverLimit = count > limit;
  const percentage = Math.min((count / limit) * 100, 100);

  return { count, remaining, isOverLimit, percentage };
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Check if string contains profanity (basic check)
 */
export function containsProfanity(text: string): boolean {
  const profanityList = [
    'damn',
    'hell',
    'crap',
    'shit',
    'fuck',
    'bitch',
    'ass',
    'bastard',
  ];

  const lowerText = text.toLowerCase();
  return profanityList.some((word) => lowerText.includes(word));
}

/**
 * Validate and sanitize all user input
 */
export function validateAndSanitize(
  input: string,
  field: string,
  maxLength: number
): { sanitized: string; error: ValidationError | null } {
  // Sanitize first
  const sanitized = sanitizeInput(input);

  // Check length
  if (sanitized.length > maxLength) {
    return {
      sanitized,
      error: {
        field,
        message: `${field} must be under ${maxLength} characters`,
        type: 'error',
      },
    };
  }

  // Check profanity (warning, not error)
  if (containsProfanity(sanitized)) {
    return {
      sanitized,
      error: {
        field,
        message: 'Please use professional language',
        type: 'warning',
      },
    };
  }

  return { sanitized, error: null };
}
