export const formatAsCurrency = (value) => {
  value = Number(value);
  return value.toFixed(2);
};

export const formatAsLocalDateTime = (utcDateTime) => {
  const dateTime = new Date(utcDateTime);
  const options = {dateStyle: "long", timeStyle: "short"};
  return dateTime.toLocaleString('en-US', options);
};

/**
 * Determines if the current time is window minutes before the time slot.
 * 
 * @param {*} timeSlot The time slot provided.
 * @param {*} window The window in minutes.
 * @returns {Boolean} True if within window.
 */
export const isWithinPreWindow = (timeSlot, window) => {
  const currentUTC = new Date().getTime();
  const timeSlotUTC = new Date(timeSlot).getTime();
  const timeSlotPreWindowUTC = timeSlotUTC - window;
  return timeSlotPreWindowUTC <= currentUTC && currentUTC <= timeSlotUTC;
};

/**
 * Determines if the current time is window minutes after the time slot.
 * 
 * @param {*} timeSlot The time slot provided.
 * @param {*} window The window in minutes.
 * @returns {Boolean} True if within window.
 */
export const isWithinPostWindow = (timeSlot, window) => {
  const currentUTC = new Date().getTime();
  const timeSlotUTC = new Date(timeSlot).getTime();
  const timeSlotPostWindowUTC = timeSlotUTC + window;
  return timeSlotUTC <= currentUTC && currentUTC <= timeSlotPostWindowUTC;
};