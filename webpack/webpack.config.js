const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'bundle.js',
		clean: true,
	},
	resolve: {
		extensions: ['.js', '.json'],
	},
	devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
};
