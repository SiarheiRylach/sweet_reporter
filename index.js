/**
 * Created by Siarhei_Rylach on 11/16/2017.
 */
"use strict";

const fs = require('fs');
let counterId = 1;
const dirScreenshots = './screenshot/';

module.exports = {

    _html:  '<!DOCTYPE html>'+
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
                    '<div class="panel-group" id="accordion">',

    jasmineStarted: function(suiteInfo) {
       // console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
    },

    suiteStarted: function(result) {
       // console.log('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
    },

    specStarted: function(result) {
      //  console.log('Spec started: ' + result.description + ' whose full description is: ' + result.fullName);
    },

    specDone: function(result) {
        let screenName = result.description.replace(/[/:\s,]/g, '_') + '.png';

        Promise.resolve(this._createScreenshot(screenName));

        this._html += '<div class="panel">';

        if(result.status == 'passed'){
            this._html += '<div class="panel-heading bg-success">';
        }else{
            this._html += '<div class="panel-heading bg-danger">';
        }
        let stack = result.failedExpectations.reduce(function(res, current) {
            return res + current.stack;
        }, "");
        this._html +=   '<h4 class="panel-title">'+
                            `<a data-toggle="collapse" data-parent="#accordion" href="#collapse${counterId}">`+
                                result.description+
                            '</a>'+
                        '</h4>'+
                    '</div>'+
                    `<div id="collapse${counterId}" class="panel-collapse collapse">`+
                        '<div class="panel-body">';
        if(stack) {
            this._html += `<p>${stack}</p>`;
        }else{
            this._html += `<p>${result.status}</p>`;
        }

        this._html +=     `<a href="${dirScreenshots + screenName}" target="_blank">` +
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
       /* console.log('Suite: ' + result.description + ' was ' + result.status);
        for(var i = 0; i < result.failedExpectations.length; i++) {
            console.log('AfterAll ' + result.failedExpectations[i].message);
            console.log(result.failedExpectations[i].stack);
        }*/
    },

    jasmineDone: function() {
        this._html += '</div></div>';

        fs.writeFileSync('report.html', this._html);
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

    }

};