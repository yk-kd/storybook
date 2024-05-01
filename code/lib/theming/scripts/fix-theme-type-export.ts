import { dedent } from 'ts-dedent';
import { join } from 'path';

const run = async () => {
  const target = join(process.cwd(), 'dist', 'index.d.ts');
  const contents = await Bun.file(target).text();

  const footer = contents.includes('// dev-mode')
    ? `export { StorybookTheme as Theme } from '../src/index';`
    : dedent`
        interface Theme extends StorybookTheme {}
        export type { Theme };
      `;

  const newContents = dedent`
    ${contents}
    ${footer}
  `;

  await Bun.write(target, newContents);
};

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
