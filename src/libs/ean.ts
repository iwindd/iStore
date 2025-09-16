// EAN (European Article Number) barcode validation and generation

export type EANType = 'EAN8' | 'EAN13';

export interface EANValidationResult {
  isValid: boolean;
  type?: EANType;
  error?: string;
}

/**
 * Validates EAN barcode format and checksum
 * @param code - The barcode string to validate
 * @returns Validation result with type information
 */
export function validateEAN(code: string): EANValidationResult {
  if (!code || typeof code !== 'string') {
    return { isValid: false, error: 'Invalid input: code must be a non-empty string' };
  }

  // Remove any non-numeric characters
  const cleanCode = code.replace(/\D/g, "");

  // Check if the code is either EAN8 or EAN13
  if (cleanCode.length !== 8 && cleanCode.length !== 13) {
    return { 
      isValid: false, 
      error: `Invalid length: expected 8 or 13 digits, got ${cleanCode.length}` 
    };
  }

  const type: EANType = cleanCode.length === 8 ? 'EAN8' : 'EAN13';
  
  // Checksum calculation
  const checksum = parseInt(cleanCode.slice(-1), 10);
  const digits = cleanCode.slice(0, -1).split("").map(Number);

  const sum = digits.reduce((acc, digit, index) => {
    const multiplier = (type === 'EAN8' && index % 2 === 0) || 
                      (type === 'EAN13' && index % 2 !== 0) ? 3 : 1;
    return acc + digit * multiplier;
  }, 0);

  const calculatedChecksum = (10 - (sum % 10)) % 10;

  return {
    isValid: checksum === calculatedChecksum,
    type,
    error: checksum !== calculatedChecksum ? 'Invalid checksum' : undefined
  };
}

/**
 * Simple boolean validation for backward compatibility
 * @param code - The barcode string to validate
 * @returns true if valid, false otherwise
 */
export function isValid(code: string): boolean {
  return validateEAN(code).isValid;
}

/**
 * Generates a random EAN13 barcode with proper checksum
 * @returns A valid EAN13 barcode string
 */
export function randomEan(): string {
  // Generate random 12-digit product code, starting with 1-9
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Array.from({ length: 11 }, () => 
    Math.floor(Math.random() * 10)
  );
  
  const productCode = [firstDigit, ...remainingDigits];

  // Calculate checksum for EAN13
  const sum = productCode.reduce((acc, digit, index) => {
    return acc + (index % 2 === 0 ? digit : digit * 3);
  }, 0);
  
  const checksum = (10 - (sum % 10)) % 10;

  // Construct full EAN13 barcode
  return productCode.join('') + checksum;
}

/**
 * Generates a random EAN8 barcode with proper checksum
 * @returns A valid EAN8 barcode string
 */
export function randomEan8(): string {
  // Generate random 7-digit product code, starting with 1-9
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 10)
  );
  
  const productCode = [firstDigit, ...remainingDigits];

  // Calculate checksum for EAN8
  const sum = productCode.reduce((acc, digit, index) => {
    return acc + (index % 2 === 0 ? digit * 3 : digit);
  }, 0);
  
  const checksum = (10 - (sum % 10)) % 10;

  // Construct full EAN8 barcode
  return productCode.join('') + checksum;
}

/**
 * Generates a random EAN barcode of specified type
 * @param type - The type of EAN to generate ('EAN8' or 'EAN13')
 * @returns A valid EAN barcode string
 */
export function generateEAN(type: EANType = 'EAN13'): string {
  return type === 'EAN8' ? randomEan8() : randomEan();
}