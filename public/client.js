var peerID=Math.random().toString(36).substring(7);


var peer = new Peer(peerID, {key: 'myapikey'}); //needs changing
vals={}
peer.on('connection', function(conn) {
  conn.send('open');
  conn.on('data', function(key){
    conn.vals.key
    // Will print 'hi!'
    console.log(data);
  });
  conn.on('data', function(data){

    // Will print 'hi!'
    console.log(data);
  });
});

function hash(x){
  return jsSHA(x, "TEXT").getHash("SHA-512", "HEX");
}

function getItem(key,callback=function(x){},error=function(x){}){
  var socket = io();
  socket.emit("put peer id",{peerID:peerID});//needs to be another place or something
  socket.on('put key holder', function (msg) {
      var conn = peer.connect(msg.peerID);
      conn.send(msg.key);
      conn.on('open', function(){
        conn.send('key',msg.key);//all are class for the stuff
      });
      conn.on('data', function(data){
        if(msg.hash===hash(data)){
          vals.key=data;
          callback(data);
          return data;
        }else{
          console.log("FAIL");//needs better fail funcion
        }
      });
      //what to do with reply is said later
  });
  socket.on('put data', function (msg) {
    vals.key=data;
    callback(msg.val);
    return msg.val;
  });
  socket.emit('get value',{key:key});

}
getItem('test',function(x){console.log(x);});
