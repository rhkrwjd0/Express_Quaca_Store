var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');
//QS_017 제조완료 전 주문목록
var RCorderlist = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('RCorderlist StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, c.MenuName AS MenuName,c.OrderCnt AS OrderCnt, c.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND c.OrderStatus in ("RC","PC") and a.StoreId = '
                         +'"'+StoreIdData+'"'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("RCorderlist select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    console.log("~~~~~~~~",UserPayId);
                    var rowslenth = Object.keys(UserPayId).length;
                    console.log('2',rowslenth)
                    var memberData = new Object();
                    var arrmemberData = new Array();
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for(i=0; i<rowslenth; i++){
                        memberData = new Object();
                        memberData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                        memberData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                        memberData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
                        memberData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                        memberData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                        memberData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                        arrPointHistory = new Array();
                        for(j=0; j<memberData.OrderCnt; j++){
                            var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                            if( memberData.UserPayId == UserPayIdData ){
                                pointHistoryItem = new Object();        
                                pointHistoryItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                pointHistoryItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                pointHistoryItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                pointHistoryItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                pointHistoryItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;

                                arrPointHistory.push(pointHistoryItem);
                            }
                            memberData.OrderMenu = arrPointHistory;                      
                        }
                        arrmemberData.push(memberData);    
                        memberData = arrmemberData; 
                    }
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
}
//QS_018 총 주문목록
var allorderlist = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('allorderlist StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,SUBSTRING(c.UserPayDid,9,3) AS OrderNum, a.StoreId,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, b.Token AS Token, a.FirstMenuName AS FirstMenuName,c.OrderStatus as OrderStatus,c.OrderCnt AS OrderCnt, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.MenuId = c.MenuId AND a.StoreId = '
                        +'"'+StoreIdData+'"'+'ORDER BY a.UserPayId asc';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("allorderlist select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                console.log("allorderlist select success - ", Date());
                resolve({ code: 0, info:rows, rows:rows.length });
              }  
        });
    });
}
//QS_019 주문상세
var orderlistDetail = (UserPayid) =>{
    let UserPayidData = [UserPayid];
    return new Promise((resolve, reject) => {
        console.log('orderlistDetail StoreId 데이터 >',  UserPayidData);
        var selectSql = 'SELECT UserPayDid,UserPayId,StoreId,(CASE PayMethod when "card" then "신용카드" when "samsung" then "삼성페이" else "phone"  END) AS PayMethod , OrderCnt, MenuId,MenuName,Price,OptionA,OptionB,OptionC,OrderStatus,date_format(PayCompleteTime, "%Y-%m-%d %H:%i") AS PayCompleteTime,date_format(MenuCompleteTime, "%Y-%m-%d %H:%i") AS MenuCompleteTime,TotalPrice,PGUid FROM UserPayDetail where UserPayId = '
        + '"' + UserPayidData + '"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            console.log('UserPayDetail select rows.length > ',rows.length,rows);
            if (error) {
                console.log("UserPayDetail select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                console.log("UserPayDetail select success - ",Date());
                if (!error && rows.length > 0) {
                    var memberData = new Object();
                    memberData.UserPayId = rows[0].UserPayId;
                    memberData.StoreId = rows[0].StoreId;
                    memberData.PayMethod = rows[0].PayMethod;
                    memberData.OrderCnt = rows[0].OrderCnt;
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for (var i = 0; i < rows.length; i++) {
                        pointHistoryItem = new Object();
                        pointHistoryItem.UserPayDid = rows[i].UserPayDid;
                        pointHistoryItem.MenuId = rows[i].MenuId;
                        pointHistoryItem.MenuName = rows[i].MenuName;
                        pointHistoryItem.Price = rows[i].Price;
                        pointHistoryItem.OptionA = rows[i].OptionA;
                        pointHistoryItem.OptionB = rows[i].OptionB;
                        pointHistoryItem.OptionC = rows[i].OptionC;
                        memberData.OrderStatus = rows[i].OrderStatus;
                        memberData.PayCompleteTime = rows[i].PayCompleteTime;
                        memberData.MenuCompleteTime = rows[i].MenuCompleteTime;
                        arrPointHistory.push(pointHistoryItem);
                    }
                    memberData.OrderMenu = arrPointHistory;
                    memberData.TotalPrice = rows[0].TotalPrice;
                    memberData.PGUid = rows[0].PGUid;
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
}
//QS_021 접수전 주문목록 (OC만 나옴)
var OCorderlist = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('OCorderlist StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, c.MenuName AS MenuName,c.OrderCnt AS OrderCnt, a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus ="OC" and a.StoreId = '
        +'"'+StoreIdData+'"'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("OCorderlist select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                console.log("UserPayDetail select success - ",Date());
                if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    var rowslenth = Object.keys(UserPayId).length;
                    var memberData = new Object();
                    var arrmemberData = new Array();
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for(i=0; i<rowslenth; i++){
                        memberData = new Object();
                        memberData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                        memberData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                        memberData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
                        memberData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                        memberData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                        memberData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                        arrPointHistory = new Array();
                        for(j=0; j<memberData.OrderCnt; j++){
                            var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                            if( memberData.UserPayId == UserPayIdData ){
                                pointHistoryItem = new Object();        
                                pointHistoryItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                pointHistoryItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                pointHistoryItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                pointHistoryItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                pointHistoryItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;

                                arrPointHistory.push(pointHistoryItem);
                            }
                            memberData.OrderMenu = arrPointHistory;                      
                        }
                        arrmemberData.push(memberData);    
                        memberData = arrmemberData; 
                    }
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
            });
        });
    }
//QS_022 주문접수OC->RC
var OCRCchange = (StoreId,UserPayId) =>{
    let QueryData = [StoreId,UserPayId];
    return new Promise((resolve, reject) => {
        console.log('OCRCchange Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="RC" where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="RC" where StoreId=? and UserPayId = ?';
        var params =[StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_022 주문접수OC->RC
var OCrollback = (StoreId,UserPayId) =>{
    let QueryData = [StoreId,UserPayId];
    return new Promise((resolve, reject) => {
        console.log('OCRCchange Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="OC" where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="OC" where StoreId=? and UserPayId = ?';
        var params =[StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_023 주문접수RC->PC
var RCPCchange = (StoreId,UserPayId,MenuCompleteTime) =>{
    let QueryData = [StoreId,UserPayId,MenuCompleteTime];
    return new Promise((resolve, reject) => {
        console.log('RCPCchange Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="PC",MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="PC",MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
        var params =[MenuCompleteTime,StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_023_1 주문접수PC->RC rollback
var RCrollback = (StoreId,UserPayId,MenuCompleteTime) =>{
    let QueryData = [StoreId,UserPayId,MenuCompleteTime];
    return new Promise((resolve, reject) => {
        console.log('RCrollback Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="RC",MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="RC",MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
        var params =[MenuCompleteTime,StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_024 픽업완료PC->PUC
var PCPUCchange = (StoreId,UserPayId) =>{
    let QueryData = [StoreId,UserPayId];
    return new Promise((resolve, reject) => {
        console.log('PCPUCchange Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="PUC" where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="PUC" where StoreId=? and UserPayId = ?';
        var params =[StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({ msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_024_1 주문접수PUC->PC rollback
var PCrollback = (StoreId,UserPayId) =>{
    let QueryData = [StoreId,UserPayId];
    return new Promise((resolve, reject) => {
        console.log('PCrollback Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="PC" where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="PC" where StoreId=? and UserPayId = ?';
        var params =[StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error);
                        reject({ msg: error });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
exports.RCorderlist = RCorderlist
exports.allorderlist = allorderlist
exports.orderlistDetail = orderlistDetail
exports.OCorderlist = OCorderlist
exports.OCRCchange = OCRCchange
exports.OCrollback = OCrollback
exports.RCPCchange = RCPCchange
exports.RCrollback = RCrollback
exports.PCPUCchange = PCPUCchange
exports.PCrollback = PCrollback
