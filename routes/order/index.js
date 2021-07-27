const { name } = require('ejs');
var express = require('express');
var router = express.Router();
const app = express();
var moment = require('moment');
var conn = require('../components/mariaDB');
var { RCorderlist,allorderlist,orderlistDetail,OCorderlist,OCRCchange,OCrollback,RCPCchange,RCrollback,PCPUCchange,PCrollback} = require('../function/order');

//QS_017 제조완료 전 주문목록
router.post('/RCorderlist', function (req, res) {
    let StoreId = req.body.StoreId;
    RCorderlist(StoreId)
        .then((resRCorderlist)=>{
            if (resRCorderlist.code == 0) {
            res.json({ success: true, info: resRCorderlist.info });
            console.log("res RCorderlist  Select 성공 -", Date());
            }else if(resRCorderlist.code == 1){
            res.json({ success: false, msg: null});
            console.log("res RCorderlist 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resRCorderlist.msg });
            console.log("res  RCorderlist Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("RCorderlist catch - RCorderlist select 실패 :", error, " - ", Date());
        })
});

//QS_018 총 주문목록
router.post('/allorderlist', function (req, res) {
    let StoreId = req.body.StoreId;
    allorderlist(StoreId)
    .then((resallorderlist)=>{
        if ((resallorderlist.code == 0) && (resallorderlist.rows > 0)) {
        res.json({ success: true, info: resallorderlist.info });
        console.log("res allorderlist  Select 성공 -", Date());
        }else if((resallorderlist.code == 0) && (resallorderlist.rows == 0)){
        res.json({ success: false, msg: null});
        console.log("res allorderlist 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resallorderlist.msg });
        console.log("res  allorderlist Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("allorderlist catch - allorderlist select 실패 :", error, " - ", Date());
    })
});

//QS_019 주문상세
router.post('/orderlistDetail', function (req, res) {
    let UserPayid = req.body.UserPayid;
    orderlistDetail(UserPayid)
    .then((resorderlistDetail)=>{
        if (resorderlistDetail.code == 0) {
        res.json({ success: true, info: resorderlistDetail.info });
        console.log("res orderlistDetail  Select 성공 -", Date());
        }else if(resorderlistDetail.code == 1){
        res.json({ success: false, msg: resorderlistDetail.msg});
        console.log("res orderlistDetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resorderlistDetail.msg });
        console.log("res  orderlistDetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("orderlistDetail catch - orderlistDetail select 실패 :", error, " - ", Date());
    })
});
//QS_021 접수전 주문목록 (OC만 나옴)
router.post('/OCorderlist', function (req, res) {
  let StoreId = req.body.StoreId;
  OCorderlist(StoreId)
  .then((resOCorderlist)=>{
      if (resOCorderlist.code == 0) {
      res.json({ success: true, info: resOCorderlist.info });
      console.log("res OCorderlist  Select 성공 -", Date());
      }else if(resOCorderlist.code == 1){
      res.json({ success: false, msg: resOCorderlist.msg});
      console.log("res OCorderlist 데이터 값 없음 -", Date());
      } else {
      res.json({ success: false, msg: resOCorderlist.msg });
      console.log("res  OCorderlist Select  실패 -", Date());
      }
  })
  .catch((error) => {
      res.json({ code: 999, msg: "error" });
      console.log("OCorderlist catch - OCorderlist select 실패 :", error, " - ", Date());
  })
  // let StoreId = req.body.StoreId;
  // var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, c.MenuName AS MenuName,c.OrderCnt AS OrderCnt, a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus ="OC" and a.StoreId = '
  // +'"'+StoreId+'"'
  // +'GROUP BY UserPayId';
  // console.log(StoreId);

  // //1. 선언
  // // pay Info
  // var payData = new Object();
  // var payDataTemp = new Object();
  // var arrPayData = new Array();
  // // pay Detail Info
  // var payDetailData = new Object();
  // var payDetailDataTmp = new Object();
  // var arrPayDetailData = new Array();
  // conn.connection.query(selectSql, function (err, rows, fields) {
  //     if (!err && rows.length > 0) {
  //         for(var i = 0; i < rows.length; i++){

  //             console.log(rows[i].UserPayId)
  //             // 데이터 입력 처리 
  //             payDataTemp = new Object();
              
  //             payDataTemp.UserPayId = rows[i].UserPayId;
  //             payDataTemp.UserPayDid = rows[i].UserPayDid;
  //             payDataTemp.InsertDT = rows[i].InsertDT;
  //             payDataTemp.NickName = rows[i].NickName;
             

  //             // 디테일 정보 조회 
  //             var detailSql = 'SELECT UserPayDid, UserPayId, StoreId, PayMethod, OrderCnt, MenuId, MenuName, Price, OptionA, OptionB, OptionC, OrderStatus FROM UserPayDetail'
  //             +' WHERE UserPayId = '+'"'+rows[i].UserPayId+'"'; 
  //             console.log(detailSql);
  //             conn.connection.query(detailSql, function (errSub, rowsSub, fieldsSub) {  
  //                 payDetailData = new Object();
  //                 arrPayDetailData = new Array();
  //                 for(var b = 0; b < rowsSub.length; b++){
  //                     payDetailDataTmp = new Object();
  //                     payDetailDataTmp.MenuName = rowsSub[b].MenuName;
  //                     arrPayDetailData.push(payDetailDataTmp);
  //                 }
  //                 payDataTemp.Menus = arrPayDetailData;
  //                 console.log(payDataTemp.Menus);
  //             });
  //             console.log("!@");
  //             //console.log(payDataTemp.Menus)
  //             arrPayData.push(payDataTemp);
  //             payData = arrPayData;
              
              
  //         }

               


  //         res.json({ success: true, info: payData });
  //     } else if (!err && rows.length == 0) {
  //         res.json({ success: false, msg: err });
  //     } else {
  //         res.json({ success: false, msg: err });
  //     }
  // });
  
});
//QS_022 주문접수OC->RC
router.post('/OCRCchange', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    OCRCchange(StoreId,UserPayId)
    .then((resOCRCchange)=>{
        if (resOCRCchange.code == 0) {
        res.json({ success: true, info: resOCRCchange.info });
        console.log("res OCRCchange  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resOCRCchange.msg });
        console.log("res  OCRCchange Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("OCRCchange catch - OCRCchange select 실패 :", error, " - ", Date());
    })
});
//QS_022_1 주문접수 RC->OC rollback
router.post('/OCrollback', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    //수정
    OCrollback(StoreId,UserPayId)
    .then((resOCrollback)=>{
        if (resOCrollback.code == 0) {
        res.json({ success: true, info: resOCrollback.info });
        console.log("res OCrollback  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resOCrollback.msg });
        console.log("res  OCrollback Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("OCrollback catch - OCrollback Update 실패 :", error, " - ", Date());
    })
});
//QS_023 주문접수RC->PC
router.post('/RCPCchange', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    var d = new Date();
    let MenuCompleteTime = moment(d).format('YYYY-MM-DD HH:mm:ss');
    RCPCchange(StoreId,UserPayId,MenuCompleteTime)
    .then((resRCPCchange)=>{
        if (resRCPCchange.code == 0) {
        res.json({ success: true, info: resRCPCchange.info });
        console.log("res RCPCchange  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resRCPCchange.msg });
        console.log("res  RCPCchange Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("RCPCchange catch - RCPCchange select 실패 :", error, " - ", Date());
    })
});
//QS_023_1 주문접수PC->RC rollback
router.post('/RCrollback', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    let MenuCompleteTime = (null);
    //수정
    RCrollback(StoreId,UserPayId,MenuCompleteTime)
    .then((resRCrollback)=>{
        if (resRCrollback.code == 0) {
        res.json({ success: true, info: resRCrollback.info });
        console.log("res RCrollback  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resRCrollback.msg });
        console.log("res  RCrollback Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("RCrollback catch - RCrollback Update 실패 :", error, " - ", Date());
    })
});
//QS_024 픽업완료PC->PUC
router.post('/PCPUCchange', function (req, res) {
    console.log("1");
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    PCPUCchange(StoreId,UserPayId)
    .then((resPCPUCchange)=>{
        if (resPCPUCchange.code == 0) {
        res.json({ success: true, info: resPCPUCchange.info });
        console.log("res PCPUCchange  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resPCPUCchange.msg });
        console.log("res  PCPUCchange Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("PCPUCchange catch - PCPUCchange select 실패 :", error, " - ", Date());
    })
});
//QS_024_1 주문접수PUC->PC rollback
router.post('/PCrollback', function (req, res) {
    console.log("2");
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    //수정
    PCrollback(StoreId,UserPayId)
    .then((resPCrollback)=>{
        if (resPCrollback.code == 0) {
        res.json({ success: true, info: resPCrollback.info });
        console.log("res PCrollback  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resPCrollback.msg });
        console.log("res  PCrollback Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("PCrollback catch - PCrollback Update 실패 :", error, " - ", Date());
    })
});

module.exports = router;
// //1. 현재주문조회(관리자)
// router.get('/QOrder', function (req, res, next) {
//   conn.connection.query('SELECT StoreQId, OrderNum, PayUid,PayMethod,orderCnt,QName,Price,OptionA,OptionB,OptionC,OrderStatus,date_format(PayCompleteTime, "%Y-%m-%d %H:%i") AS PayCompleteTime,date_format(MenuCompleteTime, "%Y-%m-%d %H:%i") AS MenuCompleteTime,TotalPrice FROM QUserPayDetail', function (err, rows, fields) {
//     console.log("조회");

//     res.render('orders',{title : '현재 주문',menu1:rows[0].QName,menu2:rows[1].QName,menu3:rows[2].QName, price1:rows[0].Price, price2:rows[1].Price,price3:rows[2].Price,TotalPrice:rows[0].TotalPrice,PayCompleteTime:'',userarrivetime:'2021-02-10 14:10:00' });
//   });
// });

// //2. 메뉴준비완료 update (관리자)
// router.get('/menuComplete', function (req, res, next) {
//    var PayCompleteTime = moment().format('YYYY-MM-DD HH:mm:ss');
//    var sql = 'UPDATE QUserPayDetail SET  PayCompleteTime = ?, MenuCompleteTime = ?' ;
//    var params =[PayCompleteTime,PayCompleteTime];
//    conn.connection.query(sql,params, function (err, rows, fields) {
//      if(err){console.log(err);}
//      console.log('수정');
//   }); 

//   //수정 후 재 조회
//   conn.connection.query('SELECT StoreQId, OrderNum, PayUid,PayMethod,orderCnt,QName,Price,OptionA,OptionB,OptionC,OrderStatus,date_format(PayCompleteTime, "%Y-%m-%d %H:%i") AS PayCompleteTime,date_format(MenuCompleteTime, "%Y-%m-%d %H:%i") AS MenuCompleteTime,TotalPrice FROM QUserPayDetail', function (err, rows, fields) {
//     console.log("수정->조회");
//     res.render('orders',{title : '현재 주문',menu1:rows[0].QName,menu2:rows[1].QName,menu3:rows[2].QName, price1:rows[0].Price, price2:rows[1].Price,price3:rows[2].Price,TotalPrice:rows[0].TotalPrice,PayCompleteTime:rows[0].MenuCompleteTime,userarrivetime:'2021-02-10 14:10:00' });
//   });
// });



// router.get('/QUserPay', function (req, res, next) {
//   var email = req.query.email;
//   conn. connection.query('SELECT Email,PayUid,orderCnt,orderNum,Qname AS FirstMenuName, OrderSTatus,date_format(PayCompleteTime, "%Y-%m-%d %H:%i") AS PayCompleteTime,date_format(MenuCompleteTime, "%Y-%m-%d %H:%i") AS MenuCompleteTime,TotalPrice FROM QUserPayDetail where UId = (SELECT min(UId) FROM QUserPayDetail) AND Email LIKE'
//   + '"'+ email +'"', function (err, rows, fields) {
//       if (!err && rows.length >= 1) {
//           var result = 'rows : ' + JSON.stringify(rows) + '<br><br>' +
//               'fields : ' + JSON.stringify(fields);
//           res.send(rows);
//       } else if(!err && rows.length == 0){
//         res.send('message : no data')
//       }else {
//           console.log('query error : ' + err);
//           res.send('message : '+err);
//       } 
//   }); 
// });
 
// router.get('/QUserPayDetail', function (req, res, next) {
//   var email = req.query.email;
//   var PayUid = req.query.PayUid;
//   conn.connection.query('SELECT StoreQId, OrderNum, PayUid,PayMethod,orderCnt,QName,Price,OptionA,OptionB,OptionC,OrderStatus,date_format(PayCompleteTime, "%Y-%m-%d %H:%i") AS PayCompleteTime,date_format(MenuCompleteTime, "%Y-%m-%d %H:%i") AS MenuCompleteTime,TotalPrice FROM QUserPayDetail where Email like'+ '"'+ email+'" and PayUid like'+'"'+PayUid+'"', function (err, rows, fields) {
//       if (!err && rows.length >= 1) {
//         var memberData = new Object();
//         memberData.StoreQId = rows[0].StoreQId;
//         memberData.OrderNum = rows[0].OrderNum;
//         memberData.PayUid = rows[0].PayUid;
//         memberData.PayMethod = rows[0].PayMethod;
//         memberData.orderCnt = rows[0].orderCnt;

//         var pointHistoryItem1 = new Object();
//         pointHistoryItem1.Qname = rows[0].QName;
//         pointHistoryItem1.Price = rows[0].Price;
//         pointHistoryItem1.OptionA = rows[0].OptionA;
//         pointHistoryItem1.OptionB = rows[0].OptionB;
//         pointHistoryItem1.OptionC = rows[0].OptionC;

//         var pointHistoryItem2 = new Object();
//         pointHistoryItem2.Qname = rows[1].QName;
//         pointHistoryItem2.Price = rows[1].Price;
//         pointHistoryItem2.OptionA = rows[1].OptionA;
//         pointHistoryItem2.OptionB = rows[1].OptionB;
//         pointHistoryItem2.OptionC = rows[1].OptionC;

//         var pointHistoryItem3 = new Object();
//         pointHistoryItem3.Qname = rows[2].QName;
//         pointHistoryItem3.Price = rows[2].Price;
//         pointHistoryItem3.OptionA = rows[2].OptionA;
//         pointHistoryItem3.OptionB = rows[2].OptionB;
//         pointHistoryItem3.OptionC = rows[2].OptionC;

//         var arrPointHistory = new Array();
//         arrPointHistory.push(pointHistoryItem1);
//         arrPointHistory.push(pointHistoryItem2);
//         arrPointHistory.push(pointHistoryItem3);

//         memberData.OrderMenu = arrPointHistory; 

//         memberData.OrderStatus = rows[0].OrderStatus;
//         memberData.PayCompleteTime = rows[0].PayCompleteTime;
//         memberData.MenuCompleteTime = rows[0].MenuCompleteTime;
//         memberData.TotalPrice = rows[0].TotalPrice;

//         res.send(memberData);
//       } else if(!err && rows.length == 0){
//         res.send('message : no data')
//       }else {
//           console.log('query error : ' + err);
//           res.send('message : '+err);
//       } 
//   }); 
// });

