const { app } = require('electron');
const { join } = require('path');
const { existsSync } = require('fs');

const coreAsar = join(app.getPath('userData'), 'core.asar');
if (existsSync(coreAsar)) {
  require(coreAsar);
} else {
  require('./core.asar');
}  
