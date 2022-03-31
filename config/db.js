const mysql = require("mysql2/promise");
const config = require("../config");

async function initData(connection) {
  const createUserTable = `
            CREATE TABLE IF NOT EXISTS user_social (
                id INT NOT NULL AUTO_INCREMENT,
                facebook_id varchar(255) UNIQUE,
                google_id varchar(255) UNIQUE,
                apple_id varchar(255) UNIQUE,
                email varchar(255) UNIQUE,
                first_name varchar(255),
                last_name varchar(255),
                status TINYINT(1) DEFAULT "1",
                PRIMARY KEY (id)
            )ENGINE=InnoDB;

            `;
  const [results] = await connection.execute(createUserTable);
  return results;
}

function connection() {
  return mysql.createConnection(config.db);
}


module.exports = {
  connection,
  initData
};
