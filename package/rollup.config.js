import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-import-css';
import pkg from './package.json';

export default {
  input: 'src/js/index.js',
  plugins: [
    terser(),
    css({
      output: 'dist/pagination-system.min.css',
      minify: true,
    }),
  ],
  output: [
    {
      name: 'PaginationSystem',
      file: pkg.browser,
      format: 'umd',
    },
    {
      name: 'PaginationSystem',
      file: pkg.module,
      format: 'es',
    },
  ],
};
