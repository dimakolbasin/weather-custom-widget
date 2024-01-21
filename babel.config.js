module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    ['@babel/preset-vue', { 'runtimeModuleName': 'es6' }] // Добавляем пресет для Vue
  ],
  // presets: [['@babel/preset-env', { useBuiltIns: 'entry', corejs: '3.0.0', exclude: ['proposal-dynamic-import'] }]],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime' // Добавляем плагин для поддержки async/await и других функций
  ],
  env: {
    test: {
      plugins: ['transform-es2015-modules-commonjs', 'babel-plugin-dynamic-import-node'],
      ignore: [/node_modules\//]
    }
  }
}
