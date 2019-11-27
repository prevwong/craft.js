const path = require('path');
const fs = require('fs')

const dir = './dist'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

let dev = process.argv[2] == 'development' ? true : false;

fs.writeFileSync(
  `${dir}/index.js`, 
  `export * from "${dev ? '../lib/index.js' : './esm/index.js'}"`
);
