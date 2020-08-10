const jwt = require('jsonwebtoken');

module.exports = {
  /**
   * Base application gate
   * @param req
   * @param authOrSecDef
   * @param tokenString
   * @param callback
   * @return {Promise<*>}
   * @constructor
   */
  Bearer: function (req, authOrSecDef, tokenString, callback) {
    let data;
    try {
      const token = tokenString.split(' ')[1];
      data = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return callback(new Error(e.message));
    }
    if (!data.id) {
      return callback(new Error('token is valid, but not provide user.id'));
    }
    req.auth = {
      id: data.id,
    };
    callback();
  },
};
