var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

async function loadPage(url) {
    const CART_BUTTON_ID = 'btn-cart';
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    driver.get(url);
    
    const button = await driver.wait(until.elementLocated(By.id(CART_BUTTON_ID)), 10000);
    const isEnabled = await button.isEnabled();

    if (!isEnabled) {
        driver.quit();
    }
}

module.exports = { loadPage };