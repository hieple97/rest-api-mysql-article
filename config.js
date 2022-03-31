const config = {
  db: {
    host: process.env.HOST_DB,
    user: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
    multipleStatements: true,
    port: process.env.PORT_DB,
  },
};

module.exports = config;
