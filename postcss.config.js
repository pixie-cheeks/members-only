import postcssPresetEnv from 'postcss-preset-env';
import postcssNested from 'postcss-nested';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';

const plugins = [postcssImport, postcssNested, postcssPresetEnv()];
/**
 * @param {{
 * env: 'production' | 'development',
 * options: import('postcss').ProcessOptions,
 * file: {
 * dirname: string,
 * basename: string,
 * extname: string
 * }
 * }} context
 * @returns
 */
export default function postcssConfigFunction(context) {
  return {
    map: context.options.map,
    plugins:
      context.env === 'production'
        ? [...plugins, cssnano({ preset: 'default' })]
        : plugins,
  };
}
