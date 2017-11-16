/**
 * Created by Siarhei_Rylach on 11/16/2017.
 */
"use strict";

const fs = require('fs');
const createHTML = require('create-html');

module.exports = {


    jasmineStarted: function(suiteInfo) {
       // console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
        const html = createHTML({
            title: 'report',
            script: ['https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
                     'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'],
            css: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
            lang: 'en',
            dir: './',
            head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
            body: '<div class="container"><div class="panel-group" id="accordion">',
            favicon: 'favicon.png'
        });

        fs.writeFileSync('report.html', html);
    },

    suiteStarted: function(result) {
       // console.log('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
    },

    specStarted: function(result) {
      //  console.log('Spec started: ' + result.description + ' whose full description is: ' + result.fullName);
    },

    specDone: function(result) {
        let infoSpec = '<div class="panel panel-default">'+
                            '<div class="panel-heading">' +
                                '<h4 class="panel-title">'+
                                    '<a data-toggle="collapse" data-parent="#accordion" href="#collapse1">'+
                                        result.description+
                                    '</a>'+
                                '</h4>'+
                            '</div>'+
                            '<div id="collapse1" class="panel-collapse collapse in">'+
                                '<div class="panel-body">'+
                                    'Lorem'+
                                '</div>'+
                            '</div>'+
                        '</div>';

        fs.appendFileSync('report.html', infoSpec);
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
        let closeTags = '</div></div>';
        fs.appendFileSync('report.html', closeTags);
        console.log('Finished suite');
    }
};