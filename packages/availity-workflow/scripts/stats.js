module.exports = (stats, options = {}) => {
  const { errorDetails = true, warnings = true } = options;

  return stats.toString({
    colors: true,
    cached: true,
    reasons: false,
    source: false,
    chunks: false,
    modules: false,
    chunkModules: false,
    chunkOrigins: false,
    children: false,
    errorDetails,
    warnings
  });
};
