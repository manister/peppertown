/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL,
  generateRobotsTxt: true, // (optional)
  exclude: '/policies/*',
  generateIndexSitemap: false,
  // ...other options
}
