var mongoose = require('mongoose');
var categorysSchema = require('../schemas/categorys');
module.exports = mongoose.model('Category',categorysSchema);