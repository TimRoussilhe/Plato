const {createReporter} = require('yurnalist');
const {stripIndent} = require('common-tags');
const convertHrtime = require('convert-hrtime');
// const tracer = require('opentracing').globalTracer();

const reporter = createReporter({emoji: true, verbose: true});

const base = Object.getPrototypeOf(reporter);

/* Reporter module.
 * @module reporter
 */

module.exports = Object.assign(reporter, {
	/**
   * Strip initial indentation template function.
   */
	stripIndent,
	/**
   * Toggle verbosity.
   * @param {boolean} [isVerbose=true]
   */
	setVerbose(isVerbose = true) {
		this.isVerbose = !!isVerbose;
	},
	/**
   * Turn off colors in error output.
   * @param {boolean} [isNoColor=false]
   */
	setNoColor(isNoColor = false) {
		if (isNoColor) {
			errorFormatter.withoutColors();
		}
	},
	/**
   * Log arguments and exit process with status 1.
   * @param {*} [arguments]
   */
	panic(...args) {
		this.error(...args);
		process.exit(1);
	},

	panicOnBuild(...args) {
		this.error(...args);
		if (process.env.gatsby_executing_command === 'build') {
			process.exit(1);
		}
	},

	error(message, error) {
		if (arguments.length === 1 && typeof message !== 'string') {
			error = message;
			message = error.message;
		}
		base.error.call(this, message);
		if (error) console.log(errorFormatter.render(error));
	},
	/**
   * Set prefix on uptime.
   * @param {string} prefix - A string to prefix uptime with.
   */
	uptime(prefix) {
		this.verbose(`${prefix}: ${(process.uptime() * 1000).toFixed(3)}ms`);
	},
	/**
   * Time an activity.
   * @param {string} name - Name of activity.
   * @param {activityArgs} activityArgs - optional object with tracer parentSpan
   * @return {string} The elapsed time of activity.
   */
	activityTimer(name, activityArgs = {}) {
		const spinner = reporter.activity();
		const start = process.hrtime();
		let status;

		const elapsedTime = () => {
			let elapsed = process.hrtime(start);
			return `${convertHrtime(elapsed)['seconds'].toFixed(3)} s`;
		};

		// const {parentSpan} = activityArgs;
		// const spanArgs = parentSpan ? {childOf: parentSpan} : {};
		// const span = tracer.startSpan(name, spanArgs);

		return {
			start: () => {
				spinner.tick(name);
			},
			setStatus: (s) => {
				status = s;
				spinner.tick(`${name} — ${status}`);
			},
			end: () => {
				// span.finish();
				const str = status
					? `${name} — ${elapsedTime()} — ${status}`
					: `${name} — ${elapsedTime()}`;
				reporter.success(str);
				spinner.end();
			},
			// span: span,
		};
	},
});
