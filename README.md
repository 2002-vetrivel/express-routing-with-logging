# Express File Logger

A simple Express.js application that demonstrates route handling, static file serving, and custom logging using Node.js filesystem (`fs`) and `date-fns`.

---

## Features
- Logs every page visit (Home, Images, and 404 page)
- Stores logs in a `logs/accessLog.txt` file
- Automatically creates a `logs` folder if it doesn’t exist
- Uses `date-fns` for neat timestamp formatting
- Handles 404 pages with a clean response

---

## Technologies Used
- **Node.js**
- **Express.js**
- **date-fns**
- **fs / fs.promises**

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/express-file-logger.git

# Go inside the folder
cd express-file-logger

# Install dependencies
npm install
