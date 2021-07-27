var express = require('express');
var router = express.Router();
var moment = require('moment');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var url = require('../components/mongodb').url;
var conn = require('../components/mariaDB');
var {inotice,unotice,dnotice} = require('../function/notice');


//QS_028 공지사항 등록
router.post('/inotice', function (req, res) {
    let StoreId = req.body.StoreId;
    let StartDate = req.body.StartDate;
    let EndDate = req.body.EndDate;
    let Title = req.body.Title;
    let DisCription = req.body.DisCription;
    inotice(StoreId,StartDate,EndDate,Title,DisCription)
        .then((resinotice)=>{
            if (resinotice.code == 0) {
            res.json({ success: true, info: Title });
            console.log("res inotice  Insert 성공 -", Date());
            }else {
            res.json({ success: false, msg: resinotice.msg });
            console.log("res  inotice Insert  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("inotice catch - inotice Insert 실패 :", error, " - ", Date());
        })
});

//QS_029 공지사항 수정
router.post('/unotice', function (req, res) {
    let StoreId = req.body.StoreId;
    let StartDate = req.body.StartDate;
    let EndDate = req.body.EndDate;
    let Title = req.body.Title;
    let DisCription = req.body.DisCription;
    unotice(StartDate,EndDate,Title,DisCription,StoreId)
        .then((resunotice)=>{
            if (resunotice.code == 0) {
            res.json({ success: true});
            console.log("res unotice  update 성공 -", Date());
            }else {
            res.json({ success: false, msg: resunotice.msg });
            console.log("res  unotice update  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("unotice catch - unotice update 실패 :", error, " - ", Date());
        })
});
//QS_030공지사항 삭제
router.post('/dnotice', function (req, res) {
    let StoreId = req.body.StoreId;
    dnotice(StoreId)
    .then((resdnotice)=>{
        if (resdnotice.code == 0) {
        res.json({ success: true});
        console.log("res dnotice  delete 성공 -", Date());
        }else {
        res.json({ success: false, msg: resdnotice.msg });
        console.log("res  dnotice delete  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("dnotice catch - dnotice delete 실패 :", error, " - ", Date());
    })
});









// router.get('/', function (req, res, next) {
//     console.log("111111111111111");
//     res.render('mongo',{UserName:' ',MenuName:' ' ,Count:' ', Price:' ', date: ' ', UserId:' '});
// });

// router.get('/order', function (req, res) {
//     console.log(url);
//     let UserName = req.query.UserName;
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         //assert.equal(null, err);
//         console.log("Connected successfully to server");
//         db = client.db('notice');
//         console.log(UserName);
//         db.collection('notice').find().toArray(function(err,doc){
//             if(err) return res.status(500).json({error: err});
//             if(!doc) return res.status(404).json({error: 'UserName not found'});
//             res.json(doc); 
//             console.log("데이터 조회 !");
//             client.close();
//             });
//     });
// });


// router.get('/search', function (req, res) {
//     console.log('~~~~~~~~~~~~~~~~~~~');
//     let UserId = req.query.UserId;
//     console.log(UserId);
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         console.log("Connected successfully to server");   
//         var db = client.db('notice');
//         var id = mongoose.Types.ObjectId(UserId);
//         var myquery = {_id : id};
//         console.log(myquery);
//         db.collection('notice').findOne(myquery,function(err,doc){
//         var data = JSON.stringify(doc);
//         if(err) return res.status(500).json({error: err});
//         if(!doc) return res.status(404).json({error: 'UserId not found'});
//         res.render('mongo',{UserName:doc.UserName, MenuName:doc.MenuName, Count:doc.count, Price:doc.Price, date:doc.date, UserId:doc._id });
//         console.log("데이터 조회 !");
//     });
// });
// });

// router.get('/insert', function (req, res) {
//     let UserName = req.query.UserName;
//     let MenuName = req.query.MenuName;
//     let Count = req.query.Count;
//     let Price = req.query.Price;
//     var date = moment().format('YYYY-MM-DD HH:mm:ss');
//     console.log(UserName,MenuName,Count, Price,date );
//     console.log(url);
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         console.log("Connected successfully to server");
//         var db = client.db('notice');
//         db.collection('notice')
//         .insertOne({
//             "UserName" : UserName,
//             "MenuName" : MenuName,
//             "count" : Count,
//             "Price" : Price,
//             "date" : date
//         });
//         console.log("데이터 추가 !");
//     });
// });

// router.get('/update', function (req, res) {
//     var UserId = req.query.UserId;
//     let UserName = req.query.UserName;
//     let MenuName = req.query.MenuName;
//     let Count = req.query.Count;
//     let Price = req.query.Price;
//     var date = moment().format('YYYY-MM-DD HH:mm:ss');
//     console.log(UserId,UserName,MenuName,Count, Price,date );
    
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         console.log("Connected successfully to server");
//         if (err) throw err;
//         var db = client.db('notice');
//         var id = mongoose.Types.ObjectId(UserId);
//         var myquery = {_id : id};
//         var newvalues = { $set: {UserId:UserId, UserName:UserName,MenuName:MenuName, count:Count, Price:Price, date:date} };
//         db.collection('notice').updateOne(myquery, newvalues, function(err,res){
//             if (err) throw err;
//             console.log("1 document updated");
//             client.close();
//         });
//     }); 
// });

// router.get('/delete', function (req, res) {
//     var UserId = req.query.UserId;

//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         console.log("Connected successfully to server");
//         if (err) throw err;
//         var db = client.db('notice');
//         var id = mongoose.Types.ObjectId(UserId);
//         var myquery = {_id : id};
//         db.collection('notice').deleteOne(myquery, function(err,res){
//             if (err) throw err;
//             console.log("1 document delete");
//             client.close();
//         });
//     }); 
// });
// router.get('/home', function (req, res) {
//     res.render('index',{title:"User",hUrl:' ', Url:' ' });
// });
module.exports = router;
