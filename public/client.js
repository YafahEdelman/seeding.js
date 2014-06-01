var peerID=Math.random().toString(36).substring(7);


var peer = new Peer(peerID, {key: 'myapikey'}); //needs changing
function hash(x){
  return jsSHA(x, "TEXT").getHash("SHA-512", "HEX");
}

function getItem(key,callback){
  var socket = io();
  socket.emit("put peer id",{peerID:peerID});//needs to be another place or something
  socket.on('put key holder', function (msg) {
      var conn = peer.connect(msg.peerID);
      conn.on('open', function(){
        conn.send(msg.key);//all are class for the stuff
      });
      conn.on('data', function(data){
        if(msg.hash===hash(data)){
          callback(data);
        }else{
          retry(5,function(){getItem(key,callback);},function(){console.log('ERROR');});//might have a problem????
        }
      });
      //what to do with reply is said later
  });
  socket.on('put data', function (msg) {
    callback(msg.val);
  });
  socket.emit('get value',{key:key});

}
getItem('test',function(x){console.log(x);});
