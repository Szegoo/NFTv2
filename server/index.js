const express = require('express')
const next = require('next')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Collectible = require('./model/Collectible');
const {uploadImage, resizeImage, addCollectible} = require('./controllers/collectibleController');
    
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

mongoose.connect(process.env.MONGODB_KEY, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log("connected!");
});
const db = mongoose.connection;
db.on('error', () => console.log('connection error'));
app.prepare()
.then(() => {
	const server = express()
	server.use(bodyParser.json())
	server.post('/api/add-nft', uploadImage, resizeImage, addCollectible);
	server.get('/nft', async(req, res) => {
		const {id} = req.query;
		const collectibles = await Collectible.find().where({
			id
		});
		res.json(collectibles[0]);
	})

	server.get('*', (req, res) => {
		return handle(req, res)
	});
		
	server.listen(process.env.PORT || 3000, (err) => {
		if (err) throw err
		console.log('> Ready on http://localhost:3000')
	});
})
.catch((err) => {
  console.error(err)
  process.exit(1)
})