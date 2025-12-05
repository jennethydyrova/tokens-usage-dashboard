// I wrote this local formatter but in a bigger project if I need to
// work with dates extensively, I would use dayjs or similar to make life simpler
// and ensure higher accuracy.
export const formatISO = (isoString: string): string => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
