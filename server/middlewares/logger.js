// middlewares/logger.js

// Mapping ANSI escape codes
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

// Logger middleware function
module.exports = (req, res, next) => {
  // // Capture start time to calculate response time later
  const start = Date.now();

  // const uuid = req.headers['x-uuid'] || 'Unknown UUID';

  // Log the request details when the request starts
  // console.log(
  //   `${colors.cyan}[${new Date().toISOString()}]${colors.reset} ${
  //     colors.yellow
  //   }${req.method}${colors.reset} request from ${colors.green}${
  //     req.ip || uuid
  //   }${colors.reset} to ${colors.blue}${req.originalUrl}${colors.reset}`
  // );

  // Add a listener to the 'finish' event of the response to log response details
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Determine the color based on the status code
    let statusColor = colors.green; // Green for 2xx
    if (res.statusCode >= 300 && res.statusCode < 400) {
      statusColor = colors.yellow; // Yellow for 3xx
    } else if (res.statusCode >= 400) {
      statusColor = colors.red; // Red for 4xx and 5xx
    }

    console.log(
      `${colors.cyan}[${new Date().toISOString()}]${colors.reset} ${
        colors.yellow
      }${req.method}${colors.reset} ${colors.blue}${req.originalUrl}${
        colors.reset
      } from ${colors.green}${req.ip || uuid} - ${statusColor}${
        res.statusCode
      }${colors.reset} ${colors.magenta}(Duration: ${duration}ms)${
        colors.reset
      }`
    );
    // log error if any
    if (res.statusCode >= 400) {
      console.log(`${colors.red}Error: ${res.statusMessage}${colors.reset}`);
    }
  });

  next();
};
