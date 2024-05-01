#!/usr/bin/env bun

import { glob } from 'glob';
import { exec } from 'node:child_process';
import * as path from 'node:path';
import semver from 'semver';
import { dedent } from 'ts-dedent';
import pkg from '../../../package.json';

const codeDirectory = path.join(__dirname, '..', '..', '..');
const versionsPath = path.join(__dirname, '..', 'src', 'versions.ts');
const logger = console;

const getMonorepoPackages = async () => {
  const files = await glob(
    pkg.workspaces.packages.map((l) => path.join(l, 'package.json')),
    { cwd: codeDirectory }
  );

  const contents = await Promise.all(
    files.map((file) => Bun.file(path.join(codeDirectory, file)).json())
  );

  return contents.filter((content) => !content.private);
};

const run = async () => {
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

  logger.log(
    `Updating versions and formatting results at: ${path.relative(codeDirectory, versionsPath)}`
  );

  const prettierBin = path.join(codeDirectory, '..', 'scripts', 'node_modules', '.bin', 'prettier');
  exec(`${prettierBin} --write ${versionsPath}`, {
    cwd: path.join(codeDirectory),
  });
};

run().catch((e) => {
  logger.error(e);
  process.exit(1);
});
