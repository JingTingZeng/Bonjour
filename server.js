// node 預設模組
var path = require('path');

// NPM 模組
var app = require('express')();
var partials = require('express-partials');
var static = require('serve-static');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// router設定
 // var page = require('./routes/page');

// parse application/x-www-form-urlencoded 
// 讓回傳的值可以解析 json與 urlencoded
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true}));

// 版型設定
app.use(partials());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));

//設定預設指定目錄
app.use( static( path.join( __dirname, 'public' )));

// load the things we need

var http = require('http').Server(app);

/*****************FIREBASE*****************/
var firebase = require("firebase");
var config = {
   	apiKey: "AIzaSyByKsrnp_Cpvf5A_HgireonTXolgCcwsKk",
    authDomain: "bonjour-61159.firebaseapp.com",
  	databaseURL: "https://bonjour-61159.firebaseio.com",
    storageBucket: "bonjour-61159.appspot.com",
    messagingSenderId: "136270025924"
 };
 firebase.initializeApp(config);
 var database = firebase.database();


app.get('/', function(req, res){
 	res.render('pages/index1');
});

// var user_count=0;

//當新的使用者進入聊天室
// io.on('connection',function(socket){
// 	//新user
//  	socket.on('add user',function(msg){
//  		socket.username=msg;
//  		console.log("new user:"+msg+"logged.");
//  		io.emit('add user',{
//  			username:socket.username
//  		});
//  	});
//  	//監聽新訊息事件
//  	socket.on('chat message',function(msg){
//  		console.log(socket.username+":"+msg);
//  		//發佈新訊息
//  		io.emit('chat message',{
//  			username:socket.username,
//  			msg:msg
//  		});
//  	});
//  	//離開聊天室
//  	socket.on('disconnect',function(){
//  		console.log(socket.username+"left.");
//  		io.emit('user left',{
//  			username:socket.username
//  		});
//  	});
// });

app.get('/', function(req, res){
 	res.render('pages/index1');
});

//login page
 app.get('/login', function(req, res){
 	var note = "";
 	res.render('pages/login',{
 		tagline_login: note
 	});
 });

//取得登入表單資料
app.post('/loginform', function(req, res){
	console.log(req.body.login_id);
 	console.log(req.body.login_pw);
 	firebase.database().ref().child('/user').orderByChild('id').equalTo(req.body.login_id).on('value',function(snapshot){
 		var data = snapshot.val();
		console.log(snapshot.val());

 		if(snapshot.val() == null){
			var note = "--ID或密碼輸入錯誤!--";
			res.render('pages/login', {
		        tagline_login: note
		    });
		}else{
		    res.render('pages/index1');
		}
	});
});

//logon page
 app.get('/logon', function(req, res){ 	
 	var note = "";
 	res.render('pages/logon',{
 		tagline: note
 	});
 });

//取得註冊表單資料
app.post('/logonform', function(req, res){
	console.log(req.body.id);
 	console.log(req.body.pw);
 	firebase.database().ref().child('/user').orderByChild('id').equalTo(req.body.id).on('value',function(snapshot){
 		var data = snapshot.val();
		console.log(snapshot.val());

		if(snapshot.val() == null){
			//將表單資料寫入資料庫
		 	var key = firebase.database().ref('user/').push({
		        id: req.body.id,
		        password: req.body.pw,
		    }).key;
		    res.render('pages/index1');
		}else{
		    
		    var note = "--此ID已存在--";
			res.render('pages/logon', {
		        tagline: note
		    });

		}
	});
});


http.listen(process.env.PORT || 3000, function() {  
  console.log('Listening on port 3000');  
});