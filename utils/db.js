const db = {
  username: 'postgres',
  host: 'localhost',
  port: '6543',
  tableName: 'EventBand',
};

const connectionString = `pg://postgres:${db.username}@${db.host}:${db.port}/${db.tableName}`;

module.exports = connectionString;
