const days = 24 * 60 * 60;
const hours = 60 * 60;
const minutes = 60;
const timeBreaks = [days, hours, minutes];

/**
 * Takes a timestamp, and displays how much time has passed in dd:hh:mm:ss format.
 * @param {Number} lastUpdate Timestamp in Seconds (not ms)
 * @returns {String} How much time has passed in dd:hh:mm:ss format.
 */
export const displayTimeSince = (lastUpdate) => {
  const current = Math.floor(Date.now() / 1000);
  const values = [];

  let difference = current - lastUpdate;

  for (let i = 0; i < timeBreaks.length; i += 1) {
    const unitDiff = `${Math.floor(difference / timeBreaks[i])}`;

    values.push(unitDiff.length < 2 ? `0${unitDiff}` : unitDiff);
    difference = difference % timeBreaks[i];
  }

  values.push(difference.length < 2 ? `0${difference}` : difference);

  return values.join(':');
};

export default {
  displayTimeSince,
};