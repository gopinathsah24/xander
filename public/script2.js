var message = document.querySelector('#messages');
var typer = document.querySelector('#typer');
var input = document.querySelector('input');
var button = document.querySelector('button');

var socket = io.connect('http://192.168.141.90:3000/chatter');

button.addEventListener('click',function(e){
  socket.emit('message',{info:input.value});
  input.value=" ";
  socket.emit('delete'); //for deleting the typing message
});

input.addEventListener('click',function(e){
  socket.emit('typing');
});

input.addEventListener('keypress',function(e){
  console.log(e.code+"\n");
  if(e.code == 'Enter'){
    socket.emit('message',{info:input.value});
    input.value=" ";
    socket.emit('delete'); //for deleting the typing message
  }
})

socket.on('add',function(data){
  var name = data.name;
  var info = data.info;
  var span1 = document.createElement('span');
  var span2 = document.createElement('span');
  span1.setAttribute('class','handler');
  span2.setAttribute('class','text');
  message.appendChild(span1);
  message.appendChild(span2);
  span1.innerHTML = name + ":";
  span2.innerHTML = info ;
  message.innerHTML += '<br>';
})

socket.on('typer',function(data){
  var name = data.name;
  var span1 = document.createElement('span');
  span1.innerHTML = '<i>'+name+' is typing...</i>';
  span1.setAttribute('class','type');
  span1.setAttribute('id',name);
  var t = document.getElementById('typer');
  t.appendChild(span1);
})

socket.on('deleter',function(data){
  var t = document.getElementById('typer');
  var del = document.getElementById(data.name);
  t.removeChild(del);
});
