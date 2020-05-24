const filters = {
	round: function(value) {
		return Math.round(value);
	},
	round2decimals: function(value) {
		return Math.round(value * 100) / 100;
	},
};

module.exports = filters;
