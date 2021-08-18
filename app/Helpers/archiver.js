'use strict';

const fs = require("fs");
const archiver = require('archiver');
const Logger = use('Logger');

module.exports = (folderPath) => new Promise((resolve) => {
  try {
    const output = fs.createWriteStream(folderPath + '.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve();
    });

    archive.on('error', function(err){
      Logger.info(err);
    });

    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(folderPath, false);

    archive.finalize();
    
    return true;
  } catch(error) {
    Logger.info('archiver : ' . error);
    return false;
  }
});