var fs = require("fs");
var mkdirp = require("mkdirp");
var _ = require('underscore'); 
var zmq = require('zmq');

var argv = require('optimist')
    .default({
    	connect: "tcp://localhost:5050",
      pidFolder: "/tmp/process_manager/"
    })
    .argv;

var requester = zmq.socket('asyncreq');
requester.connect(argv.connect);

requester.send(JSON.stringify({type: "get"}), function(processes) {
  processes = JSON.parse(processes);
  _.each(processes, function(process) {
  	if(process.auto) {
  		run(process);
  	}
  });
  setTimeout(function() {
		process.exit(1);
  }, 5000);
});

var spawn = require("child_process").spawn;

var run = function(process) {
  
  var child = spawn(process.cmd, process.params, {detached: true});
  console.log("Process pid: " + child.pid);

  mkdirp(argv.pidFolder + process.id, function(error) {
    if(error) console.error(error);
    else{
      console.log("folders have been created");
      fs.writeFile(argv.pidFolder + process.id + "/" + child.pid, "", function(error) {
        if (error) console.error(error)
        else console.log("file created!");
      });
    }
  
  child.unref();
  });
  
};

run({
	id: '03',
	cmd: 'node',
	params: ['fake_process_manager.js']
});
