var express = require('express');
var async = require('async');
var crypto = require('crypto');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));


function hash(x){
  var shasum = crypto.createHash('sha512');
  shasum.update(x);
  return shasum.digest('hex');
}
peers=[];
vals={test:{hash:hash("testing"),val:"testing"}}
app.get('/', function(req, res) {
  res.render('index.html');
});
io.on('connection', function(socket){
  socket.on('put peer id', function(msg){
    if(!peers[msg.peerID]){
      peers.push(socket);
      socket.peerID=msg.peerID
      socket.open=true;
      socket.keys=[];
    }
    else{
      socket.emit('peer id already in use');
    }
  });
  socket.on('get value', function(msg){
    async.detect(peers, function(peer,c){c(peer.keys.indexOf(msg.key)>-1 & peer.open);}, function(peer){
      if(peer){
        peer.open=false;
      socket.emit('put key holder',{peerID:peer.peerID,key:msg.key,hash:vals[msg.key].hash});}
      else{
        async.forEach(peers,function(peer){peer.open=true;});
        console.log('putting');
        socket.emit('put data',{key:msg.key,val:vals[msg.key].val});
      }
      socket.keys.push(msg.key);
    });
  });
  socket.on('disconnect', function(){
    delete peers[socket.peerId];
  });

});

app.post('/subscribe', function(req, res) {//make it so it only does the checking when no @ in it or something
  var shasum = crypto.createHash('sha512');
  shasum.update(req.body.email);
  if(shasum.digest('hex')===passwordHash){
    res.send(emails);//will only work if on one dynamo

  }else{
  emails.push(req.body.email.replace(/\,/g,""));
  res.redirect('/');}//only problem is no notification comes up
});
