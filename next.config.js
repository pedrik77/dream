module.exports = {
  i18n: {
    locales: ['sk', 'en'],
    defaultLocale: 'sk',
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

console.log("WE'RE IN, STAY CALM, NAVRHNI DO 10 000 SUBOROV")

var cron = require('node-cron')

cron.schedule('0 1 * * *', () => {
  fetch('https://dreamm.vercel.app/api/product-close')
    .then(console.log)
    .catch(console.error)
})
