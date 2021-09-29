import axios from 'axios';
import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { Dayjs } from 'dayjs';
import * as iconv from 'iconv-lite';

abstract class Pub {
    private url: string;

    public constructor(menuPageUrl: string) {
        this.url = menuPageUrl;
    }

    protected abstract initializeTables(): void;
    public abstract printMenu(date: Dayjs): Promise<void>;
    protected abstract getSoup($: CheerioAPI, el: Cheerio<Element>): string;
    protected abstract parseMainDishes($: CheerioAPI, el: Cheerio<Element>): void;

    protected async getHtmlPage(legacy = false): Promise<CheerioAPI> {
        let html = '';
        if (legacy) {
            html = await this.fetchLegacyEncodedHtml();
        } else {
            html = await this.fetchHtml();
        }
        return cheerio.load(html);
    }

    protected async fetchLegacyEncodedHtml(): Promise<string> {
        const response = await axios.request({
            method: 'GET',
            url: this.url,
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            response.data.pipe(iconv.decodeStream('win1250'))
                .collect((err: Error, decodedBody: string) => {
                    if (err) {
                        console.error(`ERROR: An error occurred while trying to fetch the URL: ${this.url}: ${err.message}`);
                        return reject('');
                    }
                    return resolve(decodedBody);
            });
        });
    }

    private async fetchHtml(): Promise<string> {
        try {
            const response = await axios.get(this.url);
            return response.data;
        } catch (err) {
            console.error(`ERROR: An error occurred while trying to fetch the URL: ${this.url}: ${err.message}`);
            return '';
        }
    }
}

export default Pub;