const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;
const fs = require('fs');
const fsPromises = require('fs').promises;
const { format } = require('date-fns');
const {v4 : uuid} = require('uuid');
    

app.use((request, response, next) => 
{
     console.log(`${request.method}  ${request.path}`);
     next();
})

app.use(express.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));


const createFiles = async (req, message, filename) => {
    const logFolder = path.join(__dirname, 'logs');
    const logFile = path.join(logFolder, filename);

    try {
        if (!fs.existsSync(logFolder)) {
            await fsPromises.mkdir(logFolder, { recursive: true });
        }

        const time = format(new Date(), "dd/MM/yyyy\tHH:mm:ss");
        const logData = `${time}\t${uuid()}\t${req.method}\t${req.header.origin}\t${req.url}\t${message}\n`;
        await fsPromises.appendFile(logFile, logData);
    } 
    catch (error) {
        console.error('Error writing log:', error.message);
    }
};

const one = (req, res, next) => {
    console.log('Function no one');
    next();
};

const two = (req, res, next) => {
    console.log('Function no two');
    next();
};

const three = (req, res, next) => {
    console.log('Function no three');
    res.send('Chained function is called!');
};


app.get(/^\/chain(.html)?$/, [one, two, three]);

app.use(express.static(path.join(__dirname, 'public')));

app.get(/^\/$|\/index(\.html)?$/, async (req, res) => {
    await createFiles(req, 'Visited Home Page', 'accessLog.txt');
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get(/^\/images(\.html)?$/, async (req, res) => {
    await createFiles(req, 'Visited Image Page', 'accessLog.txt');
    res.sendFile(path.join(__dirname, 'src', 'images.html'));
});

app.use(async (req, res, next) => {
    const skipExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg'];
    if (skipExtensions.some(ext => req.url.endsWith(ext))) {
        return next();
    }

    await createFiles(req, 'Visited 404 Page', 'accessLog.txt');
    res.status(404).sendFile(path.join(__dirname, 'src', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});


