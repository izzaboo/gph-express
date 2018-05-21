// models/db.js
var promise = require('bluebird');
var path = require('path');

const initOptions = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(initOptions);
const connector = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
}
// 'postgres://user:pass@host:port/dbname';
//const db = pgp(connector);

// Link external query files
function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify:true});
  console.log('doink'+fullPath);
}

module.exports = {
  connectString: connector,
  cn: pgp(connector),
  sqlGetLocations: sql('../sql/getLocations.sql')
};
