// once in production point to shoutermagn
exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://shoutermag.com'
  : 'http://localhost:3000'