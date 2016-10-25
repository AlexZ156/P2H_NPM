'use strict';
const inquirer = require('inquirer');
const exec = require('child_process').exec;
const del = require('del');
const fs = require('fs');
const path = require('path');
let buildOptions = {};
const request = require('request');
const projectConfig = {
	start: {
		type: 'list',
		name: 'projectType',
		message: 'Select project type:',
		choices: [
			{
				name: 'Markup Only',
				value: 'frontend'
			},
			{
				name: 'Markup + CMS',
				value: 'frontend+cms'
			}
		]
	},
	action: {
		type: 'list',
		name: 'action',
		message: 'Select action:',
		choices: [
			{
				name: 'Continue project',
				value: 'gulp'
			},
			{
				name: 'Update project modules',
				value: 'npm up'
			},
			{
				name: 'Release project (ready for QA)',
				value: 'gulp dist'
			}
		]
	},
	'frontend': {
		type: 'list',
		name: 'framework',
		message: 'Select framework:',
		choices: [
			{
				name: 'No framework',
				value: 'base-markup'
			},
			{
				name: 'Bootstrap',
				value: 'base-markup+bootstrap'
			},
			{
				name: 'Zurb Foundation',
				value: 'base-markup+zurb-foundation'
			},
			{
				name: 'Materialize',
				value: 'base-markup+materialize'
			}
		]
	},
	'frontend+cms': {
		type: 'list',
		name: 'cms',
		message: 'Select CMS:',
		choices: ['WordPress', 'Magento', 'Other CMS']
	},
	'base-markup': {
		url: 'url-base-markup'
	},
	'base-markup+bootstrap': {
		url: 'url-base-markup+bootstrap'
	},
	'base-markup+zurb-foundation': {
		url: 'url-base-markup+zurb-foundation'
	},
	'base-markup+materialize': {
		url: 'url-base-markup+materialize'
	}
};




const showMenu = (resultObj, prevMenu) => {
	const key = prevMenu && resultObj[prevMenu.name] || null;
	const newQuestion = key ? projectConfig[key] : resultObj;

	if (!prevMenu || key) {
		return inquirer.prompt(newQuestion).then((answer) => showMenu.apply(undefined, [answer, resultObj]));
	} else {
		downloadBuild(resultObj[Object.keys(resultObj)[0]]);
		return;
	}
};

function downloadBuild(key) {
	let tempFolder = 'markup';
	console.log('key ======= ', key)
	console.log('key ======= ', projectConfig[key])
	console.log('git clone https://github.com/AlexZ156/markup-boilerplate-installer.git ' + '"' + tempFolder + '"')

	fs.stat(path.resolve(__dirname, 'markup'), function(err, result) {
		let tempFolder = 'markup';
		let child = exec('git clone -n https://github.com/AlexZ156/markup-boilerplate-installer.git --depth 1 ' + '"' + tempFolder + '"');
		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
		child.on('exit', function() {
			// del.sync(tempFolder + '/.git');
			process.chdir(path.resolve(__dirname, 'markup'));
			let child2 = exec('git checkout HEAD ' + key);
			child2.stdout.pipe(process.stdout);
			child2.stderr.pipe(process.stderr);
			child2.on('exit', function() {
				// del.sync(tempFolder + '/.git');
				console.log(121111)

			});
		});
	});
	return
	fs.stat(path.resolve(__dirname, 'markup'), function(err, result) {
		let tempFolder = 'markup';
		let child = exec('git clone https://github.com/AlexZ156/markup-boilerplate-installer.git ' + '"' + tempFolder + '"');
		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
		child.on('exit', function() {
			del.sync(tempFolder + '/.git');

			
		});
	});
}


function startInstall() {
	/*console.log(projectConfig.start)
	inquirer.prompt(projectConfig.start).then(function() {
		console.log(1111111)
	})*/
	showMenu(projectConfig.start);
	/*fs.stat(path.resolve(__dirname, 'markup'), function(err, result) {
		if (!result) {
			let tempFolder = 'markup';
			let child = exec('git clone https://github.com/AlexZ156/markup.git ' + '"' + tempFolder + '"');
			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);
			child.on('exit', function() {
				del.sync(tempFolder + '/.git');

				
			});
		} else {
			runShellCommands('npm install', path.resolve(__dirname, 'markup'), function() {
				// console.log('!!!!!!!!!!!!!!!!!!!!!!!!')
			});
		}
	});*/
}

const commandArr = ['npm install', 'gulp'];

function runShellCommands(commands, cwd, callback) {
	var activeProcessIndex = 0;

	var startProcess = function() {
		var command = 'npm install',
			child;

		if(command) {
			console.log('Starting shell command: "' + command + '"');
			child = exec(command);
			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);
			child.on('exit', function() {
				// activeProcessIndex++;
				startProcess();
			});
		} else if(typeof callback === 'function') {
			callback();
		}
	};

	if(commands && commands.length) {
		process.chdir(cwd);
		startProcess();
	}
}

function startTask() {
	let currDir = path.resolve(__dirname, 'markup');
	console.log(currDir)

	process.chdir(currDir);

	let child = exec('npm install');
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
	child.on('exit', function() {
		console.log('-----!!!!!-----');
	});
}


// CLI exports
module.exports = {
	interpret: function(argv) {
		/*var cliArgs = argv.slice(2),
			customFileName = cliArgs[0];

		if(customFileName) {
			fileName = customFileName;
		}*/

		startInstall();
	}
};
