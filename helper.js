function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}
function base64decode(data) {
  while (data.length % 4 !== 0) {
    data += '=';
  }
  data = data.replace(/-/g, '+').replace(/_/g, '/');
  return new Buffer(data, 'base64').toString('utf-8');
}
function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function getConfirmationCodeFacebook() {
  return crypto.randomBytes(10).toString('hex')
}

module.exports = {
  getOffset,
  emptyOrRows,
  base64decode,
  getConfirmationCodeFacebook
};
