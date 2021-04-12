const child_process = require('child_process');
const {chunksToLinesAsync, chomp} = require('@rauschma/stringio');
const EventEmitter = require('events');

// -W waits for new messages and runs forever
// -Lnever disables ANSI color sequences
const DMESG_COMMAND_ARGUMENTS = "-WLnever"

async function EmitLines(stream, cb) {
	for await (const line of chunksToLinesAsync(stream)) {
		var chomped = chomp(line);
		cb(chomped);
	}
}

class DmesgEventEmitter extends EventEmitter {
	constructor() {
		super();
		this._childHandle = null;
	}

	async run() {
		this._childHandle = child_process.spawn('dmesg', [ DMESG_COMMAND_ARGUMENTS ], {
			stdio: [ 'ignore', 'pipe', process.stderr]
		});

		await EmitLines(this._childHandle.stdout, async (line) => { 
			this.emit('line', line);
		});
	}
};

module.exports = DmesgEventEmitter;
