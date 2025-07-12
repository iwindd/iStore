// EAN (European Article Number) barcode validation and generation
export function isValid(code: string): boolean {
  // Remove any non-numeric characters
  code = code.replace(/\D/g, "");

  // Check if the code is either EAN8 or EAN13
  if (code.length !== 8 && code.length !== 13) {
    return false;
  }

  // Checksum calculation
  const checksum = code.slice(-1);
  const digits = code.slice(0, -1).split("").map(Number);

  const sum = digits.reduce((acc, digit, index) => {
    if (
      (code.length === 8 && index % 2 === 0) ||
      (code.length === 13 && index % 2 !== 0)
    ) {
      return acc + digit * 3;
    }
    return acc + digit;
  }, 0);

  const calculatedChecksum = (10 - (sum % 10)) % 10;

  return parseInt(checksum, 10) === calculatedChecksum;
}

// Generate a random EAN13 barcode
export function randomEan(): string {
  // Generate random 12-digit product code, starting with 1-9
  let productCode = Math.floor(Math.random() * 9 + 1).toString(); // first digit: 1-9

  for (let i = 1; i < 12; i++) {
    productCode += Math.floor(Math.random() * 10); // remaining digits: 0-9
  }

  // Calculate checksum
  const digits = productCode.split("").map(Number);
  const sum = digits.reduce((acc, digit, index) => {
    return acc + (index % 2 === 0 ? digit : digit * 3);
  }, 0);
  const checksum = (10 - (sum % 10)) % 10;

  // Construct full EAN13 barcode
  const ean13 = productCode + checksum;

  return ean13;
}