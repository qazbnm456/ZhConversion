const assert = require('assert')
const fs = require('fs')
const marky = require('marky-markdown-lite')

function parser(filepath, callback) {
  assert(typeof filepath === 'string', 'A valide filepath is required as the first argument')
  assert(typeof callback === 'function', 'A callback function is required as the second argument')

  try {
    const $ = marky(fs.readFileSync(filepath, 'utf-8'))
    const api = {}
    const content = $('h2').eq(0).next()
    const count = $('h2').length - 3
    for (let i = 0; i < count; i++) {
      api[content.find('li > a').eq(i).text()] = {}
      const entries = content.find('li > ul > li')
      for (let j = 0; j < entries.length; j++) {
        const tmp = {}
        const obj = $(`h3#${entries.eq(j).text().toLowerCase().replace(/\s/g, '-')}`)
        tmp[obj.text()] = {
          'en-US': [obj.text()],
          'zh-CN': obj.next().next().text().split(/\s{1}(?=zh*)/, 1)[0].split('、'),
          'zh-TW': obj.next().next().next().next().text().split(/\s{1}(?=zh*)/, 1)[0].split('、'),
          description: {
            'en-US': obj.next().text(),
            'zh-CN': obj.next().next().next().text(),
            'zh-TW': obj.next().next().next().next().next().text()
          }
        }
        Object.assign(api[Object.keys(api)[i]], tmp)
      }
    }
    callback(null, api)
  } catch (readError) {
    callback(readError.message)
  }
}

module.exports = parser
