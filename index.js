/**
 * Created by Siarhei_Rylach on 11/16/2017.
 */
"use strict";

const fs = require('fs');
const createHTML = require('create-html');
let counter = 1;
module.exports = {

    _body: '<div class="container"><div class="panel-group" id="accordion">',

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
        this._body += '<div class="panel panel-default">';

        if(result.status == 'passed'){
            this._body +=  '<div class="panel-heading bg-success">';
        }else{
            this._body +=  '<div class="panel-heading bg-danger">';
        }

        this._body +=   '<h4 class="panel-title">'+
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
        this._body += '</div></div>';

        const html = createHTML({
            title: 'report',
            script: ['https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
                'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'],
            css: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
            lang: 'en',
            dir: './',
            head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
            body: this._body,
        });


        fs.writeFileSync('report.html', html);
    }
};