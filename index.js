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
                '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">'+
                '<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>'+
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>'+
                '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>'+
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

        this._html +=   '<h4 class="panel-title">'+
                            `<a data-toggle="collapse" data-parent="#accordion" href="#collapse${counter}">`+
                                result.description+
                            '</a>'+
                        '</h4>'+
                    '</div>'+
                    `<div id="collapse${counter}" class="panel-collapse collapse">`+
                        '<div class="panel-body">'+
                            `${result.status}`+
                        '</div>'+
                    '</div>'+
                '</div>';

        counter++;
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
    }
};