/// <reference types="@types/bun" />

import memoize from 'memoizerific';
import { CODE_DIRECTORY } from './constants';
import { dirname, join } from 'node:path';
import { glob } from 'glob';
import pkg from '../../code/package.json';

export type Workspace = { name: string; location: string };

const getMonorepoPackages = async () => {
  const files = await glob(
    pkg.workspaces.packages.map((l) => join(l, 'package.json')),
    { cwd: CODE_DIRECTORY }
  );

  const contents = await Promise.all(
    files.map((file) => Bun.file(join(CODE_DIRECTORY, file)).json())
  );

  return files
    .map((location, index) => ({ location: dirname(location), name: contents[index].name }))
    .filter((_, index) => !contents[index].private);
};

export const getWorkspaces = memoize(1)(getMonorepoPackages);

export async function workspacePath(type: string, packageName: string) {
  const workspaces = await getWorkspaces();
  const workspace = workspaces.find((w) => w.name === packageName);
  if (!workspace) {
    throw new Error(`Unknown ${type} '${packageName}', not in yarn workspace!`);
  }
  return workspace.location;
}
