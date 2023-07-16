let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, { cors: { origin: '*' } })
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error("socket is not initialized");
    }
    return io;
  },
  emit: (action, args) => {
    io.emit(action, args)
  },
  on: (action, callback) => {
    io.on(action, callback)
  }
};