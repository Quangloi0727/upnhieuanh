var express = require('express');
var router = express.Router();
var multer  = require('multer');
const mongoose = require('mongoose');
var uploadMode=require('../model/uploadsp.js');
mongoose.connect('mongodb://localhost:27017/sanpham', {useNewUrlParser: true});
var anhs=[];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Up load sản phẩm' });
});

/* post cho uploadfile. */
router.post('/uploadfile',upload.any(), function(req, res, next) {
  console.log(req.files[0].path);
  anhs.push(req.files[0].path);
  res.status(200).send(req.files);
});

/* Up sản phẩm. */
router.post('/upsanpham', function(req, res, next) {
  var tensp=req.body.tensp;
  var gia=req.body.gia;
  //khai báo 1 đối tượng để insert
  var motdoituong={
    "ten":tensp,
    'gia':gia,
    'anh':anhs
  }
  var dulieu=new uploadMode(motdoituong);
  dulieu.save();
  res.render('upsanpham', { title: 'Up thành công' });
});

/* Xem sản phẩm. */
router.get('/xemsp', function(req, res, next) {
  uploadMode.find({},function(err,dulieu){
    res.render('xemsp', { data: dulieu });
  })
  
});

module.exports = router;
