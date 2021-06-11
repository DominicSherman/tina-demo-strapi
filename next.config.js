// eslint-disable-next-line @typescript-eslint/no-var-requires
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

module.exports = withMDX({
  env: {
    STRAPI_URL: process.env.STRAPI_URL,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
});
