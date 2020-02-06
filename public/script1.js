// var socket = io.connect('http://192.168.141.90:3000/chat');

var q;

var input = document.querySelector('#inp input');
var select = document.querySelector('#inp select');
var a = document.querySelector('a');
var button = document.querySelector('button');

button.addEventListener('click',function(e){
  socket.emit('checkme' , {name:input.value});
  socket.on('ans',function(data){
    if(data.result === false){
      input.value = "invalid Name";
      input.style.color="red";
      button.style.background="red";
    }
    else{
      socket.emit('add',{name:input.value , room:select.value});
      var q='/chatter?name='+input.value+"&room="+select.value;
      a.setAttribute('href',q);
      input.style.color="green";
      a.style.display="inline";
      button.style.display="none";
    }
  });
});

// input.addEventListener('keyup',funtion(){
//   var txt = input.value;
//   socket.emit('unique',{
//     name:txt
//   });
//   socket.on('ans',function(data){
//     if(data.value==true){
//       button.style.background='green';
//       button.href="/chatter";
//     }
//     else{
//       button.styel.background='red';
//       button.href="/chatter";
//     }
//   })
// });
