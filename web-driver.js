const config = require('./config');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const TEN_SECONDS = 10000;

async function loadPage(url) {
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    console.log(`Loading url: ${url}`);
    driver.get(url);

    if (url.match('bestbuy') !== null) {
        console.log('Starting purchase process for BestBuy');
        handleBestBuy(driver);
    } else if (url.match('amazon') !== null) {
        console.log('Starting purchase process for Amazon');
        handleAmazon(driver);
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

async function handleAmazon(driver) {
    try {
        const CART_URL = 'https://www.amazon.ca/gp/cart/view.html/ref=nav_cart';
        const ADD_TO_CART_ID = 'add-to-cart-button';

        const addToCartButton = await driver.wait(until.elementLocated(By.id('add-to-cart-button')), TEN_SECONDS);
        await addToCartButton.click();
        await driver.wait(pause(100));

        console.log('')
        
        await driver.get(CART_URL);
        const checkoutButton = await driver.wait(until.elementLocated(By.css('input[name=proceedToCheckout]')), TEN_SECONDS);
        await checkoutButton.click();

        await driver.wait(until.titleMatches(/Sign In/), TEN_SECONDS);
        driver.findElement(By.css('input[type=email]')).sendKeys(config.amazon.email);
        driver.findElement(By.css('input[type=password]')).sendKeys(config.amazon.password);
        driver.findElement(By.css('input#signInSubmit')).click();
    } catch (error) {
        console.log('Error with amazon purchase', error);
    }
}

async function handleGeneric(driver) {

}

module.exports = { loadPage };