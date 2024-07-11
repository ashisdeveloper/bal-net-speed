import dns from "dns";
import init_puppeteer from './puppeteerBrowser.util';
import { IInternetSpeedFast } from 'src/models/common/internet';
import axios, { isCancel, AxiosError } from 'axios';
import dotenv from "dotenv";
dotenv.config();

const convertToMpbs = (value: number, unit: string) => {
    // Before the webpage loads, value and unit are empty.
    if (!unit || !value) {
        return 0;
    }
    unit = unit.toLowerCase()
    switch (unit.toLowerCase()) {
        case 'gbps':
            return value * 1000;
        case 'mbps':
            return value;
        case 'kbps':
            return value / 1000;
        case 'bps':
            return value / 1000000;
        default:
            throw new Error(`Unknown speed unit: ${unit}`);
    }
};

async function lookupPromise() {
    return new Promise((resolve, reject) => {
        dns.lookup("fast.com", (err, address, family) => {
            if (err) reject(err);
            resolve(address);
        });
    });
};

const dnsLookup = async () => {
    let fineNet = false
    try {
        const address = await lookupPromise()
        // console.log('address', address)
        if (address) fineNet = true
    } catch (error) {
        if (error?.['code'] === 'ENOTFOUND') {
            console.log(`Please check your internet connection. Something happened ${JSON.stringify(error)}`)
        }
    }
    // console.log(fineNet)
    return fineNet
};

export const fastSpeedTest = async () => {
    let result: IInternetSpeedFast = {
        downloadSpeed: 0,
        uploadSpeed: 0,
        downloadUnit: 'Mbps',
        uploadUnit: 'Mbps',
        userLocation: '',
        userIp: '',
        isSuccess: false
    }
    let lkup = await dnsLookup()
    if (lkup) {
        const browser = await init_puppeteer()
        const page = await browser.newPage();
        try {

            await page.goto('https://fast.com');

            await page.waitForSelector('#show-more-details-link', { visible: true, timeout: 0 })
            await page.waitFor(1000)
            await page.click('#show-more-details-link')
            await page.waitFor(1000)
            await page.waitForSelector('#upload-value.succeeded', { visible: true, timeout: 0 })
            await page.waitFor(1000)

            result = await page.evaluate(() => {
                const $ = document.querySelector.bind(document);

                const dlVal = Number($('#speed-value')?.textContent || 0)
                const dlUnit = ($('#speed-units')?.textContent || '').trim()

                const upVal = Number($('#upload-value')?.textContent || 0)
                const upUnit = ($('#upload-units')?.textContent || '').trim()

                console.log(dlVal, dlUnit)
                console.log(upVal, upUnit)

                return {
                    downloadSpeed: dlVal,
                    downloadUnit: dlUnit,
                    uploadSpeed: upVal,
                    uploadUnit: upUnit,
                    userLocation: ($('#user-location')?.textContent || '').trim(),
                    userIp: ($('#user-ip')?.textContent || '').trim(),
                    isSuccess: Boolean(
                        $('#speed-value.succeeded') && $('#upload-value.succeeded')
                    )
                };
            });
        } catch (err) {
            console.error(' -> something went wrong!', err);
        } finally {
            await page.close();
            await browser.close();
            result.downloadSpeed = convertToMpbs(result.downloadSpeed, result.downloadUnit)
            result.uploadSpeed = convertToMpbs(result.uploadSpeed, result.uploadUnit)
            result.downloadUnit = 'Mbps'
            result.uploadUnit = 'Mbps'
        }
    }
    if (result?.isSuccess) {
        let bodyParams: any = {
            intNetLocUid: Number(process.env.APP_LOCATION),
            intNetDownload: result.downloadSpeed,
            intNetUpload: result.uploadSpeed,
            vchNetLog: JSON.stringify(result)
        }

        await axios.post(`http://${process.env.API_IP}:${process.env.API_PORT}/internet/update-internet-speed-test`, bodyParams)

        try {
            /* await fetch(`http://${process.env.API_IP}:${process.env.API_PORT}/internet/update-internet-speed-test`, {
                method: 'POST', body: JSON.stringify(bodyParams)
            }); */
        } catch (error) {
            console.log(error)
        }
    }

    return result
}

export const ooklaSpeedTest = async () => {
    let result: IInternetSpeedFast = {
        downloadSpeed: 0,
        uploadSpeed: 0,
        downloadUnit: 'Mbps',
        uploadUnit: 'Mbps',
        userLocation: '',
        userIp: '',
        isSuccess: false
    }
    let lkup = await dnsLookup()
    if (lkup) {

        const browser = await init_puppeteer()
        const page = await browser.newPage();
        try {

            await page.goto('https://www.speedtest.net');

            await page.waitForSelector('.start-text', { visible: true, timeout: 0 })
            await page.waitFor(1000)
            let isExist1 = await page.$("#onetrust-accept-btn-handler") != null
            if (isExist1) {
                await page.click('#onetrust-accept-btn-handler')
                await page.waitFor(2000)
            }
            await page.click('.start-text')
            await page.waitFor(1000)
            await page.waitForSelector('.audienceComponent', { visible: true, timeout: 0 })
            await page.waitFor(2000)

            console.log('OK')

            result = await page.evaluate(() => {
                const $ = document.querySelector.bind(document);

                const dlVal = Number($('.result-data-value.download-speed')?.textContent || 0)
                // const dlUnit = ($('.result-item-latencydown')?.textContent || '').trim()

                const upVal = Number($('.result-data-value.upload-speed')?.textContent || 0)
                // const upUnit = ($('.result-item-latencyup')?.textContent || '').trim()

                console.log(dlVal)
                console.log(upVal)
                let locArr: string[] = [
                    ($('.result-label.js-data-isp')?.textContent || '').trim(),
                    ($('.js-data-sponsor')?.textContent || '').trim(),
                    ($('.result-data.js-sponsor-name')?.textContent || '').trim(),
                ].filter(i => i)

                return {
                    downloadSpeed: dlVal,
                    downloadUnit: 'Mbps',
                    uploadSpeed: upVal,
                    uploadUnit: 'Mbps',
                    userLocation: locArr.join(', ').trim(),
                    userIp: ($('.result-data.js-data-ip')?.textContent || '').trim(),
                    isSuccess: Boolean(
                        ($('.result-data.js-sponsor-name')?.textContent || '').trim() != ''
                    )
                };
            });
        } catch (err) {
            console.error(' -> something went wrong!', err);
        } finally {
            await page.close();
            await browser.close();
            // result.downloadSpeed = convertToMpbs(result.downloadSpeed, result.downloadUnit)
            // result.uploadSpeed = convertToMpbs(result.uploadSpeed, result.uploadUnit)
            result.downloadUnit = 'Mbps'
            result.uploadUnit = 'Mbps'
        }
    }
    console.log(result)
    if (result?.isSuccess) {
        let bodyParams: any = {
            intNetLocUid: Number(process.env.APP_LOCATION),
            intNetDownload: result.downloadSpeed,
            intNetUpload: result.uploadSpeed,
            vchNetLog: JSON.stringify(result)
        }

        await axios.post(`http://${process.env.API_IP}:${process.env.API_PORT}/internet/update-internet-speed-test`, bodyParams)

        try {
            /* await fetch(`http://${process.env.API_IP}:${process.env.API_PORT}/internet/update-internet-speed-test`, {
                method: 'POST', body: JSON.stringify(bodyParams)
            }); */
        } catch (error) {
            console.log(error)
        }
    }

    return result
}