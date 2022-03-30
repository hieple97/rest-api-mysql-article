const mysql = require("mysql2/promise");
const config = require("../config");

async function initData(connection) {
  const createUserTable = `
            CREATE TABLE IF NOT EXISTS USERS_SOCIAL(
                id INT NOT NULL AUTO_INCREMENT,
                facebook_id varchar(255),
                google_id varchar(255),
                apple_id varchar(255),
                email varchar(255),
                first_name varchar(255),
                last_name varchar(255),
                PRIMARY KEY (id)
            )ENGINE=InnoDB;

            `;
  const [results] = await connection.execute(createUserTable);

  return results;
}

async function connection() {
  return mysql.createConnection(config.db);
}

module.exports = {
  connection,
  initData
};
