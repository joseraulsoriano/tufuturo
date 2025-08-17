module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Use the updated worklets plugin per reanimated notice
      'react-native-worklets/plugin',
    ],
  };
};


