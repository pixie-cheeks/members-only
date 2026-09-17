// Disabling this rule because shell.js doesn't work nicely when imported
// the correct way
/* eslint-disable import-x/no-named-as-default-member */
import shell from 'shelljs';

console.log('Cleaning the build folder.');
shell.rm('-rf', ['dist']);
console.log('Done cleaning.');

console.log('Build JS files from TS files.');
shell.exec('tsc -p configs/tsconfig.build.json');
console.log('Done building JS files.');

console.log('Build styles with postcss.');
shell.exec(
  'postcss src/styles/style.css --dir src/public/styles --map --env production',
);
console.log('Done building styles.');

console.log('Copy other assets.');
shell.cp('-R', ['src/views', 'src/public'], 'dist/');
shell.cp('src/db/schema.sql', 'dist/db/schema.sql');
console.log('Done copying assets.');

console.log('Remove unnecessary files.');
shell.rm('-f', ['dist/public/js/*.ts', 'dist/public/js/*.json']);
console.log('Done removing unnecessary files.');
