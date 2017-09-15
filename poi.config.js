module.exports = {
	sourceMap: process.env.NODE_ENV === 'production' ? false: undefined,
	devServer: {
		proxy: 'http://localhost:8900'
	}
};
