const { withSuperjson } = require('next-superjson')

const nextConfig = {
  i18n: {
    locales: ['sk', 'en'],
    defaultLocale: 'sk',
    localeDetection: false,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

module.exports = withSuperjson()(nextConfig)

// var cron = require('node-cron')

// cron.schedule('* * * * *', () => {
//   fetch('https://dreamm.vercel.app/api/email/product-close')
//     .then(console.log)
//     .catch(console.error)
// })

// console.log("WE'RE IN, STAY CALM, NAVRHNI DO 10 000 SUBOROV")
