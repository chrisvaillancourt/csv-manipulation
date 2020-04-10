import resolve from '@rollup/plugin-node-resolve';
export default {
  input: 'src/index.js',
  output: {
    file: 'src/bundle.js',
    format: 'es'
  },
  plugins: [resolve()],

};