/**
 * Created by Siarhei_Rylach on 11/16/2017.
 */
"use strict";

const fs = require('fs');
const log4js = require('log4js');

log4js.configure({
    appenders: { sweet: { type: 'file', filename: 'sweet.log' } },
    categories: { default: { appenders: ['sweet'], level: 'debug' } }
});

const logger = log4js.getLogger('sweet');


let counterId = 1;
let counterSuiteId = 1;


module.exports = {

    _numberFailedSpec: 0,

    _numberPassedSpec: 0,

    _suits: [],

    _screenshotsPath: './screenshot/',

    _reportPath: './report.html',

    _current: null,

    jasmineStarted: function (suiteInfo) {
        logger.debug('Running suite with ' + suiteInfo.totalSpecsDefined);
    },

    suiteStarted: function (result) {
        logger.debug('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);

        if (this._current) {
            let parent = this._current;
            this._current = {
                name: result.description,
                parent: parent,
                specs: [],
                childs: []
            };

            parent.childs.push(this._current);
        } else {
            this._current = {
                name: result.description,
                parent: null,
                specs: [],
                childs: []
            };

            this._suits.push(this._current);
        }

    },

    specStarted: function (result) {
        logger.debug('Spec started: ' + result.description + ' whose full description is: ' + result.fullName);
    },

    specDone: function (result) {
        logger.debug('Spec: ' + result.description + ' was ' + result.status);

        let isPassed = result.status === 'passed';

        //statistics
        if(isPassed){
            this._numberPassedSpec++;
        }else{
            this._numberFailedSpec++;
        }

        let screenName = result.description.replace(/[/:\s,]/g, '_');
        let dateScreen = new Date().toLocaleString("en").replace(/[/:\s,]/g, '_');
        screenName = screenName + "_" + dateScreen + '.png';

        let pathScreen = this._screenshotsPath + screenName;

        Promise.resolve(this._createScreenshot(screenName, this._screenshotsPath));

        let stack = result.failedExpectations.reduce(function (res, current) {
            return res + current.stack;
        }, "");
        let messages = result.failedExpectations.reduce(function (res, current) {
            return res + current.message;
        }, "");

        this._current.specs.push({
            name: result.description,
            result: isPassed,
            stack: stack,
            messages: messages,
            screen: pathScreen
        });
    },

    suiteDone: function (result) {
        logger.debug('Suite: ' + result.description + ' was ' + result.status);

        this._current.result = !this._current.specs.some((spec)=> spec.result === false);
        if(this._current.result){
            this._current.result = !this._current.childs.some((suite)=> suite.result === false)
        }
        this._current = this._current.parent;
    },

    jasmineDone: function () {
        logger.debug('Jasmine done');

        this._toHtml();
    },

    _toHtml: function () {

        let header =  '<!DOCTYPE html>'+
            '<html lang="en">'+
            '<head>'+
            '<title>report</title>'+
            '<meta charset="utf-8">'+
            '<meta name="viewport" content="width=device-width, initial-scale=1">'+
            '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'+
            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>'+
            '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>'+
            '</head>'+
            '<body>'+
            '<div class="container">'+
                `<span class="label label-success">Passed: ${this._numberPassedSpec}</span>`+
                `<span class="label label-danger">Failed:  ${this._numberFailedSpec}</span>`;

        this._writeFile(header);

        this._appendFile(this._htmlRecursion(this._suits));

        this._appendFile('</div></body></html>');





    },

    _htmlRecursion: function(suites){
        return suites.reduce((suiteHtml, suite)=>{
            suiteHtml += `<div class="panel-group" id="suite-accordion${counterSuiteId}">`+
                '<div class="panel">';
            if(suite.result){
                suiteHtml += '<div class="panel-heading bg-success">';
            }else {
                suiteHtml += '<div class="panel-heading bg-danger">';
            }

            suiteHtml +=  '<h4 class="panel-title">'+
                `<a data-toggle="collapse" data-parent="suite-accordion${counterSuiteId}" href="#suite-collapse${counterSuiteId}">${suite.name}</a>`+
                '</h4>'+
                '</div>'+
                `<div id="suite-collapse${counterSuiteId}" class="panel-collapse collapse">`+
                '<div class="panel-body">';

            if(!this._isEmpty(suite.childs)){
                counterSuiteId++;
                suiteHtml += this._htmlRecursion(suite.childs);
            }

            if(!this._isEmpty(suite.specs)){
                suite.specs.forEach((spec)=>{
                    suiteHtml +=  `<div class="panel-group" id="spec-accordion${counterId}">`+
                        '<div class="panel">';
                    if(spec.result){
                        suiteHtml += '<div class="panel-heading bg-success">';
                    }else{
                        suiteHtml += '<div class="panel-heading bg-danger">';
                    }

                    suiteHtml +=   '<h4 class="panel-title">'+
                        `<a data-toggle="collapse" data-parent="#spec-accordion${counterId}" href="#collapse${counterId}">`+
                        spec.name+
                        '</a>'+
                        '</h4>'+
                        '</div>'+
                        `<div id="collapse${counterId}" class="panel-collapse collapse">`+
                        '<div class="panel-body">';
                    if(spec.result) {
                        suiteHtml += '<p>Passed</p>';
                    }else{
                        suiteHtml +=  `<div class="panel-group" id="messages-accordion${counterId}">`+
                            '<div class="panel">'+
                            '<div class="panel-heading bg-danger">'+
                            '<h4 class="panel-title">'+
                            `<a data-toggle="collapse" data-parent="messages-accordion${counterId}" href="#messages-collapse${counterId}">Messages</a>`+
                            '</h4>'+
                            '</div>'+
                            `<div id="messages-collapse${counterId}" class="panel-collapse collapse">`+
                            `<div class="panel-body">${spec.messages}</div>`+
                            '</div>'+
                            '</div>'+
                            '</div>';

                        suiteHtml +=  `<div class="panel-group" id="stack-accordion${counterId}">`+
                            '<div class="panel">'+
                            '<div class="panel-heading bg-danger">'+
                            '<h4 class="panel-title">'+
                            `<a data-toggle="collapse" data-parent="stack-accordion${counterId}" href="#stack-collapse${counterId}">Stack</a>`+
                            '</h4>'+
                            '</div>'+
                            `<div id="stack-collapse${counterId}" class="panel-collapse collapse">`+
                            `<div class="panel-body">${spec.stack}</div>`+
                            '</div>'+
                            '</div>'+
                            '</div>';
                    }

                    suiteHtml +=     `<a href="${spec.screen}" target="_blank">` +
                        'Screen' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    counterId++;

                });
            }

            counterSuiteId++;

            return suiteHtml +=            '</div>'+
                '</div>'+
                '</div>'+
                '</div>';
        }, "");
    },

    setPath4Screenshots: function (path) {
        this._screenshotsPath = path;
    },

    setPath4OutputReport: function (path) {
        this._createDir(path);
        this._reportPath = path + 'report.html';
    },


    _isEmpty: function (array) {
        return array.length < 1;
    },

    _createScreenshot: function (name , dir) {
        this._createDir(dir);

        return  browser.takeScreenshot().then((screen)=>{
            let path =  dir + name;
            return fs.writeFile(path, screen, 'base64', function(err) {
                if(err) {
                    console.log(err);
                }
                return path;
            });
        });

    },

    _createDir: function createDir(path) {
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }

    },

    _writeFile: function(data){
        fs.writeFileSync(this._reportPath, data);
    },

    _appendFile: function (data) {
        fs.appendFileSync(this._reportPath, data);
    }

};