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
