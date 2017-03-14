const request = require('request');
const webDriver = require('./web-driver');

const switchURL = 'http://api.bestbuy.ca/availability/products?callback=apiAvailability&accept-language=en&skus=10381161&accept=application%2Fvnd.bestbuy.standardproduct.v1%2Bjson&postalCode=M5G2C3&maxlos=3';

function checkStock(sku, URL) {
  const availability = `http://api.bestbuy.ca/availability/products?callback=apiAvailability&accept-language=en&skus=${sku}&accept=application%2Fvnd.bestbuy.standardproduct.v1%2Bjson&postalCode=M5G2C3&maxlos=3`
  request(switchURL, (err, response, body) => {
    const results = body.match('apiAvailability\\((.*)\\);');

    if (results === null) {
      console.log('No results found for bestbuy api.');
      return;
    }

    const data = JSON.parse(results[1]);
    if (data.availabilities[0].shipping.purchasable) {
      webDriver.loadPage(URL);
    }
  });
}

function checkSwitch() {
  const switchSKU = '10381161';
  const switchURL = 'http://www.bestbuy.ca/en-ca/product/nintendo-switch-nintendo-switch-with-gray-joy-con-misc/10381161.aspx';
  checkStock(switchSKU, switchURL);
}

module.exports = { checkSwitch }