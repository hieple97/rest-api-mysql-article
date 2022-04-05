const { query } = require('../config/db');
const TYPE_MAP = {
  facebook: 'facebook_id',
  google: 'google_id',
  apple: 'apple_id'
};
const getUserBySocialId = async (id, isEnabled = true, type) => {
  const queryStr = `SELECT id, facebook_id, google_id, apple_id, last_name, first_name, email FROM user_social WHERE ${TYPE_MAP[type]} = ${id} and status = ${isEnabled}`;
  const res = await query(queryStr);
  return res;
};

const getUserByEmail = async (email, isEnabled = true) => {
  const queryStr = `SELECT id, facebook_id, google_id, apple_id, last_name, first_name, email FROM user_social WHERE email = "${email}" and status = ${isEnabled}`;
  const res = await query(queryStr);
  return res;
};

const updateStatusUser = async (type, socialId) => {
  const res = await query(
    `UPDATE user_social 
    SET status = 0
    WHERE facebook_id=${socialId}`
  );
  return res;
};

const upsertUser = async (data) => {
  const { lastName, firstName, email, facebookId, profilePicture } = data;
  const res = await query(
    `INSERT INTO user_social (facebook_id,last_name,first_name,email,profile_picture) VALUES("${facebookId}","${lastName}","${firstName}","${email}","${profilePicture}") ON DUPLICATE KEY UPDATE facebook_id = "${facebookId}", email = "${email}" `
  );
  return res;
};

const removeUserById = async (id) => {
  const res = await query(
    `DELETE FROM programming_languages WHERE id = ${id} `
  );
  return res;
};

module.exports = {
  getUserBySocialId,
  updateStatusUser,
  removeUserById,
  upsertUser,
  getUserByEmail
};
