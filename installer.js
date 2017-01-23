'use strict';
const inquirer = require('inquirer');
const exec = require('child_process').exec;
const del = require('del');
const fs = require('fs');
const path = require('path');
let buildOptions = {};
const tempFolder = 'markup';
const request = require('request');
const fsExtra = require('fs.extra');
const simpleGit = require('simple-git')(path.resolve(__dirname));
const projectConfig = {
	startAction: 'npm run start',
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
				value: 'npm run start'
			},
			{
				name: 'Update project modules',
				value: 'npm run update'
			},
			{
				name: 'Release project (ready for QA)',
				value: 'npm run dist'
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
	}/*,
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
	}*/
};

const runShellCommands = (command, callback) => {

	console.log('command == >', command)
	goToTempFolder();
	const child = exec(command);
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
	child.on('exit', function() {
		try {
			callback();
		} catch(err) {}
	});
};

const doAction = (action) => {
	runShellCommands(action, path.resolve(__dirname, tempFolder))
};

const showMenu = (resultObj, prevMenu) => {
	const key = prevMenu && resultObj[prevMenu.name] || null;
	const newQuestion = key ? projectConfig[key] : resultObj;

	if (newQuestion) {
		if (!prevMenu || key) {
			return inquirer.prompt(newQuestion).then((answer) => showMenu.apply(undefined, [answer, resultObj]));
		} else {
			downloadTemplate(resultObj[Object.keys(resultObj)[0]]);
			return;
		}
	} else {
		doAction(key);
	}
};

const downloadTemplate = (projectName) => {
	let child = exec('git clone -n https://github.com/AlexZ156/markup-boilerplate-installer.git ' + '"' + tempFolder + '"');
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
	child.on('exit', function() {

		console.log(1111)
		// return;
		goToTempFolder();
		let child2 = exec('git checkout HEAD ' + projectName);
		child2.stdout.pipe(process.stdout);
		child2.stderr.pipe(process.stderr);
		child2.on('exit', function() {
			fsExtra.copyRecursive(path.resolve(__dirname, tempFolder +'/' + projectName), path.resolve(__dirname, tempFolder), function(err) {
				if (err) {
					throw err;
				}
				del.sync([path.resolve(__dirname, tempFolder +'/.git'), path.resolve(__dirname, tempFolder +'/' + projectName)]);
				doAction(projectConfig.startAction);
			});
		});
	});
};

const goToTempFolder = () => {
	process.chdir(path.resolve(__dirname, tempFolder));
}

const checkTemplExistFolder = () => {
	fs.stat(path.resolve(__dirname, tempFolder), function(err, result) {
		if (!result) {
			showMenu(projectConfig.start);
		} else {
			showMenu(projectConfig.action);
		}
	});
};


function startInstall() {
	checkTemplExistFolder();
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
