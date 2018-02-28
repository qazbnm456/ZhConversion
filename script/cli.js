const args = require('minimist')(process.argv.slice(2))
const dedent = require('dedent')
const fs = require('fs')
const parser = require('.')
const path = require('path')

let docsPath = args._[0] || '../README.md'
let outfile = args.outfile

// docsPath is required
if (!docsPath) usage('specify a pathname, .e.g ~/my/readme')

// docsPath is relative to current working directory
docsPath = path.join(process.cwd(), '' + docsPath)

// outfile is relative to current working directory
if (outfile) outfile = path.join(process.cwd(), outfile)

parser(docsPath, (err, api) => {
  if (err) usage(err)

  if (outfile) {
    fs.writeFileSync(outfile, JSON.stringify(api, null, 2))
    console.log(dedent`
      Created ${path.relative(process.cwd(), outfile)}
    `)
  } else {
    console.log(dedent`
      Docs are good to go!\n
      To write the docs schema to a file, specify \`outfile\`:\n
      zh-conversion ${path.relative(process.cwd(), docsPath)} --outfile=zh-conversion.json
    `)
  }

  process.exit()
})

function usage (reason) {
  if (reason) console.error(`Error: ${reason}`)

  console.error(dedent`
    Usage: zh-conversion <pathname>\n
    To save the parsed JSON schema:\n
    zh-conversion <pathname> --outfile=zh-conversion.json\n`)
  process.exit(1)
}
