const https = require('https');

async function createHttpsRequest(url, headers, data = null, timeout = 2000) {
  const options = {
    method: headers.method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    timeout
  };

  // incase request body was non null/empty
  if (data) {
    options.body = JSON.stringify(data);
  }

  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      const body = [];
      res.on('data', (chunk) => body.push(chunk));
      res.on('end', () => {
        const resString = Buffer.concat(body).toString();
        if (res.statusCode < 200 || res.statusCode > 299) {
          return reject(new Error(`HTTP status code ${res.statusCode}, response: ${resString}}`));
        }
        resolve(JSON.parse(resString));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request time out'));
    });

    req.end();
  });
}

module.exports = { createHttpsRequest };
