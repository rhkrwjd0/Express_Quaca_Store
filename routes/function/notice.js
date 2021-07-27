var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');

//QS_028 공지사항 등록
var inotice = (StoreId,StartDate,EndDate,Title,DisCription) =>{
    let noticeData = [StoreId,StartDate,EndDate,Title,DisCription];
    return new Promise((resolve, reject) => {
        console.log('signup  데이터 >',  signupData);
        var sql = 'INSERT INTO Notice(StoreId,StartDate,EndDate,Title,DisCription) values(?,?,?,?,?)';
        var params =[StoreId,StartDate,EndDate,Title,DisCription];
        conn.connection.query(sql,params, function (error, rows, fields) {
          if (error) {
            console.log("notice insert error - ", Date());
            console.log("errno > " + error);
            reject({msg: error.sqlMessage });
          }else{
              resolve({ success: true  ,code:0});
          }  
        });
    });
}
//QS_029 공지사항 수정
var unotice = (StartDate,EndDate,Title,DisCription,StoreId) =>{
    let noticeData = [StartDate,EndDate,Title,DisCription,StoreId];
    return new Promise((resolve, reject) => {
        console.log('update  데이터 >',  noticeData);
        var sql = 'UPDATE Notice SET StartDate=?, EndDate=?, Title=?,DisCription=?  where StoreId=?';
        var params =[StartDate,EndDate,Title,DisCription,StoreId];
        conn.connection.query(sql,params, function (error, rows, fields) {
          if (error) {
            console.log("notice update error - ", Date());
            console.log("errno > " + error);
            reject({  msg: error.sqlMessage });
          }else{
              resolve({ success: true  ,code:0});
          }  
        });
    });
}
//QS_030공지사항 삭제
var dnotice = (StoreId) =>{
    let noticeData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('delete  데이터 >',  noticeData);
        var sql = 'delete from Notice where StoreId=?';
        var params =[StoreId];
        conn.connection.query(sql,params, function (error, rows, fields) {
          if (error) {
            console.log("notice delete error - ", Date());
            console.log("errno > " + error.errno);
            reject({ msg: error });
          }else{
              resolve({ success: true  ,code:0});
          }  
        });
    });
}
exports.inotice = inotice
exports.unotice = unotice
exports.dnotice = dnotice