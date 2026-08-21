import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('console', msg => console.log('LOG:', msg.type(), msg.text()));
        page.on('pageerror', err => console.log('ERR:', err));

        await page.goto('http://localhost:5174');
        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
