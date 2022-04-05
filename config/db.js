const mysql = require('mysql2/promise');
const MYSQL_CONFIG = {
  host: process.env.HOST_DB,
  user: process.env.USERNAME_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.NAME_DB,
  multipleStatements: true,
  port: 3307
};

const query = async (sql, params) => {
  const connection = await mysql.createConnection(MYSQL_CONFIG);
  const [results] = await connection.execute(sql, params);

  return results;
};

const initData = async () => {
  const createUserTableQueryStr = `
            CREATE TABLE IF NOT EXISTS user_social (
                id INT NOT NULL AUTO_INCREMENT,
                facebook_id varchar(255) UNIQUE,
                google_id varchar(255) UNIQUE,
                apple_id varchar(255) UNIQUE,
                email varchar(255) UNIQUE,
                first_name varchar(255),
                last_name varchar(255),
                profile_picture varchar(512),
                created_at datetime default CURRENT_TIMESTAMP,
                updated_at datetime default CURRENT_TIMESTAMP,
                status TINYINT(1) DEFAULT "1",
                PRIMARY KEY (id)
            )ENGINE=InnoDB;

            `;
  return query(createUserTableQueryStr);
};

const connection = () => {
  return mysql.createConnection(MYSQL_CONFIG);
};

module.exports = {
  connection,
  initData,
  query
};
