var fs = require("fs");
var mkdirp = require("mkdirp");
var _ = require('underscore'); 

var argv = require('optimist')
    .default({
      pidFolder: "/tmp/process_manager/" 
    })
    .argv;
    
var processes = [
	{id: '02', cmd: 'node', params: './fake_starter.js'},
	{id: '03', cmd: 'node', params: './fake_process_manager.js'}
];

var spawn = require("child_process").spawn;

var run = function(process) {
  
  var child = spawn(process.cmd, process.params, {detached: true});
  console.log("Process pid: " + child.pid);

  mkdirp(argv.pidFolder + process.id, function(error) {
    if(error) console.error(error);
    else{
      console.log("folders have been created");
      fs.writeFile(argv.pidFolder +  process.id + "/" + child.pid, "", function(error) {
        if (error) console.error(error)
        else console.log("file created!");
      });
    }
  
  child.unref();
  });
  
};

_.each(processes, function(process) {
	run(process);
});

setTimeout(function() {
	process.exit(0);
}, 10000);

