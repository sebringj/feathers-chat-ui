import io from 'socket.io-client';
// feathers typescript has some gaps
const feathers = require('@feathersjs/client').default;

const socketio = io('http://localhost:3030');
const client = feathers();

client.configure(feathers.socketio(socketio));
client.configure(feathers.authentication({
  storage: window.localStorage
}));

export {socketio};

export default client;
