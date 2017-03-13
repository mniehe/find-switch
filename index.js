// Count all of the links from the io.js build page
const jsdom = require("jsdom");
const webDriver = require('./web-driver');

const SOLD_OUT_MESSAGE = 'Sold Out';

(async function() {
  jsdom.env(
    "https://www.zoolert.com/ca/videogames/consoles/nintendo/switch/",
    [],
    function (err, window) {
      const rows = window.document.querySelectorAll('table#trackers tr');
      for (const row of rows) {
        const columns = row.querySelectorAll('td');
        if (columns.length > 0 && columns[1].firstChild !== undefined) {
          const url = columns[1].firstChild.href;
          const status = columns[2].textContent;
          const product = columns[1].textContent;
          const store = columns[0].textContent;

          if (store.match('Best') !== null) {
            webDriver.loadPage(url);
            break;
          }
          
          // if (status !== SOLD_OUT_MESSAGE && product.match('Grey') !== null) {
          //   console.log(`${product} now available at ${store}! [ ${url} ]`);
          //   webDriver.loadPage(url);
          // }
        }
      }
    }
  );
})();
