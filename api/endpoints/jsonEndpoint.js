'use strict';

/**
 * @module files
 */

/**
 * endpoint for returning JSON data
 * @function jsonEndpoint
 * @param {Object} req - the express request object
 * @param {Object} res - the express response object
 */

function jsonEndpoint(req, res) {
  const status = req.responseData && req.responseData.status ? req.responseData.status : 400;
  
  const data = req.responseData && (req.responseData.data || req.responseData.errors) ? req.responseData : {
    errors: [{
      error: 'sorry we couldn\'t interpret you\'re request',
      status: 400
    }]
  };
  res.status(status);
  res.json(data);
  
}

module.exports = exports = jsonEndpoint;
