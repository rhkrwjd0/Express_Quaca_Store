var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var https = require('https');
var request = require('request');
const { title } = require('process');
let serverurl = "https://tera-energy.github.io/Tera_Quaca_Common/server.json";

router.get('/', function (req, res, next) {
  request({
    url: serverurl,
  }, function (err, ress, html) {
    if (err) {
      console.log(err);
      return;
    }
    const noticeJson = JSON.parse(html);
    var Url = noticeJson.store.serverUrl;
    var hUrl = req.protocol + '://' + req.get('host');
    res.render('index', { title: '관리자용 페이지', Url: Url,hUrl:hUrl
    ,StoreId:'',StoreName:'',OpenTime:'',CloseTime:'',DayOff:'',TelNo:'',Addr1:'',Addr2:'',Lat:'',Lon:'',SigunguCode:'',MainImgUrl:'',DetailImgUrl:'',SUseYn:'',InsertDT:''
    ,MenuId:'',LargeDivCd:'',MidDivCd:'',MenuName:'',Price:'',ImgUrl:'',OptionA:'',OptionB:'',OptionC:'',Best:'',MUseYn:'',InsertDate:''});
    console.log("서버url :" ,Url);
    console.log("현재url :" ,hUrl);
  });
});


module.exports = router;





