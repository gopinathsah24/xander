var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    cookieParser   = require("cookie-parser"),
    LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    Movie          = require("./models/movie"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    session        = require("express-session"),
    methodOverride = require("method-override"),
    commentRoutes  = require("./routes/comments"),
    movieRoutes    = require("./routes/movies"),
    loginAndSignupRoutes    = require("./routes/loginAndSignup");


console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL ||"mongodb://localhost/startup" ;
mongoose.connect(url);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));


app.use(require("express-session")({
    secret: "Movies Review Web App",
    resave: false,
    saveUninitialized: false
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", loginAndSignupRoutes);
app.use("/movies", movieRoutes);
app.use("/comment", commentRoutes);


var socket = require('socket.io');
var chatHistory = require('./models/chatHistory');


var arr = ['shreshth',''];
var ips = [1,2];
var rooms =[0,0];

var server = app.listen(process.env.PORT,function(){
	console.log('we are live at 3000');
	console.log("The Cineries Server Has Started!");
});

app.get('/chat',function(req,res){
	res.sendFile(__dirname+'/index.html');
});
app.get('/chatter',function(req,res){
	if(arr.indexOf(req.query.name) === -1)
	{
		res.send('you seem lost my friend');
	}
	else{
		var info = {
			room:req.query.room,
			data:req.query
		}
		chatHistory.find({room:req.query.room}).then(function(data){
			console.log(data);
			info.data = data;
			res.render('chatter' , info);
		});
	}
});

// connecting to '/'

var io = socket(server);
var io1 = io.of('/chat');
io1.on('connection',function(socket){

	console.log('we have a new guest',socket.id);

	socket.on('checkme',function(data){
		console.log('someone asked for check up')

		if(arr.indexOf(data.name) === -1){
				console.log('we send its unique')
				socket.emit('ans',{result:true});
		}
		else{
			console.log('we send its taken')
			socket.emit('ans',{result:false});
		}
	});
	var rm;
	socket.on('add',function(data){
		console.log('we added this user: '+data.name)
		arr.push(data.name);
		var address = socket.handshake.address;
		console.log(address);
		ips.push(address);
		rooms.push(data.room);
		rm=data.room;
		console.log(arr.length);
	});
});

//lets deal the connection from '/chatter'
var count = 0;
var chat = io.of('/chatter');
chat.on('connection',function(socket){
	var address = socket.handshake.address;
	var i = ips.indexOf(address);
	var name , room;
	if(i !== -1){
		name = arr[i];
		room = rooms[i];
	}
	else{
		name = address.address;
	}
	socket.join(room);
	socket.on('message',function(data){
		chat.to(room).emit('add',{name:name,info:data.info});
		var newChat = {room:room,handler:name,text:data.info,index:count++}
		chatHistory.create(newChat, function(err, newlyCreated){
			if(err){
					console.log(err);
			}
  	});
	})
	socket.on('typing',function(){
		console.log(name+' is typing...');
		socket.broadcast.emit('typer',{name:name});
	});
	socket.on('delete',function(){
		socket.broadcast.to(room).emit('deleter',{name:name});
		console.log(name+" is done writing");
	})

	//removing the user when we disconnect
	socket.on('disconnect', function(){
		ips.slice(i,1);
		arr.slice(i,1);
		console.log('user disconnected',socket.id);
	});
})
