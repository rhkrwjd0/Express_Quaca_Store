var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const app = require('../../app');
var conn = require('../components/mariaDB');
var moment = require('moment');
var https = require('https');
var request = require('request');
const { title } = require('process');
const { Console } = require('console');
let serverurl = "https://tera-energy.github.io/Tera_Quaca_Common/server.json";
var { login,signup,forgetpassword,forgetSID,tokenupdate} = require('../function/signup');

//QS_001 매장아이디/패스워드로 로그인 기능
router.post('/login', function (req, res) {
    let SID = req.body.SID;
    let PassWord = req.body.PassWord;
    login(SID,PassWord)
        .then((reslogin)=>{
            if (reslogin.code == 0) {
            res.json({ success: true, info: reslogin.info });
            console.log("res login  Select 성공 -", Date());
            }else if(reslogin.code == 1){
            res.json({ success: false, msg: null});
            console.log("res login 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: reslogin.msg });
            console.log("res  login Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("login catch - login select 실패 :", error, " - ", Date());
        })
});
//QS_031 회원가입
router.post('/signup', function (req, res) {
    let SID = req.body.SID;
    let PassWord = req.body.PassWord;
    let Token = req.body.Token;
    let StoreId = req.body.StoreId;
    let TelNo = req.body.TelNo;
    let UseYn = req.body.UseYn;
    var d = new Date();
    let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    signup(SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt)
        .then((ressignup)=>{
            if (ressignup.code == 0) {
            res.json({ success: true, info: ressignup.info });
            console.log("res signup  Insert 성공 -", Date());
            }else {
            res.json({ success: false, msg: ressignup.msg });
            console.log("res  signup Insert  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("signup catch - signup Insert 실패 :", error, " - ", Date());
        })
});


//QS_032 비밀번호 찾기
router.post('/forgetpassword', function (req, res) {
    console.log('1');
    let SID = req.body.SID;
    let Token = req.body.Token;
    forgetpassword(SID,Token)
        .then((resforgetpassword)=>{
            if (resforgetpassword.code == 0) {
            res.json({ success: true, info: resforgetpassword.info });
            console.log("res forgetpassword  Select 성공 -", Date());
            }else if(resforgetpassword.code == 1){
            res.json({ success: false, msg: null});
            console.log("res forgetpassword 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resforgetpassword.msg });
            console.log("res  forgetpassword Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("forgetpassword catch - forgetpassword select 실패 :", error, " - ", Date());
        })
});

//QS_033 아이디 찾기
router.post('/forgetSID', function (req, res) {
    let Token = req.body.Token;
    forgetSID(Token)
    .then((resforgetSID)=>{
        if (resforgetSID.code == 0) {
        res.json({ success: true, info: resforgetSID.info });
        console.log("res forgetSID  Select 성공 -", Date());
        }else if(resforgetSID.code == 1){
        res.json({ success: false, msg: null});
        console.log("res forgetSID 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resforgetSID.msg });
        console.log("res  forgetSID Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("forgetSID catch - forgetSID select 실패 :", error, " - ", Date());
    })
});
//QS_027 사용자 토큰 수정
//사용자 아이디, 토큰 보내면 DB에서 사용자 토큰 수정
router.post('/tokenupdate', function (req, res) {
    let SID = req.body.SID;
    let Token = req.body.Token;
    tokenupdate(SID,Token)
        .then((restokenupdate)=>{
            if (restokenupdate.code == 0) {
            res.json({ success: true,info:restokenupdate.info });
            console.log("res tokenupdate  Insert 성공 -", Date());
            }else if(restokenupdate.code == 1){
            res.json({ success: false, msg: null});
            console.log("res tokenupdate 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: restokenupdate.msg });
            console.log("res  tokenupdate Insert  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("tokenupdate catch - tokenupdate Insert 실패 :", error, " - ", Date());
        })
});
module.exports = router;