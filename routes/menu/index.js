var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { json } = require('express');
var moment = require('moment');
var conn = require('../components/mariaDB');
var https = require('https');
var request = require('request');
let serverurl = "https://tera-energy.github.io/Tera_Quaca_Common/server.json";
var {menulist,menuInfo,Minsert,Mupdate,Mdelete} = require('../function/menu');


//QS_008 매장 메뉴정보 (카테고리별 메뉴목록-메뉴아이디,이름,가격,이미지,옵션, 추천메뉴T/F, 숨김T/F)
router.post('/menulist', function (req, res) {
    let StoreId = req.body.StoreId;
    menulist(StoreId)
    .then((resmenulist)=>{
        if (resmenulist.code == 0) {
        res.json({ success: true, info: resmenulist.info });
        console.log("res menulist  Select 성공 -", Date());
        }else if(resmenulist.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menulist 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenulist.msg });
        console.log("res  menulist Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menulist catch - menulist select 실패 :", error, " - ", Date());
    })
});
//=QS_009, QS_016 메뉴 상세조회
router.post('/menuInfo', function (req, res) {
    let StoreId = req.body.StoreId;
    let MenuId = req.body.MenuId;

    menuInfo(StoreId,MenuId)
    .then((resmenuInfo)=>{
        if (resmenuInfo.code == 0) {
        res.json({ success: true, info: resmenuInfo.info });
        console.log("res menuInfo  Select 성공 -", Date());
        }else if(resmenuInfo.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menuInfo 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenuInfo.msg });
        console.log("res  menuInfo Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menuInfo catch - menuInfo select 실패 :", error, " - ", Date());
    })

});
//=QS_009, QS_016 메뉴 등록
router.post('/Minsert', function (req, res) {
    let StoreId = req.body.StoreId;
    let LargeDivCd = req.body.LargeDivCd;
    let MidDivCd = req.body.MidDivCd;
    let MenuName = req.body.MenuName;
    let Price =  req.body.Price;
    let ImgUrl =  req.body.ImgUrl;
    let OptionA =  req.body.OptionA;
    let OptionB =  req.body.OptionB;
    let OptionC =  req.body.OptionC;
    let Best =  req.body.Best;
    let UseYn =  req.body.UseYn;
    var InsertDate = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('0000',StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,InsertDate);
    Minsert(StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Best,UseYn,InsertDate)
    .then((resMinsert)=>{
        if (resMinsert.code == 0) {
        res.json({ success: true, rows: resMinsert.rows });
        console.log("res Minsert  insert 성공 -", Date());
        }else if(resMinsert.code == 1){
        res.json({ success: false, msg: null});
        console.log("res Minsert 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resMinsert.msg });
        console.log("res  Minsert insert  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("Minsert catch - menulist Minsert 실패 :", error, " - ", Date());
    })
});
//QS_009, QS_016 메뉴 수정
//이름, 가격, 이미지, 옵션, 추천메뉴 설정해제, 메뉴숨김 설정/해제
router.post('/Mupdate', function (req, res) {
    let StoreId = req.body.StoreId;
    let MenuId = req.body.MenuId;
    let LargeDivCd = req.body.LargeDivCd;
    let MidDivCd = req.body.MidDivCd;
    let MenuName = req.body.MenuName;
    let Price =  req.body.Price;
    let ImgUrl =  req.body.ImgUrl;
    let OptionA =  req.body.OptionA;
    let OptionB =  req.body.OptionB;
    let OptionC =  req.body.OptionC;
    let Best =  req.body.Best;
    let UseYn =  req.body.UseYn;
    Mupdate(MenuName,Price,OptionA,OptionB,OptionC,Best,StoreId,MenuId)
    .then((resMupdate)=>{
        if (resMupdate.code == 0) {
        res.json({ success: true, rows: resMupdate.rows });
        console.log("res Mupdate  insert 성공 -", Date());
        }else if(resMupdate.code == 1){
        res.json({ success: false, msg: null});
        console.log("res Mupdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resMupdate.msg });
        console.log("res  Mupdate insert  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("Mupdate catch - menulist Mupdate 실패 :", error, " - ", Date());
    })
});
//QS_009, QS_016 메뉴 삭제
router.post('/Mdelete', function (req, res) {
    let StoreId = req.body.StoreId;
    let MenuId = req.body.MenuId;
    Mdelete(StoreId,MenuId)
    .then((resMdelete)=>{
        if (resMdelete.code == 0) {
        res.json({ success: true, rows: resMdelete.rows });
        console.log("res Mdelete  delete 성공 -", Date());
        }else {
        res.json({ success: false, msg: resMdelete.msg });
        console.log("res  Mdelete delete  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("Mdelete catch - Mdelete delete 실패 :", error, " - ", Date());
    })
});
module.exports = router;
// //quoka
// router.get('/', function (req, res, next) {
//      res.render('menu',{title : '메뉴 상세',QStoreId:'', QMenuId:'', LargeDivCd:'', MidDivCd:'', MenuName:'', Price:'',ImgUrl:'',Best:'',UseYn:'', InsertDate:'',Qseq:''});

// });
// //1. <메인> 메뉴조회 
// router.get('/Qmenu', function (req, res, next) {
//     var QStoreId = req.query.QStoreId;
//     var QMenuId = req.query.QMenuId;
//     conn.connection.query('SELECT QStoreId,QMenuId,LargeDivcd,MidDivCd,MenuName,Price,ImgUrl,Best,UseYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate FROM QMenu where QStoreId like '
//     + '"'+ QStoreId +'"'+' and QMenuId like '+'"'+QMenuId+'"', function (err, rows, fields) {
//         if (!err && rows.length >= 1) {
//             console.log(rows);
//             console.log(fields);
//             var result = 'rows : ' + JSON.stringify(rows) + '<br><br>' +
//                 'fields : ' + JSON.stringify(fields);
//             res.send(rows);
//         }else if(!err && rows.length == 0 ){
//             res.status(500);
//             res.send('Message : no data');
//         } else {
//             console.log('query error : ' + err);
//             res.send('qery error:' + err);
//         } 
//     }); 
//   });
// //2. <상세> 메뉴조회 
// router.get('/select', function (req, res) {
//     let QStoreId = req.query.QStoreId;
//     let QMenuId = req.query.QMenuId;
//     conn.connection.query('SELECT QStoreId,QMenuId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,Best,UseYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq FROM QMenu where QMenuId like '
//     + '"'+ QMenuId +'"'+' and QStoreId like '+'"'+QStoreId+'"' , function (err, rows, fields) {
//         // console.log(rows.length);
//         if (!err && rows.length >= 1) {
//             res.render('menu',{title : '메뉴 상세', QStoreId:rows[0].QStoreId, QMenuId:rows[0].QMenuId, LargeDivCd:rows[0].LargeDivCd, MidDivCd:rows[0].MidDivCd, MenuName:rows[0].MenuName, Price:rows[0].Price,ImgUrl:rows[0].ImgUrl,Best:rows[0].Best,UseYn:rows[0].UseYn, InsertDate:rows[0].InsertDate,Qseq:rows[0].Qseq});
//            // res.send(rows);
//         } else if(!err && rows.length == 0){
//             res.send('message : no data');
//         } else {
//             console.log('query error : ' + err);
//             res.send('message : ' + err);
//         }
//     });
// });
// //3. <상세> 메뉴 등록 
// router.get('/insert', function (req, res) {
//     let QStoreId = req.query.QStoreId;
//     let QMenuId = req.query.QMenuId;
//     let LargeDivCd = req.query.LargeDivCd;
//     let MidDivCd = req.query.MidDivCd;
//     let MenuName =  req.query.MenuName;
//     let Price =  req.query.Price;
//     let ImgUrl =  req.query.ImgUrl;
//     let Best =  req.query.Best;
//     let UseYn =  req.query.UseYn;
//     var insertDT = moment().format('YYYY-MM-DD HH:mm:ss');
//     //등록
//     var sql = 'INSERT INTO QMenu(QStoreId,QMenuId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,Best,UseYn,InsertDate) VALUES (?,?,?,?,?,?,?,?,?,?)';
//     var params =[QStoreId,QMenuId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,Best,UseYn,insertDT];
//     conn.connection.query(sql,params, function (err, rows, fields) {
//         if(err){console.log(err);}
//         console.log('등록');
//     }); 
//     //조회 처리
//     var selectSql = 'select QStoreId,QMenuId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,Best,UseYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq FROM QMenu '
//     +'where QStoreId like '+'"'+QStoreId+'"'+'and QMenuId like '+'"'+QMenuId+'"';
//     conn.connection.query(selectSql, function(err, rows, fieldes){
//         console.log('등록-> 조회');
//         if(err){console.log(err);} 
//         else{     
//             if(rows.length > 0){
//                 res.render('menu',{title : '메뉴 상세',  QStoreId:rows[0].QStoreId, QMenuId:rows[0].QMenuId, LargeDivCd:rows[0].LargeDivCd, MidDivCd:rows[0].MidDivCd, MenuName:rows[0].MenuName, Price:rows[0].Price, ImgUrl:rows[0].ImgUrl, Best:rows[0].Best, UseYn:rows[0].UseYn, InsertDate:rows[0].InsertDate, Qseq:rows[0].Qseq});
//             }else{
//                 res.render('menu',{title : '메뉴 상세',  QStoreId:'', QMenuId:'', LargeDivCd:'', MidDivCd:'', MenuName:'', Price:'', ImgUrl:'', Best:'', UseYn:'', InsertDate:'', Qseq:''});
//             }
//          } 
//       });
//     });

// //3. <상세> 메뉴 수정
// router.get('/update', function (req, res) {
//     let QStoreId = req.query.QStoreId;
//     let QMenuId = req.query.QMenuId;
//     let LargeDivCd = req.query.LargeDivCd;
//     let MidDivCd = req.query.MidDivCd;
//     let MenuName =  req.query.MenuName;
//     let Price =  req.query.Price;
//     let ImgUrl =  req.query.ImgUrl;
//     let Best =  req.query.Best;
//     let UseYn =  req.query.UseYn;
//     let Qseq =  req.query.Qseq;
//     //수정
//     var sql = 'UPDATE QMenu SET QStoreId = ?,QMenuId=?,LargeDivCd=?,MidDivCd=?,MenuName=?,Price=?,ImgUrl=?,Best=?,UseYn=? where Qseq=?';
//     var params =[QStoreId,QMenuId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,Best,UseYn,Qseq];
//     conn.connection.query(sql,params, function (err, rows, fields) {
//         if(err){console.log(err);}
//         console.log('수정');
//     });
//     //조회 처리
//     var selectSql = 'select QStoreId,QMenuId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,Best,UseYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq FROM QMenu '
//     +'where Qseq= '+ Qseq;
//     conn.connection.query(selectSql, function(err, rows, fieldes){
//         console.log('수정-> 조회');
//         if(err){console.log(err);} 
//         else{     
//             if(rows.length > 0){
//                 res.render('menu',{title : '메뉴 상세',  QStoreId:rows[0].QStoreId, QMenuId:rows[0].QMenuId, LargeDivCd:rows[0].LargeDivCd, MidDivCd:rows[0].MidDivCd, MenuName:rows[0].MenuName, Price:rows[0].Price, ImgUrl:rows[0].ImgUrl, Best:rows[0].Best, UseYn:rows[0].UseYn, InsertDate:rows[0].InsertDate, Qseq:rows[0].Qseq});
//             }else{
//                 res.render('menu',{title : '메뉴 상세',  QStoreId:'', QMenuId:'', LargeDivCd:'', MidDivCd:'', MenuName:'', Price:'', ImgUrl:'', Best:'', UseYn:'', InsertDate:'', Qseq:''});
//             }
//         } 
//         });
//     });
// //3. <상세> 메뉴 삭제
// router.get('/delete', function (req, res) {
//     let Qseq =  req.query.Qseq;
//      //삭제처리
//      var deleteSql = 'DELETE FROM QMenu WHERE Qseq =?';
//      var params = [Qseq];
//      conn.connection.query(deleteSql, params, function(err, rows, fieldes){
//          if(err){console.log(err);}
//      });
//          //조회 처리
//     var selectSql = 'select QStoreId,QMenuId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,Best,UseYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq FROM QMenu '
//     +'where Qseq= '+ Qseq;
//     conn.connection.query(selectSql, function(err, rows, fieldes){
//         console.log('수정-> 조회');
//         if(err){console.log(err);} 
//         else{     
//             if(rows.length > 0){
//                 res.render('menu',{title : '메뉴 상세',  QStoreId:rows[0].QStoreId, QMenuId:rows[0].QMenuId, LargeDivCd:rows[0].LargeDivCd, MidDivCd:rows[0].MidDivCd, MenuName:rows[0].MenuName, Price:rows[0].Price, ImgUrl:rows[0].ImgUrl, Best:rows[0].Best, UseYn:rows[0].UseYn, InsertDate:rows[0].InsertDate, Qseq:rows[0].Qseq});
//             }else{
//                 res.render('menu',{title : '메뉴 상세',  QStoreId:'', QMenuId:'', LargeDivCd:'', MidDivCd:'', MenuName:'', Price:'', ImgUrl:'', Best:'', UseYn:'', InsertDate:'', Qseq:''});
//             }
//         } 
//         });
// });

// // ==========json================================
// router.get('/AllMenu', function (req, res, next) {
//     console.log("AllMenu");
//     res.send(Jmenu);
// });

// router.get('/detail', function (req, res, next) {
//     console.log("detail");
//     let payuid = req.query.payUid;
//     console.log(payuid);
//     res.send(JUserPayDetail.UserPayDetail[payuid]);
// });
// router.get('/user', function (req, res, next) {
//     const email = req.query.email
//     res.json(JUser.User[email]);
// });
// router.get('/StoreInfo', function (req, res, next) {
//     console.log("StoreInfo");
//     res.send(JStoreInfo);
// });



