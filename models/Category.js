var mongoose = require('mongoose');
var categorysSchema = require('../schemas/categories');
module.exports = mongoose.model('Category',categorysSchema);