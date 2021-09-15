/* istanbul ignore file */
const { Pool } = require('pg');

const testConnectionString = process.env.DATABASE_URL_TEST;

const pool = process.env.NODE_ENV === 'test' ? new Pool({ connectionString: testConnectionString }) : new Pool();

module.exports = pool;
