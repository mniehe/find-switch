var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

async function loadPage(url) {
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    driver.get(url);

    if (url.match('bestbuy') !== null) {
        handleBestBuy(driver);
    } else {
        handleGeneric(driver);
    }
}

async function handleBestBuy(driver) {
    const CART_BUTTON_ID = 'btn-cart';

    try {
        const button = await driver.wait(until.elementLocated(By.id(CART_BUTTON_ID)), 10000);
        const classNames = await button.getAttribute('class');
        if (classNames.match('disabled') === null) {
            await button.click();
        } else {
            driver.quit();
        }
    } catch (error) {
        console.error('OH NO', error);
    }
}

async function handleGeneric(driver) {

}

module.exports = { loadPage };