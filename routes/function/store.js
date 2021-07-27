var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');

//QS_002 매장정보
var store = (StoreId) =>{
    let StoreData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('store  데이터 >',  StoreData);
        var selectSql = 'SELECT StoreId,StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,SigunguCode,MainImgUrl,DetailImgUrl,UseYn,date_format(insertDt, "%Y-%m-%d %H:%i") AS insertDt FROM StoreInfo where StoreId = '
                        +'"' +StoreId + '"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("store select error - ", Date());
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
}
//QS_025, 매장정보 수정(통합)
var Supdate = (StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,MainImgUrl,StoreId) =>{
  let SupdateData = [StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,MainImgUrl,StoreId];
  return new Promise((resolve, reject) => {
      console.log('SupdateData  데이터 >',  SupdateData);
      //수정
      var sql = 'UPDATE StoreInfo SET StoreName = ?,OpenTime=?,CloseTime=?,DayOff=?,TelNo=?,Addr1=?,Addr2=?,Lat=?,Lon=?,MainImgUrl=? WHERE StoreId = ?'
      var params =[StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,MainImgUrl,StoreId];
      conn.connection.query(sql,params, function (error, rows, fields) {
        //수정 후 재조회
        var selectSql = 'SELECT b.StoreId AS StoreId,b.StoreName AS StoreName, b.OpenTime AS OpenTime,b.CloseTime AS CloseTime,b.DayOff AS DayOff,b.TelNo AS TelNo,b.Addr1 AS Addr1,b.Addr2 AS Addr2,b.Lat AS Lat,b.Lon AS Lon,b.SigunguCode AS SigunguCode,b.MainImgUrl AS MainImgUrl,b.DetailImgUrl AS DetailImgUrl,b.UseYn AS UseYn,DATE_FORMAT(b.InsertDT, "%Y-%m-%d %H:%i") AS InsertDT FROM MUser a, StoreInfo b WHERE a.StoreId = b.StoreId and a.StoreId= '
                     + "'" + StoreId+"'";
        conn.connection.query(selectSql, function (err, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("salestimeData update error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
          }else{
            resolve({ success: true  ,code:0, rows:rows, lenth:rows.length});
          }  
      });
  }); 
  })
}

exports.store = store
exports.Supdate = Supdate
