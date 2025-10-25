const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const {v4:uuid} = require('uuid');
const {format} = require('date-fns');

const LogEventFunction = (method, filename) => 
{
    const logFolder = path.join(__dirname, 'logs');
    const logFiles = path.join(logFolder, filename);

    if(!fs.existsSync(logFolder))
    {
        await fsPromise.mkdir(logFolder, {recursive : true});
    }
}