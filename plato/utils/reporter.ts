import convertHrtime from 'convert-hrtime';
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import boxen from 'boxen';
const { BorderStyle } = boxen;

const log = console.log;

const defaultColors = {
	activityStart: chalk.magentaBright,
	log: chalk.white,
	info: chalk.grey,
	warn: chalk.yellow,
	error: chalk.red,
	success: chalk.green,
	bigError: chalk.bold.red,
	bigSucces: chalk.bold.blue,
};

class Reporter {
	verbose = false;
	colors = defaultColors;

	updateColors(colors) {
		this.colors = Object.assign(colors, defaultColors);
	}

	log(message) {
		log(this.colors.log(message));
	}

	info(message) {
		// info is only printed if verbose is precised
		this.verbose && log(this.colors.info(message));
	}

	warn(message) {
		log(this.colors.warn(message));
	}

	error(message, exit = false) {
		log(this.colors.error(message));
		if (exit) process.exit(1);
	}

	failure(message, error) {
		log(this.colors.bigError(message));
		this.error(error);
		process.exit(1);
	}

	success(message) {
		log(this.colors.success(message));
	}

	displayUrl = function (message, url) {
		log(boxen(`${message} \n ${terminalLink(url, url)}`, { padding: 1, margin: 0, borderStyle: BorderStyle.Double }));
	};

	activity(activityName, activityEmoji) {
		return Activity(activityName, activityEmoji, this);
	}
}

function Activity(activityName, activityEmoji = '', reporter) {
	return {
		start: (verbose = false) => {
			reporter.startTime = process.hrtime();
			verbose && log(reporter.colors.activityStart(`starting ${activityEmoji} ${activityName}`));
		},
		update: (verbose = false) => {
			const elapsedTime = () => {
				let elapsed = process.hrtime(reporter.startTime);
				return `${convertHrtime(elapsed)['seconds'].toFixed(3)} s`;
			};
			verbose &&
				log(reporter.colors.info(`update ${activityEmoji}`), reporter.colors.log(`${activityName} - ${elapsedTime()}`));
		},
		end: () => {
			const elapsedTime = () => {
				let elapsed = process.hrtime(reporter.startTime);
				return `${convertHrtime(elapsed)['seconds'].toFixed(3)} s`;
			};
			log(
				reporter.colors.success(`success ${activityEmoji}`),
				reporter.colors.log(`${activityName} - ${elapsedTime()}`)
			);
		},
	};
}

const reporter = new Reporter();
export default reporter;
