const { base64decode } = require('../helper');
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const crypto = require('crypto');
const UserService = require('../services/user-service');
const handleGetDeletionStatus = async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      throw Error('Missing code in param!');
    }
    const data = await UserService.getUserBySocialId(code, true, 'facebook');
    if (!data) res.json({ message: 'Your information has been removed from our database.', code });
    // do something;
    res.json({ message: 'Your information is stored in our database.' });
  } catch (err) {
    console.error('Error while getting programming languages ', err.message);
    next(err);
  }
};

const handleDeleteDataFacebook = async (req, res, next) => {
  try {
    if (!req.body || !req.body.signed_request) {
      throw Error('Missing signedRequest in body!');
    }
    const signedRequest = req.body.signed_request;
    const encodedData = signedRequest.split('.', 2);
    // decode the data
    const sig = encodedData[0];
    const json = base64decode(encodedData[1]);
    const data = JSON.parse(json);
    if (!data.algorithm || data.algorithm.toUpperCase() !== 'HMAC-SHA256') {
      throw Error('Unknown algorithm: ' + data.algorithm + '. Expected HMAC-SHA256');
    }
    const expectedSig = crypto.createHmac('sha256', CLIENT_SECRET).update(encodedData[1]).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');
    if (sig !== expectedSig) {
      throw Error('Invalid signature: ' + sig + '. Expected ' + expectedSig);
    }
    const userId = data.user_id;
    await UserService.updateStatusUser('facebook', userId);
    // delete data user here;
    const url = 'https://' + req.get('host') + '/facebook/deletion_status';
    res.type('json');
    res.send(`{ url: '${url}', confirmation_code: '${userId}' }`);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

module.exports = { handleGetDeletionStatus, handleDeleteDataFacebook };
