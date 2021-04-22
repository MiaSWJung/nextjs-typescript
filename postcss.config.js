module.exports = {
  purge: [
    './pages/**/*.tsx',
    './components/**/*.tsx'
    // Use *.tsx if using TypeScript || Use *.js if using JS
  ],
  plugins: [
    'tailwindcss',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3,
        features: {
          'custom-properties': false
        }
      }
    ]
  ]
}