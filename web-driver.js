const config = require('./config');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const TEN_SECONDS = 10000;

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

function pause(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds);
    });
}

async function handleBestBuy(driver) {
    const CART_BUTTON_ID = 'btn-cart';

    let shouldQuit = true;

    try {
        const addToCartButton = await driver.wait(until.elementLocated(By.id(CART_BUTTON_ID)), TEN_SECONDS);
        const classNames = await addToCartButton.getAttribute('class');

        if (classNames.match('disabled') === null) {
            shouldQuit = false;
            await addToCartButton.click();
            console.log('Added to basket. Loading basket...');
            await driver.wait(pause(100));
            await driver.get('https://www-ssl.bestbuy.ca/order/basket.aspx?');
            await driver.wait(until.titleMatches(/Your Cart/), TEN_SECONDS * 2);
            
            const checkoutButton = await driver.wait(until.elementLocated(By.css('div#ctl00_CP_Panel1 + div.btn-wrapper a')), TEN_SECONDS);
            console.log('Checkout button found. Attempting to click...');
            await checkoutButton.click();
            
            await driver.wait(until.titleMatches(/Secure Checkout/), TEN_SECONDS);

            if (config !== undefined) {
                driver.findElement(By.css('input[type=email]')).sendKeys(config.bestBuy.email);
                driver.findElement(By.css('input[type=password]')).sendKeys(config.bestBuy.password);
                driver.findElement(By.css('a#ctl00_CP_UcCheckoutSignInUC_btnSubmitOrder')).click();
            }
        }

    } catch (error) {
        console.error('Error with BestBuy purchase', error);
    }


    if (shouldQuit) {
        driver.quit();
    }
}

async function handleGeneric(driver) {

}

module.exports = { loadPage };