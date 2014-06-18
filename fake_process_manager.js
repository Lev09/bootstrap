var zmq = require('zmq');
var argv = require('optimist').default({
	bind: 'tcp://*:5050'
}).argv;

var responder = zmq.socket('asyncrep');

responder.bind(argv.bind, function(error) {
	if(error) {
		console.log(error);
	}
	else {
		console.log('binding on ', argv.bind);
	}
});

var processList = [
	{id: '02', auto: true, cmd: 'gedit', params: ['./fake_starter.js']},
	{id: '03', auto: true, cmd: 'gedit', params: ['./fake_process_manager-ui.js']},
	{id: '04', auto: false, cmd: 'gedit', params: ['new.js']}
];

responder.on('message', function(message, response) {
  response.send(processList);
});

console.log('process manager runed');
