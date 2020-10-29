import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import Server from './src/AppServer.js';


let env = dotenv.config({path: './server/.env'});
let port = process.env.SERVER_PORT;
let app = express();
let accessExpiry = 60 * 30;
let signing_key = null;

let server_config = {
  app_id: process.env.ABCIAM_APP_ID,
  app_secret: process.env.ABCIAM_APP_SECRET,
  url: process.env.ABCIAM_URL
}

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use(function (req, res, next) {
  if (req.query) {
    for(var i in req.query) {
      if(!req.body[i]) {
        req.body[i] = req.query[i];
      }
    }
  }
  next();
});

app.use(cors());
app.use(express.static('web'));

app.use(function(req, resp, next){
  console.log("Request: ", req.method, req.originalUrl);
  next();
})

app.use(async function (req, res, next) {
  let server = new Server(server_config);
  let passed = await server.tokenSecurity(req, res);
  if(passed) {
    next();
  }
});


app.get('/test', function(req, res){
  res.json({test:1});
});
app.get('/token', async function(req, res) {
  let server = new Server(server_config);
  let response = await server.getToken(req);
  console.log("GET TOKEN DONE: ", response);
  res.json(response);
});
app.post('/token', async function(req, res) {
  console.log("server file", res.body)
  let server = new Server(server_config);
  let response = await server.postToken(req)
  res.json(response);
});
app.delete('/token', async function(req, res) {
  let server = new Server(server_config);
  await server.deleteToken(req);
  res.end();
});

app.post('/goal', async function(req, res){
  let server = new Server(server_config);
  res.json(await server.postGoal(req));
});

app.get('/goal/:goal_id', async function(req, res) {
  let server = new Server(server_config);
  res.json(await server.getGoal(req));
  res.end();
});
app.get('/goal', async function(req, res) {
  let server = new Server(server_config);
  res.json(await server.getGoal(req));
  res.end();
});


app.post('/experiment', async function(req, res) {
  let server = new Server(server_config);
  res.json(await server.postExperiment(req));
  res.end();
});

app.listen(port, () => console.log(`Listening on ${port}`));

function log(msg) {
  console.log("SERVER: ", msg)
}