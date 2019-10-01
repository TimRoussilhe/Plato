const convertHrtime = require('convert-hrtime');
const chalk = require('chalk');
const terminalLink = require('terminal-link');
const boxen = require('boxen');
const log = console.log;

const defaultColors = {
	activityStart: chalk.magentaBright,
	log: chalk.white,
	info: chalk.grey,
	warn: chalk.orange,
	error: chalk.red,
	success: chalk.green,
	bigError: chalk.bold.red,
	bigSucces: chalk.bold.blue
};

function Reporter() {
	this.verbose = false;
	this.colors = defaultColors;

	this.updateColors = function(colors) {
		this.colors = Object.assign(colors, defaultColors);
	};

	this.log = function(message) {
		log(this.colors.log(message));
	};

	this.info = function(message) {
		// info is only printed if verbose is precised
		this.verbose && log(this.colors.info(message));
	};
	this.warn = function(message) {
		log(this.colors.warn(message));
	};
	this.error = function(message, exit = false) {
		log(this.colors.error(message));
		if (exit) process.exit(1);
	};
	this.failure = function(message) {
		log(this.colors.bigError(message));
		process.exit(1);
	};
	this.success = function(message) {
		log(this.colors.success(message));
	};

	this.displayUrl = function(message, url) {
		log(boxen(`${message} \n ${terminalLink(url, url)}`, { padding: 1, margin: 0, round: 1 }));
	};

	// this.reportFailure();
}

Reporter.prototype.activity = function(activityName, activityEmoji) {
	return new Activity(activityName, activityEmoji, this);
};

function Activity(activityName, activityEmoji = '', reporter) {
	return {
		start: (verbose = false) => {
			this.startTime = process.hrtime();
			verbose && log(reporter.colors.activityStart(`starting ${activityEmoji} ${activityName}`));
		},
		update: (verbose = false) => {
			const elapsedTime = () => {
				let elapsed = process.hrtime(this.startTime);
				return `${convertHrtime(elapsed)['seconds'].toFixed(3)} s`;
			};
			verbose && log(reporter.colors.info(`update ${activityEmoji}`), reporter.colors.log(`${activityName} - ${elapsedTime()}`));
		},
		end: () => {
			const elapsedTime = () => {
				let elapsed = process.hrtime(this.startTime);
				return `${convertHrtime(elapsed)['seconds'].toFixed(3)} s`;
			};
			log(reporter.colors.success(`success ${activityEmoji}`), reporter.colors.log(`${activityName} - ${elapsedTime()}`));
		}
	};
}

const reporter = new Reporter();
module.exports = reporter;
