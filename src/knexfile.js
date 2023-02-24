const devPool = {
  client: 'pg',
  connection: process.env.DATABASE_URL
};

module.exports = {
  devPool
};
