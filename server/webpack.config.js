const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

/**
 * @param {string} url
 */
function getFullPath(url) {
	return path.resolve(__dirname, url);
}


module.exports = (env, params) => {

	return {
		entry: getFullPath('src/lambda.ts'),
		target: 'node',
		externals: [nodeExternals()],
		mode: 'production',
		devtool: "source-map",
		stats: 'verbose',
		output: {
			libraryTarget: 'commonjs2',
			filename: 'lambda.js',
			path: path.resolve(__dirname, 'dist'),
		},
		resolve: {
			extensions: ['.ts', '.js'],
			plugins: [
				// @ts-ignore
				new TsconfigPathsPlugin({ configFile: './tsconfig.json' }),
			],
		},
		module: {
			rules: [
				{
					test: /\.ts$/, // Process TypeScript files
					use: 'ts-loader', // Use ts-loader for transpiling
					exclude: /node_modules/,
				},
				{
					test: /\.ts$/,
					exclude: [
						'/test/',
						'/**/*.spec.ts'
					]
				}
			],
		},
		node: {
			__dirname: true,
			__filename: true,
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
						// extractComments: "all",
						compress: {
							drop_console: false,
							drop_debugger: true,
						},
					},
				}),
			],
		},
	}
};