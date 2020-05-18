module.exports = {
  port: 3000,
  jwt: {
    secret: 'gp',
    key: 'graduation',
    maxAge: 2592000000
  },
  mongoDB: 'mongodb://localhost:27017/gp',
  url: {
    cors: 'http://localhost:3001, http://192.168.50.188:10086'
  }
}
