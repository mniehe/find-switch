// Count all of the links from the io.js build page
const jsdom = require("jsdom");
const webDriver = require('./web-driver');
const bestBuy = require('./bestbuy');
const request = require('request');

const SOLD_OUT_MESSAGE = 'Sold Out';
const THIRTY_SECONDS = 30000;

function processPage(err, window) {
  const rows = window.document.querySelectorAll('table#trackers tr');
  for (const row of rows) {
    const columns = row.querySelectorAll('td');
    if (columns.length > 0 && columns[1].firstChild !== undefined) {
      const url = columns[1].firstChild.href;
      const status = columns[2].textContent;
      const product = columns[1].textContent;
      const store = columns[0].textContent;

      // For testing
      // if (store.match('Amazon') !== null) {
      //   webDriver.loadPage(url);
      //   break;
      // }
      
      if (status !== SOLD_OUT_MESSAGE && product.match('Grey') !== null) {
        console.log(`${product} now available at ${store}! [ ${url} ]`);
        webDriver.loadPage(url);
      }
    }
  }
}

function checkZoolert(productURL) {
  jsdom.env(productURL, [], processPage);
}

// // Bind URL for the switch for now and call it for the initial time
console.log('Starting zoolert checker');
const zoolertSwitch = checkZoolert.bind(null, 'https://www.zoolert.com/ca/videogames/consoles/nintendo/switch/');
zoolertSwitch();

// // Check zoolert every thirty seconds
const zoolertLoop = setInterval(zoolertSwitch, THIRTY_SECONDS);
const bestBuyLook = setInterval(bestBuy.checkSwitch, THIRTY_SECONDS);
