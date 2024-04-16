import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

export default async function init_puppeteer() {
    const browser = puppeteer.launch({
        headless: Number(process.env.isDev) === 1 ? false : true,
        args: [
            '--enable-features=NetworkService',
            '--autoplay-policy=user-gesture-required',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-domain-reliability',
            '--disable-extensions',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-setuid-sandbox',
            '--disable-speech-api',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--no-zygote',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain',

            "--no-sandbox",
            "--disable-infobars",
            '--disable-web-security',
            '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process',
            // '--start-maximized',
            // "--incognito",
            "--disable-gpu",
            "--disable-dev-profile",
        ],
        ignoreHTTPSErrors: true,
        ignoreDefaultArgs: ["--enable-automation"],
        // userDataDir: '../../tmpData'
    });
    return browser
}
/* let browser = init_puppeteer()

export const puppeteerBrowser = async () => {
    return await browser
}; */



