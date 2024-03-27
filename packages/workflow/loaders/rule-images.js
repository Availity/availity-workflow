export default {
  test: /\.(jpe?g|png|gif|svg)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'images/[name].[ext]'
  }
};
