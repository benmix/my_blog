/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */

const config = {
  printWidth: 100,
  semi: true,
  singleQuote: false,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/global.css'
}

export default config
