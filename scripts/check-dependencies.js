/**
 * This file needs to be run before any other script to ensure dependencies are installed
 * Therefore, we cannot transform this file to Typescript, because it would require esbuild to be installed
 */
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { CODE_DIRECTORY, SCRIPTS_DIRECTORY } from './utils/constants';

const logger = console;

const tasks = [];

if (!existsSync(join(SCRIPTS_DIRECTORY, 'node_modules'))) {
  tasks.push(
    spawn('bun', ['install'], {
      cwd: SCRIPTS_DIRECTORY,
      shell: true,
      stdio: ['inherit', 'inherit', 'inherit'],
    })
  );
}
if (!existsSync(join(CODE_DIRECTORY, 'node_modules'))) {
  tasks.push(
    spawn('bun', ['install'], {
      cwd: CODE_DIRECTORY,
      shell: true,
      stdio: ['inherit', 'inherit', 'inherit'],
    })
  );
}

if (tasks.length > 0) {
  logger.log('installing dependencies');

  await Promise.all(
    tasks.map(
      (t) =>
        new Promise((res, rej) => {
          t.on('exit', (code) => {
            if (code !== 0) {
              rej();
            } else {
              res();
            }
          });
        })
    )
  ).catch(() => {
    tasks.forEach((t) => t.kill());
    throw new Error('Failed to install dependencies');
  });

  // give the filesystem some time
  await new Promise((res) => {
    setTimeout(res, 1000);
  });
}
