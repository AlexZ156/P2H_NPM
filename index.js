'use strict';
const inquirer = require('inquirer');
const exec = require('child_process').exec;
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

const projectTypeQuestions = [
	
];

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

var qqqq = path.resolve(__dirname, 'markup')
console.log('!!!!', qqqq)
fs.stat(path.resolve(__dirname, 'qqq'), function(err, result) {
	console.log(result)
})
fs.stat(path.resolve(__dirname, 'markup'), function(err, result) {
	console.log(result)
})

// inquirer.prompt(questions.start).then(checkQuestion);

// var child = exec('git clone https://github.com/AlexZ156/gulp.test.build.git');
// child.stdout.pipe(process.stdout);
// child.stderr.pipe(process.stderr);
// child.on('exit', function() {
// 	console.log(__dirname)
// 	/*del.sync(tempFolder + '/.git');
// 	fs.copySync(tempFolder, projectConfig.path);
// 	fs.removeSync(tempFolder);*/
// 	// currentCloneIndex++;
// 	// cloneRepo();
// });

