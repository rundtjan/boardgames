var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/app', express.static(process.cwd() + '/app'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "/public/index.html");
  });

  app.get('/:random', (req, res) => {
    res.sendFile(process.cwd() + "/public/index.html");
    //res.send(req.params.random)
  });

  ///////everything hereafter to handle the websocket with socket.io:

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });

    socket.on('join', (msg) => {
        //console.log(msg)
        socket.join(msg);
        console.log("joined", msg)
        //io.to(msg).emit('chat message', "testing");//send info for joining room
      });

    socket.on('dice', (room, arr) => {
        console.log(room, arr)
        socket.to(room).emit('dice', arr);//send to everybody else (io.to would be to all)
      });

      socket.on('move', (room, json) => {
        console.log(room, json)
        socket.to(room).emit('move', json);//send to everybody else (io.to would be to all)
      });

  });

  ///////// socket.io ends here

http.listen(port, () => {
  console.log('listening on ' + port);
});