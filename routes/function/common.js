var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');

//그룹화
const groupBy = function (data, key) {
    return data.reduce(function (carry, el) {
        var group = el[key];
        if (carry[group] === undefined) {
            carry[group] = []
        }
        carry[group].push(el)
        return carry
    },{} )
}

exports.groupBy = groupBy
