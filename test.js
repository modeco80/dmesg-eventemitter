const DmesgEmitter = require('./index');

var emitter = new DmesgEmitter();

emitter.on('line', async (line) => {
	console.log("Got dmesg line \"" + line + "\"");
});

emitter.run();
