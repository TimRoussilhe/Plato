// Reminders: FILTERS don’t seem to work when using with Set, just as output…
const filters = {
	round: function(value) {
		return Math.round(value);
	},
	round2decimals: function(value) {
		return Math.round(value * 100) / 100;
	},
};

module.exports = filters;
