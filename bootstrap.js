var fs = require("fs");
var mkdirp = require("mkdirp");
var _ = require('underscore'); 
var zmq = require('zmq');
var spawn = require("child_process").spawn;

var argv = require('optimist')
    .default({
    	connect: "tcp://localhost:5555",
      pidFolder: "/tmp/process_manager/"
    })
    .argv;

var run = function(process) {

  var child = spawn(process.cmd, process.params, {detached: true, stdio: 'ignore'});
  console.log("Process pid: ", child.pid);

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
	id: '1',
	cmd: 'node',
	params: ['/home/skarslyan/git/processProject/process_manager/server.js']
});

var requester = zmq.socket('asyncreq');
requester.connect(argv.connect);

requester.send(JSON.stringify({type: "get"}), function(processes) {

  _.each(processes, function(process) {
  	if(process.auto) {
  		run(process);
  	}
  });
  setTimeout(function() {
		process.exit(0);
  }, 5000);
});
