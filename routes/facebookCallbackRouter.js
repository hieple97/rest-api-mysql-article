const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const { base64decode, getConfirmationCodeFacebook } = require("../helper");
const CLIENT_SECRET = process.env.CLIENT_SECRET;
/* GET programming languages. */
router.get("/deletion_status", async function (req, res, next) {
  try {
    const code = req.query.code;
    // do something;
    res.json({ message: 'Your information has been removed from our database.' });
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

/* POST programming language */
router.post("/data_deletion", async function (req, res, next) {
  try {
    if (!req.body || !req.body.signed_request) {
      throw Error('Missing signedRequest in body!');
    }
    const signedRequest = req.body.signed_request;
    let encoded_data = signedRequest.split('.', 2);
    // decode the data
    let sig = encoded_data[0];
    let json = base64decode(encoded_data[1]);
    let data = JSON.parse(json);
    if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
      throw Error('Unknown algorithm: ' + data.algorithm + '. Expected HMAC-SHA256');
    }
    let expected_sig = crypto.createHmac('sha256', CLIENT_SECRET).update(encoded_data[1]).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');
    if (sig !== expected_sig) {
      throw Error('Invalid signature: ' + sig + '. Expected ' + expected_sig);
    };
    const userId = data.user_id;
    console.log({ userId });
    // delete data user here;
    const url = 'https://' + req.get('host') + '/fb/deletion_status';
    const confirmationCode = getConfirmationCodeFacebook();
    console.log({ url, confirmationCode });
    res.type('json');
    res.send(`{ url: '${url}', confirmation_code: '${confirmationCode}' }`);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

module.exports = router;
