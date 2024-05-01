/// <reference types="@types/bun" />

/**
 * This postbuild fix is needed to add a ts-ignore to the generated public-types.d.ts file.
 * The AngularCore.InputSignal and AngularCore.InputSignalWithTransform types do not exist in Angular
 * versions < 17.2. In these versions, the unresolved types will error and prevent Storybook from starting/building.
 * This postbuild script adds a ts-ignore statement above the unresolved types to prevent the errors.
 */

import { join } from 'node:path';

const filePath = join(__dirname, '../dist/client/public-types.d.ts');

const fileContent = await Bun.file(filePath).text();
const newContent = fileContent
  .replaceAll(/(type AngularInputSignal)/g, '// @ts-ignore\n$1')
  .replaceAll(/(type AngularOutputEmitterRef)/g, '// @ts-ignore\n$1');

await Bun.write(filePath, newContent);
