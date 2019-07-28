const fs = require('fs');
const path = require('path');

const findAllSpecificFiles = (filename, dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const currentItem = path.join(dir, file);

    filelist = fs.statSync(currentItem).isDirectory()
      ? findAllSpecificFiles(filename, currentItem, filelist)
      : currentItem.match(new RegExp(`${filename}$`))
        ? [...filelist, currentItem]
        : filelist

  });

  return filelist;
}

module.exports = findAllSpecificFiles;
