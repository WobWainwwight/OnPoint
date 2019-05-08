const now = new Date()
now.setTime(now.getTime() + (24 * 60 * 60 * 1000))
console.log('expires=' + now.toUTCString())