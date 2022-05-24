const devPool = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  debug: false,
  ssl: false
};

const prodPool = {
  client: 'pg',
  connection: process.env.DATABASE_URL + '?ssl=true',
  debug: false,
  ssl: { rejectUnauthorized: false }
};

module.exports = {
  devPool,
  prodPool
};
