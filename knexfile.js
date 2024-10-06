
const path = require("path")

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db"),
      charset: 'utf',
      timezone: 'pt-br',
      typeCast: (field, next) => {
        if (field.type === 'DATE') return field.string();
        return next();
      }
    },
    pool: {
      afterCreate: (conn, cb) =>  conn.run("PRAGMA foreign_keys = ON", cb)
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database" ,"knex", "migrations")
    },
    useNullAsDefault: true
  },
};


