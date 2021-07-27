var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const app = require('../../app');
var moment = require('moment');
var conn = require('../components/mariaDB');
var https = require('https');
var request = require('request');
let serverurl = "https://tera-energy.github.io/Tera_Quaca_Common/server.json";
var {store,Supdate} = require('../function/store');
//QS_002 매장정보
router.post('/store', function (req, res) {
    let StoreId = req.body.StoreId;
    store(StoreId)
    .then((resstore)=>{
        if (resstore.code == 0) {
        res.json({ success: true, info: resstore.info });
        console.log("res store  Select 성공 -", Date());
        }else if(resstore.code == 1){
        res.json({ success: false, msg: null});
        console.log("res store 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstore.msg });
        console.log("res  store Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("store catch - store select 실패 :", error, " - ", Date());
    })
});


//QS_025, 매장정보 수정(통합)
router.post('/Supdate', function (req, res) {
    let StoreId = req.body.StoreId;
    let StoreName = req.body.StoreName;
    let OpenTime = req.body.OpenTime;
    let CloseTime = req.body.CloseTime;
    let DayOff = req.body.DayOff;
    let TelNo =  req.body.TelNo;
    let Addr1 =  req.body.Addr1;
    let Addr2 =  req.body.Addr2;
    let Lat =  req.body.Lat;
    let Lon =  req.body.Lon;
    let MainImgUrl =  req.body.MainImgUrl;

    Supdate(StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,MainImgUrl,StoreId)
    .then((resupdate)=>{
        if (resupdate.code == 0 && resupdate.lenth > 0) {
        res.json({ success: true, rows: resupdate.rows });
        console.log("res Supdate  update 성공 -", Date());
        }else if(resupdate.code == 0 && resupdate.lenth == 0 ){
        res.json({ success: false, msg: null});
        console.log("res Supdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resupdate.msg });
        console.log("res  Supdate update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("Supdate catch - Supdate update 실패 :", error, " - ", Date());
    })
});

module.exports = router;