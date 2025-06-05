export const PIXELS_PER_MINUTE = 25 / 15;

export const timeToTop = (isoTime) => {
  const date = new Date(isoTime);
  return (date.getHours() * 60 + date.getMinutes()) * PIXELS_PER_MINUTE;
};

export const durationToHeight = (start, end) => {
  return (new Date(end) - new Date(start)) / 60000 * PIXELS_PER_MINUTE;
};