/* I wish this wasn't needed..
 * There seems to be some bug in tsup / the unlaying lib that does DTS bundling
 * ...that makes it mess up the generation.
 */
const content = await Bun.file('./dist/index.d.ts').text();

const regexp = /'lib\/preview-api/;
const replaced = content.replace(regexp, "'@storybook/preview-api");

await Bun.write('./dist/index.d.ts', replaced);

export {};
