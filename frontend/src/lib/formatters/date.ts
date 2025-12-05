// I wrote this local formatter but in a bigger project if I need to
// work with dates extensively, I would use dayjs or similar to make life simpler
// and ensure higher accuracy.
export const formatISO = (isoString: string): string => {
  // Number of digits to pad for day, month, hours, minutes
  const padLength = 2;
  const date = new Date(isoString);

  const day = String(date.getUTCDate()).padStart(padLength, "0");
  const month = String(date.getUTCMonth() + 1).padStart(padLength, "0");
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(padLength, "0");
  const minutes = String(date.getUTCMinutes()).padStart(padLength, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
