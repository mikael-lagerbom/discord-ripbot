module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  debug: false,
  ssl: { rejectUnauthorized: false }
};
