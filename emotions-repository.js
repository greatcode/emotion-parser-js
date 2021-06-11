class EmotionsRepository {

  constructor() {
    this.delay = 1000
    this.setTimeout = []
  }

  save() {

    return new Promise((resolve, reject) => {
      const TIMEOUT_THRESHOLD_MS = 3000
      const delay = this.delay * (this.setTimeout.length + 1)

      if (delay > TIMEOUT_THRESHOLD_MS) {
        let rejection = setTimeout(() => {
          this.setTimeout.shift()
          reject('Database timeout')
        }, TIMEOUT_THRESHOLD_MS)
        this.setTimeout.push(rejection)
        return
      }

      let success = setTimeout(() => {
        this.setTimeout.shift()
        resolve()
      }, delay)
      this.setTimeout.push(success)
    })
  }
}

module.exports = EmotionsRepository
