// load the things we need
var express = require('express');  
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var firebase = require("firebase");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 
// app.set('port', (process.env.PORT || 3000));

var config = {
    		apiKey: "AIzaSyByKsrnp_Cpvf5A_HgireonTXolgCcwsKk",
    		authDomain: "bonjour-61159.firebaseapp.com",
    		databaseURL: "https://bonjour-61159.firebaseio.com",
    		storageBucket: "bonjour-61159.appspot.com",
    		messagingSenderId: "136270025924"
 };
firebase.initializeApp(config);
// 建立 DB
var database = firebase.database();
// database.ref('user/').push({
// 	id:"hobby",
// 	password:"qqqq",
// }).key;
database.ref('board/goosip/').update({
	boardid:"b",
	boardname:"八卦版",
});
database.ref('board/sport/').update({
	boardid:"b2",
	boardname:"運動版",
});
database.ref('board/news/').update({
	id:"b3",
	boardname:"新聞版"
});
database.ref('board/fashion/').update({
	id:"b4",
	boardname:"時尚版",
});
database.ref('board/music/').update({
	id:"b5",
	boardname:"音樂版",
});
database.ref('board/game/').update({
	id:"b6",
	boardname:"遊戲版",
});
database.ref('board/movie/').update({
	id:"b7",
	boardname:"電影版"
});
database.ref('board/trip/').update({
	id:"b8",
	boardname:"旅遊版",
});

app.get('/', function(req, res){
 	res.render('pages/index');
});
app.get('/chat', function(req, res){
 	res.render('pages/chat');
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

http.listen(process.env.PORT || 3000, function() {  
  console.log('Listening on port 3000');  
});