const mongoose = require('mongoose');

const collectibleSchema = mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	id: Number,
	image: String,
	title: String
});

module.exports = mongoose.model('Collectible', collectibleSchema);