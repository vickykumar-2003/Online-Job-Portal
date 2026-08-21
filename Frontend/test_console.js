import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('http://localhost:5173');
        await new Promise(r => setTimeout(r, 2000));
        const html = await page.$eval('#root', (el) => el.innerHTML);
        console.log(html.length > 50 ? 'APP IS RENDERED SUCCESSFULLY' : 'APP IS BROKEN');
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
