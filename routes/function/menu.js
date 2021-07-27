var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');

//QS_008 매장 메뉴정보 (카테고리별 메뉴목록-메뉴아이디,이름,가격,이미지,옵션, 추천메뉴T/F, 숨김T/F)
var menulist = (StoreId) =>{
    let StoreData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('store  데이터 >',  StoreData);
        let selectSql = 'SELECT StoreId,MenuId,LargeDivcd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate FROM Menu where StoreId = '
                         + '"' + StoreId + '"'+'order by LargeDivCd desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("menulist select error - ", Date());
                console.log("errno > " + error);
                reject({ msg: error });
              }else {
                console.log("menulist select success - ",Date());
                if (!error && rows.length > 0) {
                    var menuData = new Object();
                    var pointDrinkItem = new Object();
                    var pointBreadItem = new Object();
                    var pointGoodsItem = new Object();

                    var arrPointdrink = new Array();
                    var arrPointbread = new Array();
                    var arrPointgoods = new Array();
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].LargeDivcd == 'S') {
                            pointDrinkItem = new Object();
                            pointDrinkItem.MenuId = rows[i].MenuId;
                            pointDrinkItem.MenuName = rows[i].MenuName;
                            pointDrinkItem.Price = rows[i].Price;
                            pointDrinkItem.ImgUrl = rows[i].ImgUrl;
                            pointDrinkItem.OptionA = rows[i].OptionA;
                            pointDrinkItem.OptionB = rows[i].OptionB;
                            pointDrinkItem.OptionC = rows[i].OptionC;
                            pointDrinkItem.Best = rows[i].Best;
                            arrPointdrink.push(pointDrinkItem);
                        }else if(rows[i].LargeDivcd == 'D') {
                            pointDrinkItem = new Object();
                            pointDrinkItem.MenuId = rows[i].MenuId;
                            pointDrinkItem.MenuName = rows[i].MenuName;
                            pointDrinkItem.Price = rows[i].Price;
                            pointDrinkItem.ImgUrl = rows[i].ImgUrl;
                            pointDrinkItem.OptionA = rows[i].OptionA;
                            pointDrinkItem.OptionB = rows[i].OptionB;
                            pointDrinkItem.OptionC = rows[i].OptionC;
                            pointDrinkItem.Best = rows[i].Best;
                            arrPointdrink.push(pointDrinkItem);
                        }else if(rows[i].LargeDivcd == 'B') {
                            pointBreadItem = new Object();
                            pointBreadItem.MenuId = rows[i].MenuId;
                            pointBreadItem.MenuName = rows[i].MenuName;
                            pointBreadItem.Price = rows[i].Price;
                            pointBreadItem.ImgUrl = rows[i].ImgUrl;
                            pointBreadItem.OptionA = rows[i].OptionA;
                            pointBreadItem.OptionB = rows[i].OptionB;
                            pointBreadItem.OptionC = rows[i].OptionC;
                            pointBreadItem.Best = rows[i].Best;
                            arrPointbread.push(pointBreadItem);
                        }else if(rows[i].LargeDivcd == 'G') {
                            pointGoodsItem = new Object();
                            pointGoodsItem.MenuId = rows[i].MenuId;
                            pointGoodsItem.MenuName = rows[i].MenuName;
                            pointGoodsItem.Price = rows[i].Price;
                            pointGoodsItem.ImgUrl = rows[i].ImgUrl;
                            pointGoodsItem.OptionA = rows[i].OptionA;
                            pointGoodsItem.OptionB = rows[i].OptionB;
                            pointGoodsItem.OptionC = rows[i].OptionC;
                            pointGoodsItem.Best = rows[i].Best;
                            arrPointgoods.push(pointGoodsItem);
                        }
                    }
                    menuData.drink = arrPointdrink;
                    menuData.bread = arrPointbread;
                    menuData.goods = arrPointgoods;
                    resolve({ success: true, info: menuData ,code:0})
                }else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
}
//QS_009, QS_016 메뉴 조회
var menuInfo = (StoreId,MenuId) =>{
    let menuInfoData = [StoreId,MenuId];
    return new Promise((resolve, reject) => {
        console.log(' menuInfoData 데이터 >',  menuInfoData);
        var selectSql = 'SELECT StoreId,MenuId,LargeDivcd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq FROM Menu where StoreId = '
                     +'"' +StoreId + '"'+'and MenuId = '+'"'+MenuId+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("menuInfoData select error - ", Date());
                console.log("errno > " + error);
                reject({ code: error, msg: error });
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
//QS_009, QS_016 메뉴 등록
var Minsert = (StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,InsertDate) =>{
    let MinsertData = [StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,InsertDate];
    return new Promise((resolve, reject) => {
        console.log('MinsertData  데이터 >',  MinsertData);
        //등록
        var sql = 'INSERT INTO Menu(MenuId,StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,InsertDate) select(select CONCAT(?,?,LPAD((SELECT COUNT(*)+1 FROM Menu WHERE LargeDivCd= ? AND MidDivCd = ? and StoreId = ?),3,"0")) AS MenuId FROM dual),?,?,?,?,?,?,?,?,?,?,?,? FROM DUAL';
        var params =[LargeDivCd,MidDivCd,LargeDivCd,MidDivCd,StoreId,StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,InsertDate];
        conn.connection.query(sql,params, function (error, rows, fields) {
            //등록 후 조회
            var selectSql = 'SELECT StoreId,MenuId,LargeDivcd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq FROM Menu where StoreId = '
                 +'"' +StoreId + '"'+' AND LargeDivCd= '+'"'+LargeDivCd+'"'+' Order By MenuId desc';
            conn.connection.query(selectSql, function (error, rows, fields) {
                if (error) {
                    console.log("Minsert insert error - ", Date());
                    console.log("errno > " + error);
                    reject({ msg: error });
                }else{
                    if (!error && rows.length > 0) {
                        resolve({ success: true, rows: rows[0] ,code:0});
                      } else if (!error && rows.length == 0) {
                        resolve({ success: false, msg: null ,code:1});
                      } else {
                        resolve({ success: false, msg: error,code:2 });
                      }
                }  
            });
        });
    })
}
//QS_009, QS_016 메뉴 수정
var Mupdate = (MenuName,Price,OptionA,OptionB,OptionC,Best,StoreId,MenuId) =>{
    let MupdateData = [MenuName,Price,OptionA,OptionB,OptionC,Best,StoreId,MenuId];
    return new Promise((resolve, reject) => {
        console.log('MupdateData  데이터 >',  MupdateData);
        //등록
        var sql = 'UPDATE Menu SET MenuName=?,Price=?,OptionA=?,OptionB=?,OptionC=?,Best=? WHERE StoreId = ? and MenuId = ?'
        var params =[MenuName,Price,OptionA,OptionB,OptionC,Best,StoreId,MenuId];
        conn.connection.query(sql,params, function (error, rows, fields) {
            //등록 후 조회
            var selectSql = 'SELECT c.StoreId AS StoreId, c.MenuId AS MenuId, c.LargeDivCd AS LargeDivCd, c.MidDivCd AS MidDivCd, c.MenuName AS MenuName, c.Price AS Price, c.ImgUrl AS ImgUrl, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC, c.Best AS Best, c.UseYn as UseYn, DATE_FORMAT(c.InsertDate, "%Y-%m-%d %H:%i") AS InsertDate FROM Menu c WHERE c.StoreId= '
                          + "'" + StoreId + "'" + 'and c.MenuId= ' + "'" + MenuId + "'";
            conn.connection.query(selectSql, function (error, rows, fields) {
                if (error) {
                    console.log("MupdateData update error - ", Date());
                    console.log("errno > " + error);
                    reject({ msg: error });
                }else{
                    if (!error && rows.length > 0) {
                        resolve({ success: true, rows: rows[0] ,code:0});
                      } else if (!error && rows.length == 0) {
                        resolve({ success: false, msg: null ,code:1});
                      } else {
                        resolve({ success: false, msg: error,code:2 });
                      }
                }  
            });
        });
    })
}
//QS_009, QS_016 메뉴 수정
var Mdelete = (StoreId,MenuId) =>{
    let MdeleteData = [StoreId,MenuId];
    return new Promise((resolve, reject) => {
        console.log('MdeleteData  데이터 >',  MdeleteData);
        //삭제
        var sql = 'delete from Menu WHERE StoreId = '
                     + '"'+ StoreId +'"'+ ' and MenuId = '+'"'+MenuId+'"';
        conn.connection.query(sql, function (error, rows, fields) {
            if (error) {
                console.log("MdeleteData update error - ", Date());
                console.log("errno > " + error);
                reject({ msg: error });
            }else{
                resolve({ success: true,code:0});    
            }  
        });
    });
}
exports.menulist = menulist
exports.menuInfo = menuInfo
exports.Minsert = Minsert
exports.Mupdate = Mupdate
exports.Mdelete = Mdelete