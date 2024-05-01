/// <reference types="@types/bun" />

import { glob } from 'glob';
import { exec } from 'node:child_process';
import { join, relative } from 'node:path';
import semver from 'semver';
import { dedent } from 'ts-dedent';
import pkg from '../../../package.json';

const codeDirectory = join(__dirname, '..', '..', '..');
const versionsPath = join(__dirname, '..', 'src', 'versions.ts');
const logger = console;

const getMonorepoPackages = async () => {
  const files = await glob(
    pkg.workspaces.packages.map((l) => join(l, 'package.json')),
    { cwd: codeDirectory }
  );

  const contents = await Promise.all(
    files.map((file) => Bun.file(join(codeDirectory, file)).json())
  );

  return contents.filter((content) => !content.private);
};

let updatedVersion = process.argv[process.argv.length - 1];

if (!semver.valid(updatedVersion)) {
  updatedVersion = pkg.version;
}

const storybookPackages = await getMonorepoPackages();

const packageToVersionMap = storybookPackages
  .map((contents) => {
    const { name, version } = contents;

    return {
      name,
      version,
    };
  })
  .filter(({ name }) => /^(@storybook|sb$|storybook$)/.test(name))
  // As some previous steps are asynchronous order is not always the same so sort them to avoid that
  .sort((package1, package2) => package1.name.localeCompare(package2.name))
  .reduce((acc, { name }) => ({ ...acc, [name]: updatedVersion }), {});

await Bun.write(
  versionsPath,
  dedent`
      // auto generated file, do not edit
      export default ${JSON.stringify(packageToVersionMap, null, 2)}
    `
);

logger.log(`Updating versions and formatting results at: ${relative(codeDirectory, versionsPath)}`);

const prettierBin = join(codeDirectory, '..', 'scripts', 'node_modules', '.bin', 'prettier');
exec(`${prettierBin} --write ${versionsPath}`, {
  cwd: join(codeDirectory),
});
