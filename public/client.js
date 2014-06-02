



var peer = new Peer(peerID, {key: 'a96mry70om5kx1or'}); //needs changing
var peerID;
peer.on('open', function(id) {
  peerID=id;
  getItem('test',function(x){console.log(x);});//this is the entire thing... need to make sure this is syncronous later...
});
vals={}
peer.on('connection', function(conn) {
  conn.on('data', function(key){

    conn.send(vals[key]);
  });
});

function hash(x){
  var temp=new jsSHA(x, "TEXT");
  return temp.getHash("SHA-512", "HEX");
}

function getItem(key,callback=function(x){},error=function(){}){
  var socket = io();
  socket.emit("put peer id",{peerID:peerID});//needs to be another place or something
  socket.on('put key holder', function (msg) {
      var conn = peer.connect(msg.peerID);
      conn.on('open', function() {
        conn.on('data', function(data){
          if(msg.hash===hash(data)){
            vals[key]=data;
            callback(data);
            return data;
          }else{
            error();//needs better fail funcion
            return;
          }
        });
        conn.send(msg.key);
    });

      //what to do with reply is said later
  });
  socket.on('put data', function (msg) {
    vals[key]=msg.val;
    callback(msg.val);
    return msg.val;
  });
  socket.emit('get value',{key:key});

}
