const mongoose = require('mongoose');

// connexion a la bdd
async function connectDatabase() {
	const uri = process.env.MONGO_URI;

	try {
		await mongoose.connect(uri);
		console.log('Connecté à MongoDB');
	} catch (err) {
		console.error('Erreur connexion MongoDB :', err.message);
		process.exit(1);
	}
}

module.exports = connectDatabase;