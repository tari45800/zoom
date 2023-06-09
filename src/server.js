import express from "express";
import http from "http";
import WebSocket from 'ws';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_,res) => res.render("home"));
app.get("/*", (_,res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = []; 

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = '알수없는'
  console.log("Connected to Browser")
  socket.on("close", () => {
      console.log("Disconnected from Browser")
  })
  socket.on("message", (msg) => {
    const message = JSON.parse(msg)

    switch(message.type){
      case "new_message":
        sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;

    }

  })
});

const handleListen = () => console.log('hello');
server.listen(3000, handleListen); 