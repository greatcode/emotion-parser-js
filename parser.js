const fs = require('fs')
const Promise = require('bluebird')

const emotionsRepo = new (require('./emotions-repository'))
const emotionsParser = new (require('./emotions-parser'))

const POLLING_INTERVAL_MS = 50

fs.watchFile('test-file.log', { interval: POLLING_INTERVAL_MS }, () => {
  try {
    var data = fs.readFileSync('test-file.log', 'utf8')
  } catch (err) {
    console.log(err)
  }

  processFileChange(data)
    .then(() => {
      console.log('done')
    })
    .catch(console.log)
})

async function parseEmotions(text) {
  const phrases = await emotionsParser.parsePhrases(text)
  const emotions = await Promise.map(phrases, (phrase) => emotionsParser.detectEmotion(phrase))
  return emotions.filter((e) => e && e.length > 0)
}

async function processFileChange(text) {
  const emotions = await parseEmotions(text)
  await emotionsRepo.save(text, emotions)
}
