const asyncHandler = require('../util/asyncHandler');

exports.healthCheck = asyncHandler(async (req, res) => { 
    return res.status(200).send('OK');
});