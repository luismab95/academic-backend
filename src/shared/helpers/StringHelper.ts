export const maskEmail = (email: string) => {
  const [user, domain] = email.split("@");
  const maskedUser =
    user[0] + "*".repeat(user.length - 2) + user[user.length - 1];
  const maskedDomain =
    domain[0] +
    "*".repeat(domain.indexOf(".")) +
    domain.substring(domain.indexOf("."));
  return maskedUser + "@" + maskedDomain;
};

export const maskString = (
  text: string,
  visibleStart = 2,
  visibleEnd = 2,
  maskChar = "*"
) => {
  if (!text || text.length <= visibleStart + visibleEnd) return text;

  const maskedPart = maskChar.repeat(text.length - (visibleStart + visibleEnd));
  return text.slice(0, visibleStart) + maskedPart + text.slice(-visibleEnd);
};

export function validateIdentification(identification: string): boolean {
  if (!/^\d{10}$/.test(identification)) return false;

  const province = parseInt(identification.substring(0, 2), 10);
  const thirdDigit = parseInt(identification[2], 10);

  if (!((province >= 1 && province <= 24) || province === 30)) return false;

  if (thirdDigit < 0 || thirdDigit > 6) return false;

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let value = parseInt(identification[i], 10) * coefficients[i];
    if (value >= 10) value -= 9;
    sum += value;
  }

  const verify = sum % 10 === 0 ? 0 : 10 - (sum % 10);

  return verify === parseInt(identification[9], 10);
}
