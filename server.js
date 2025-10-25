const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;
const fs = require('fs');
const fsPromises = require('fs').promises;
const { format } = require('date-fns');

const createFiles = async (message, filename) => {
    const logFolder = path.join(__dirname, 'logs');
    const logFile = path.join(logFolder, filename);

    try {
        if (!fs.existsSync(logFolder)) {
            await fsPromises.mkdir(logFolder, { recursive: true });
        }

        const time = format(new Date(), "dd/MM/yyyy\tHH:mm:ss");
        const logData = `${time}\t${message}\n`;

        await fsPromises.appendFile(logFile, logData);
        console.log(logFile, logData);
    } 
    catch (error) {
        console.error('❌ Error writing log:', error.message);
    }
};

app.use(express.static(path.join(__dirname, 'public')));

app.get(/^\/$|\/index(\.html)?$/, async (req, res) => {
    await createFiles('Visited Home Page', 'accessLog.txt');
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get(/^\/images(\.html)?$/, async (req, res) => {
    await createFiles('Visited Image Page', 'accessLog.txt');
    res.sendFile(path.join(__dirname, 'src', 'images.html'));
});

app.use(async (req, res, next) => {
    const skipExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg'];
    if (skipExtensions.some(ext => req.url.endsWith(ext))) {
        return next();
    }

    await createFiles('Visited 404 Page', 'accessLog.txt');
    res.status(404).sendFile(path.join(__dirname, 'src', '404.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
