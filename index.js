/**
 * Created by Siarhei_Rylach on 11/16/2017.
 */
"use strict";

const fs = require('fs');
let counter = 1;

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
        this._html += '<div class="panel">';

        if(result.status == 'passed'){
            this._html += '<div class="panel-heading bg-success">';
        }else{
            this._html += '<div class="panel-heading bg-danger">';
        }
        this._createScreenshot().then((path)=>{
            this._html +=   '<h4 class="panel-title">'+
                                `<a data-toggle="collapse" data-parent="#accordion" href="#collapse${counter}">`+
                                    result.description+
                                '</a>'+
                            '</h4>'+
                        '</div>'+
                        `<div id="collapse${counter}" class="panel-collapse collapse">`+
                            '<div class="panel-body">'+
                                `<p>${result.status}</p>`+
                                `<a href="${path}"`+
                                    'screen'+
                                '</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

            counter++;
        });


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

    _createScreenshot: function () {
        this._createDir('./screenshot');

        return new Promise((resolve, reject)=>{
            browser.takeScreenshot().then((screen)=>{
                let name = new Date().toLocaleString("en").replace(/[/:\s,]/g, '') + '.png';
                let path = './screenshot/' + name;
                fs.writeFile(path, screen, 'base64', function(err) {
                    if(err) {
                        reject(err);
                    }
                    resolve(path);
                });
            });
        });
    },


    _createDir: function createDir(path) {
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }

    }

};