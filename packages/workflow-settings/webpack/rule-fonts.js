module.exports = {
  // test should match the following:
  //
  //  '../fonts/availity-font.eot?18704236'
  //  '../fonts/availity-font.eot'
  //
  test: /font\.(otf|ttf|woff2?|eot|svg)(\?.+)?$/,
  use: ['file-loader?name=fonts/[name].[ext]']
};
