var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');

//QS_001 로그인
var login = (SID,PassWord) =>{
    let loginData = [SID,PassWord];
    return new Promise((resolve, reject) => {
        console.log('login  데이터 >',  loginData);
        var selectSql = 'SELECT SEQ,SID,PassWord,StoreId,Token,TelNo,UseYn,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM MUser where SId = '
                    + '"' + SID + '"' + 'and PassWord = ' + "'" + PassWord + "'";
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("login select error - ", Date());
                console.log("errno > " + error);
                reject({ msg: error.sqlMessage });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info: rows[0] ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
}
//QS_031 회원가입
var signup = (SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt) =>{
    let signupData = [SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt];
    return new Promise((resolve, reject) => {
        console.log('signup  데이터 >',  signupData);
        var sql = 'insert into MUser(SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt)  values(?,?,?,?,?,?,?)';
        var params =[SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt];
        conn.connection.query(sql,params, function (error, rows, fields) {
          if (error) {
            console.log("boardinsert insert error - ", Date());
            console.log("errno > " + error);
            reject({  msg: error });
          }else{
              resolve({ success: true  ,code:0});
          }  
        });
    });
}
//QS_033 아이디 찾기
var forgetSID = (Token) =>{
  let forgetSIDData = [Token];
  return new Promise((resolve, reject) => {
      console.log(' forgetSIDData 데이터 >',  forgetSIDData);
      var selectSql ='SELECT SID FROM MUser WHERE Token = '
                     +"'" + Token + "'";
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("forgetSIDData select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
            } else {
              if (!error && rows.length > 0) {
                  resolve({ success: true, info: rows[0] ,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QS_032 비밀번호 찾기
var forgetpassword = (SID,Token) =>{
  let forgetpasswordData = [SID,Token];
  return new Promise((resolve, reject) => {
      console.log('login  데이터 >',  forgetpasswordData);
      var selectSql ='SELECT PassWord FROM MUser WHERE SID = '
                    + "'" + SID+"'"+' and Token = '+"'" + Token + "'";
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("forgetpassword select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
            } else {
              if (!error && rows.length > 0) {
                  resolve({ success: true, info: rows[0] ,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QS_027 사용자 토큰 수정
var tokenupdate = (SID,Token) =>{
  let tokenData = [SID,Token];
  return new Promise((resolve, reject) => {
      console.log('토큰  데이터 >',  tokenData);
      var sql = 'UPDATE MUser SET Token=? WHERE SID= ?';
      var params =[Token,SID];
      conn.connection.query(sql,params, function (error, rows, fields) {
        var selectSql = 'SELECT SEQ,SID,PassWord,StoreId,Token,TelNo,UseYn,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM MUser where SId = '
                    + '"' + SID + '"' + 'and Token = ' + "'" + Token + "'";
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("login select error - ", Date());
              console.log("errno > " + error);
              reject({ msg: error });
            } else {
              if (!error && rows.length > 0) {
                  resolve({ success: true, info: rows[0] ,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
      });
  });
}
exports.login = login
exports.signup = signup
exports.forgetpassword = forgetpassword
exports.forgetSID = forgetSID
exports.tokenupdate = tokenupdate