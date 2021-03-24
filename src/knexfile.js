module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL + '?sslmode=require',
  debug: false
};
