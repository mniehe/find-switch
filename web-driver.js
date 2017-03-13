var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

async function loadPage(url) {
    const CART_BUTTON_ID = 'btn-cart';
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    driver.get(url);
    
    // try {
    //     const button = await driver.wait(until.elementLocated(By.id(CART_BUTTON_ID)), 10000);
    //     const isEnabled = await button.isEnabled();
    //     console.log('before', await driver.getCurrentUrl());
    //     await button.click();
    //     console.log('before', await driver.getCurrentUrl());
    // } catch (error) {
    //     console.error('OH NO', error);
    // }

    // driver.quit();
}

module.exports = { loadPage };