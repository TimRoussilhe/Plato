// Reminders: FILTERS don’t seem to work when using with Set, just as output…
// The idea is then to move the conditional logic to the "back-end" side
export const filters = {
  round: function (value) {
    return Math.round(value);
  },
  round2decimals: function (value) {
    return Math.round(value * 100) / 100;
  },
};
