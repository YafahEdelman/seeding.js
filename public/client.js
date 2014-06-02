var peer = new Peer({key: 'a96mry70om5kx1or'}); //you are allowed to specify a specific id
var peerID;
var vals={}
peer.on('open', function(id) {
  peerID=id;
  getItem('test',function(x){console.log(x);},function(){console.log("failed")};);//this is the entire thing... need to make sure this is syncronous later...
});

peer.on('connection', function(conn) {
  conn.on('data', function(key){

    conn.send(vals[key]);
  });
});
var socket = io();
socket.emit("put peer id",{peerID:peerID});//needs to have been done early enough
function hash(x){
  var temp=new jsSHA(x, "TEXT");
  return temp.getHash("SHA-512", "HEX");
}
requests={}
function getItem(key,callback=function(x){},error=function(){}){
  requestID=hash(this);
  requests[requestID]=this;//callback should be unique so this should be fine, is storing this the right thing to do?
  socket.emit('get value',{key:key,requestID:requestID});

}

socket.on('put key holder', function (msg) {
  request=requests[msg.requestID];
  assert(request);//if their is an error here the server is broken
    var conn = peer.connect(msg.peerID);
    conn.on('open', function() {
      conn.on('data', function(data){
        if(msg.hash===hash(data)){
          request.callback(msg.val);
          vals[request.key]=data;
          request.callback(data);
          return data;
        }else{
          request.error();//maybe pass error to callback???hmmmm....
          return;
        }
      });
      conn.send(msg.key);
  });

});
socket.on('put data', function (msg) {
  request=requests[msg.requestID];
  assert(request);//if their is an error here the server is broken
  vals[request.key]=msg.val;
  request.callback(msg.val);
  return msg.val;
});
