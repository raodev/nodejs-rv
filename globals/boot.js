"use strict";
const edge = require('edge.js');
const useragent = require('useragent');
const isBot = require('isbot');

edge.global('time', function () {
    return new Date().getTime()
})
