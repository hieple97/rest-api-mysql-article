const { query } = require('../config/db');
// const connPromise = db.connection();
const typeMap = {
  facebook: 'facebook_id',
  google: 'google_id',
  apple: 'apple_id'
};
async function getUserBySocialId (id, isEnabled = true, type) {
  const queryStr = `SELECT id, facebook_id, google_id, apple_id, last_name, first_name, email FROM user_social WHERE ${typeMap[type]} = ${id} and status = ${isEnabled}`;
  const [rows] = await query(queryStr);
  if (rows) {
    return rows[0];
  }
  return null;
}

async function updateStatusUser (type, socialId) {
  const result = await query(
        `UPDATE user_social 
    SET status = 0
    WHERE facebook_id=${socialId}`
  );

  let message = 'Error in updating status user';

  if (result.affectedRows) {
    message = 'Status user updated successfully';
  }

  return { message };
}

async function upsertUser (type, data) {
  const { lastName, firstName, email, facebookId } = data;
  const result = await query(
        `INSERT INTO user_social (facebook_id,last_name,first_name,email) VALUES("${facebookId}","${lastName}","${firstName}","${email}") ON DUPLICATE KEY UPDATE facebook_id = "${type.facebook_id}", email = "${type.email}" `
  );

  let message = 'Error in upsert user';

  if (result.affectedRows) {
    message = 'User upsert successfully';
  }

  return { message };
}

async function remove (id) {
  const result = await query(
        `DELETE FROM programming_languages WHERE id = ${id} `
  );

  let message = 'Error in deleting programming language';

  if (result.affectedRows) {
    message = 'Programming language deleted successfully';
  }

  return { message };
}

module.exports = {
  getUserBySocialId,
  updateStatusUser,
  remove,
  upsertUser
};
