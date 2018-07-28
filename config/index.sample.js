var config = {
	server:{
		host: "localhost",
		port: 3000,
		dev: false //turn this on development quirks
	},
	database:{
		host: "localhost",
		user: "user",
		password: "password",
		database: "database",
	},
	stripe:{
		secret_key: "secret_key"
	}
};

module.exports = config;