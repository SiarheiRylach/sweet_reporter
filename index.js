/**
 * Created by Siarhei_Rylach on 11/16/2017.
 */
"use strict";

const fs = require('fs');
let counterId = 1;
let counterSuiteId = 1;
const dirScreenshots = './screenshot/';

module.exports = {

    _header:  '<!DOCTYPE html>'+
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
                '<div class="container">',

    _html: '',

    _buffer: '',


    jasmineStarted: function(suiteInfo) {
        this._writeFile(this._header);

       // console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
    },

    suiteStarted: function(result) {
       // console.log('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
    },

    specStarted: function(result) {
        this._buffer += `<div class="panel-group" id="spec-accordion${counterId}">`+
                        '<div class="panel">';
    },

    specDone: function(result) {
        let isPassed  = result.status === 'passed';
        let screenName = result.description.replace(/[/:\s,]/g, '_') + '.png';

        Promise.resolve(this._createScreenshot(screenName));

        if(isPassed){
            this._buffer += '<div class="panel-heading bg-success">';
        }else{
            this._buffer += '<div class="panel-heading bg-danger">';
        }

        this._buffer +=   '<h4 class="panel-title">'+
                            `<a data-toggle="collapse" data-parent="#spec-accordion${counterId}" href="#collapse${counterId}">`+
                                result.description+
                            '</a>'+
                        '</h4>'+
                    '</div>'+
                    `<div id="collapse${counterId}" class="panel-collapse collapse">`+
                        '<div class="panel-body">';
        if(isPassed) {
            this._buffer += `<p>${result.status}</p>`;
        }else{
            let stack = result.failedExpectations.reduce(function(res, current) {
                return res + current.stack;
            }, "");

            let messages = result.failedExpectations.reduce(function(res, current) {
                return res + current.message;
            }, "");

            this._buffer +=  `<div class="panel-group" id="messages-accordion${counterId}">`+
                                '<div class="panel">'+
                                    '<div class="panel-heading bg-danger">'+
                                        '<h4 class="panel-title">'+
                                            `<a data-toggle="collapse" data-parent="messages-accordion${counterId}" href="#messages-collapse${counterId}">Messages</a>`+
                                        '</h4>'+
                                    '</div>'+
                                    `<div id="messages-collapse${counterId}" class="panel-collapse collapse">`+
                                        `<div class="panel-body">${messages}</div>`+
                                    '</div>'+
                                '</div>'+
                            '</div>';

            this._buffer +=  `<div class="panel-group" id="stack-accordion${counterId}">`+
                                '<div class="panel">'+
                                    '<div class="panel-heading bg-danger">'+
                                        '<h4 class="panel-title">'+
                                            `<a data-toggle="collapse" data-parent="stack-accordion${counterId}" href="#stack-collapse${counterId}">Stack</a>`+
                                        '</h4>'+
                                    '</div>'+
                                    `<div id="stack-collapse${counterId}" class="panel-collapse collapse">`+
                                        `<div class="panel-body">${stack}</div>`+
                                    '</div>'+
                                '</div>'+
                            '</div>';
        }

        this._buffer +=     `<a href="${dirScreenshots + screenName}" target="_blank">` +
                             'Screen' +
                          '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>';



        counterId++;
        //console.log('Spec: ' + result.description + ' was ' + result.status);
        /*for(var i = 0; i < result.failedExpectations.length; i++) {
            console.log('Failure: ' + result.failedExpectations[i].message);
            console.log(result.failedExpectations[i].stack);
        }
        console.log(result.passedExpectations.length);*/
    },

    suiteDone: function(result) {
        this._html = `<div class="panel-group" id="suite-accordion${counterSuiteId}">`+
                            '<div class="panel">';

        let isPassed  = result.failedExpectations.length < 1;

        if(isPassed){
            this._html += '<div class="panel-heading bg-success">';
        }else{
            this._html += '<div class="panel-heading bg-danger">';
        }

        this._html +=                '<h4 class="panel-title">'+
                                        `<a data-toggle="collapse" data-parent="suite-accordion${counterSuiteId}" href="#suite-collapse${counterSuiteId}">${result.description}</a>`+
                                    '</h4>'+
                                '</div>'+
                                `<div id="suite-collapse${counterSuiteId}" class="panel-collapse collapse">`+
                                    `<div class="panel-body">${this._buffer}</div>`+
                                '</div>'+
                            '</div>'+
                        '</div>';
        this._buffer = '';
        counterSuiteId++;
       /* console.log('Suite: ' + result.description + ' was ' + result.status);
        for(var i = 0; i < result.failedExpectations.length; i++) {
            console.log('AfterAll ' + result.failedExpectations[i].message);
            console.log(result.failedExpectations[i].stack);
        }*/
    },

    jasmineDone: function() {
       this._buffer += '</div></div></div></body>';

        fs.appendFileSync('report.html', this._buffer);
    },

    _createScreenshot: function (name) {
        this._createDir(dirScreenshots);

       return  browser.takeScreenshot().then((screen)=>{
            //let name = new Date().toLocaleString("en").replace(/[/:\s,]/g, '') + '.png';
            let path =  dirScreenshots + name;
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
        fs.writeFileSync('report.html', data);
    },

    _appendFile: function (data) {
        fs.appendFileSync('report.html', data);
    }

};