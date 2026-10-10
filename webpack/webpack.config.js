const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const pages = [
	{ template: 'index.html', filename: 'index.html' },
	{ template: 'projetos.html', filename: 'projetos.html' },
	{ template: 'cadastro.html', filename: 'cadastro.html' },
];

function getHtmlTemplate(filename) {
	return fs.readFileSync(path.resolve(projectRoot, filename), 'utf8')
		.replace(/^[ \t]*<link rel="stylesheet" href="css\/style\.css" media="all">\r?\n/gm, '')
		.replace(/^[ \t]*<script src="js\/(?:navigation|theme|masks|validation|draftStorage|feedback|registrationForm|JavaScript)\.js" defer><\/script>\r?\n/gm, '')
		.replace(/(imagens\/[^"'<>]+)\.png(?=["'])/g, '$1.webp');
}

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	return {
		mode: isProduction ? 'production' : 'development',
		context: projectRoot,
		entry: path.resolve(projectRoot, 'js/src/index.js'),
		output: {
			path: path.resolve(projectRoot, 'dist'),
			publicPath: '',
			filename: 'assets/js/[name].[contenthash:8].js',
			clean: true,
		},
		devtool: isProduction ? false : 'eval-source-map',
		module: {
			rules: [
				{
					test: /\.css$/i,
					use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
				},
			],
		},
		optimization: {
			minimize: isProduction,
			minimizer: ['...', new CssMinimizerPlugin()],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'assets/css/[name].[contenthash:8].css',
			}),
			...pages.map(page => new HtmlWebpackPlugin({
				filename: page.filename,
				templateContent: () => getHtmlTemplate(page.template),
				inject: 'head',
				scriptLoading: 'defer',
				minify: isProduction && {
					collapseWhitespace: true,
					removeComments: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true,
					useShortDoctype: true,
				},
			})),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: '**/*.png',
						context: path.resolve(projectRoot, 'imagens'),
						to: 'imagens/[name].webp',
						transform: content => sharp(content).webp({ quality: 82 }).toBuffer(),
					},
				],
			}),
		],
	};
};
