const IS_PROD = process.env.EAS_BUILD_PROFILE === 'production' ||
                process.env.EAS_BUILD_PROFILE === 'preview' ||
                process.env.GRADLE_BUILD === 'release';

module.exports = ({ config }) => {
  return {
    ...require('./app.json').expo,
    // Conditionally include dev-client for development only
    plugins: [
      "expo-asset",
      ...(IS_PROD ? [] : ["expo-dev-client"])
    ]
  };
};
