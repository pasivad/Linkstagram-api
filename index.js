require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/index.js');
const UserModel = require('./models/User.js');

mongoose
  .connect('mongodb+srv://MonZero:Vladishack_12@cluster0.qja2dqb.mongodb.net/linkstagram?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router);

const server = require('http').createServer(app);

const io = require('./socket.js').init(server);

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('receive-userLikes', async (userId) => {
    const user = await UserModel.findById(userId).exec();
    io.emit('send-userLikes', { likes: user.likes, likedComments: user.likedComments });
  });
});

server.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
