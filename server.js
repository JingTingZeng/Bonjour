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


/*****************FIREBASE*****************/
var firebase = require("firebase");
var config = {
   apiKey: "AIzaSyByKsrnp_Cpvf5A_HgireonTXolgCcwsKk",
   authDomain: "bonjour-61159.firebaseapp.com",
   databaseURL: "https://bonjour-61159.firebaseio.com",
   storageBucket: "bonjour-61159.appspot.com"
 };
 firebase.initializeApp(config);
 var database = firebase.database();



// var firebase = require("firebase");
// app.set('view engine', 'ejs');
// app.use(express.static(__dirname + '/public')); 
// app.set('port', (process.env.PORT || 3000));

// database.ref('user/').push({
// 	id:"hobby",
// 	password:"qqqq",
// }).key;


database.ref('board/goosip/').update({
	boardid:"b1",
	boardname:"八卦版"
});
database.ref('board/sport/').update({
	boardid:"b2",
	boardname:"運動版"
});
database.ref('board/news/').update({
	boardid:"b3",
	boardname:"新聞版"
});
database.ref('board/fashion/').update({
	boardid:"b4",
	boardname:"時尚版"
});
database.ref('board/music/').update({
	boardid:"b5",
	boardname:"音樂版"
});
database.ref('board/game/').update({
	boardid:"b6",
	boardname:"遊戲版"
});
database.ref('board/movie/').update({
	boardid:"b7",
	boardname:"電影版"
});
database.ref('board/trip/').update({
	boardid:"b8",
	boardname:"旅遊版"
});

app.get('/index', function(req, res){
 	res.render('pages/index');
});
app.get('/goosip', function(req, res){
 	res.render('pages/goosip');
});
app.get('/sport', function(req, res){
 	res.render('pages/sport');
});
app.get('/news', function(req, res){
 	res.render('pages/news');
});
app.get('/fashion', function(req, res){
 	res.render('pages/fashion');
});
app.get('/music', function(req, res){
 	res.render('pages/music');
});
app.get('/game', function(req, res){
 	res.render('pages/game');
});
app.get('/movie', function(req, res){
 	res.render('pages/movie');
});
app.get('/trip', function(req, res){
 	res.render('pages/trip');
});
app.get('/one', function(req, res){
 	res.render('pages/one');
});

// var user_count=0;

//當新的使用者進入聊天室
io.on('connection',function(socket){
	//新user
 	socket.on('add user',function(msg){
 		socket.username=msg;
 		console.log("new user:"+msg+"logged.");
 		io.emit('add user',{
 			username:socket.username
 		});
 	});
 	//監聽新訊息事件
 	socket.on('chat message',function(msg){
 		console.log(socket.username+":"+msg);
 		//發佈新訊息
 		io.emit('chat message',{
 			username:socket.username,
 			msg:msg
 		});
 	});
 	//離開聊天室
 	socket.on('disconnect',function(){
 		console.log(socket.username+"left.");
 		io.emit('user left',{
 			username:socket.username
 		});
 	});
});

app.get('/', function(req, res){
	var note = "";
 	res.render('pages/login',{
 		tagline_login: note
 	});
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
 	database.ref('/user/').orderByChild("id").equalTo(req.body.login_id).on('value',function(snapshot){
 		var data = JSON.stringify(snapshot.val());  //將陣列轉換成字串
 		var result1  = data.indexOf("\"id\":\""+req.body.login_id+"\"");   //將陣列與ID進行比對
 		var result2  = data.indexOf("\"password\":\""+req.body.login_pw+"\"");   //將陣列與ID進行比對
 		console.log(data);
 		console.log(result1);
 		console.log(result2);

 		if(result1 == -1 || result2 == -1){
			var note = "--ID或密碼輸入錯誤!--";
			res.render('pages/login', {
		        tagline_login: note
		    });
		}else{
		    res.render('pages/index');
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
 	database.ref('/user/').orderByChild("id").equalTo(req.body.id).on('value',function(snapshot){
 		var data = JSON.stringify(snapshot.val());  //將陣列轉換成字串
 		var result  = data.indexOf("\"id\":\""+req.body.id+"\"");   //將陣列與輸入值進行比對
 		console.log("\"id\":\""+req.body.id+"\"");
 		console.log(data);
 		console.log(result);

		if(result !== -1){
			console.log('ID已存在');
		    var note = "--此ID已存在--";
			res.render('pages/logon', {
		        tagline: note
		    });
		}else{
		    console.log('ID不存在');
		    res.render('pages/index');
			//將表單資料寫入資料庫
		 	firebase.database().ref('user/').push({
		        id: req.body.id,
		        password: req.body.pw,
		    }).key;
		    console.log('ID已新建');    
		}
	});
});

app.post('/logout', function(req, res){
	var note = "";
 	res.render('pages/login',{
 		tagline_login: note
 	});
});

http.listen(process.env.PORT || 3000, function() {  
  console.log('Listening on port 3000');  
});