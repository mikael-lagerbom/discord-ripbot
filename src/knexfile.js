const pool = {
  client: 'pg',
  connection: process.env.DATABASE_URL
};

module.exports = {
  pool
};
