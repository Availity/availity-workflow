export default {
  test: /\.(jpe?g|png|gif|svg)$/i,
  use: ['url-loader?name=images/[name].[ext]&limit=10000']
};
