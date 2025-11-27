const mongoose = require('mongoose');

function connectDatabase() {
	const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/sample_airbnb';

	mongoose.connect(uri, {
		serverSelectionTimeoutMS: 3000
	})
	.then(() => console.log('Connecté à MongoDB '))
	.catch((err) => console.warn('Impossible de se connecter à MongoDB :', err.message));

	mongoose.isReady = function () {
		return mongoose.connection && mongoose.connection.readyState === 1;
	};

	return mongoose;
}

module.exports = connectDatabase;