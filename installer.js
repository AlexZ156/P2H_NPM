'use strict';
const inquirer = require('inquirer');
const exec = require('child_process').exec;
const del = require('del');
const fs = require('fs');
const path = require('path');
let buildOptions = {};
const request = require('request');
const questions = {
	start: {
		type: 'list',
		name: 'projectType',
		message: 'Select project type:',
		choices: [
			{
				name: 'Markup Only',
				value: 'markup'
			},
			{
				name: 'Markup + CMS',
				value: 'cms'
			}
		]
	},
	markup: {
		type: 'list',
		message: 'Select framework:',
		name: 'framework',
		choices: ['No framework', 'Bootstrap', 'Zurb Foundation', 'Materialize']
	}
};

function checkQuestion(answers) {
	const newQuestion = questions[answers[Object.keys(answers)[0]]];
	buildOptions = Object.assign(buildOptions, answers);

	if (newQuestion) {
		return inquirer.prompt(newQuestion).then(checkQuestion);
	} else {
		downloadBuild();
		return;
	}
}

function downloadBuild() {
	// console.log(buildOptions)
}


function startInstall() {
	console(' !!!!!!!!!!!!!!!!!a asasda !!!!!!!!!!!')
	fs.stat(path.resolve(__dirname, 'markup'), function(err, result) {
		if (!result) {
			let tempFolder = 'markup';
			let child = exec('git clone https://github.com/AlexZ156/markup.git ' + '"' + tempFolder + '"');
			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);
			child.on('exit', function() {
				del.sync(tempFolder + '/.git');

				console.log('!!!!!!!' + path.resolve(__dirname, '/markup') + '/' + ' npm i')
				let child = exec(path.resolve(__dirname, '/markup') + '/' + ' npm i');
				child.stdout.pipe(process.stdout);
				child.stderr.pipe(process.stderr);
				child.on('exit', function() {

					console.log(1111111111)
				});
				console.log(222222222)
			});
		} else {
			/*let child = exec(path.resolve(__dirname, 'markup') + ' npm i');
			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);
			child.on('exit', function() {

				console.log(1111111111)
			});

			console.log(333333, path.resolve(__dirname, 'markup') + ' npm i')*/
		}
	});
}


// CLI exports
module.exports = {
	interpret: function(argv) {
		var cliArgs = argv.slice(2),
			customFileName = cliArgs[0];

		if(customFileName) {
			fileName = customFileName;
		}

		startInstall();
	}
};
