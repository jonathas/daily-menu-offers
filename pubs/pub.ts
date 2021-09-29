import axios from 'axios';
import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { Dayjs } from 'dayjs';
import * as iconv from 'iconv-lite';
import * as https from 'https';

abstract class Pub {
    private url: string;

    public constructor(menuPageUrl: string) {
        this.url = menuPageUrl;
    }

    protected abstract initializeTables(): void;
    public abstract printMenu(date: Dayjs): Promise<void>;
    protected abstract getSoup($: CheerioAPI, el: Cheerio<Element>): string;
    protected abstract parseMainDishes($: CheerioAPI, el: Cheerio<Element>): void;

    protected async getHtmlPage(): Promise<CheerioAPI> {
        const html = await this.fetchHtml();
        return cheerio.load(html);
    }

    protected fetchLegacyEncodedHtml(): Promise<string> {
        return new Promise((resolve, reject) => {
            https.get(this.url, res => {
                (res as any).pipe(iconv.decodeStream('win1250'))
                    .collect((err: Error, decodedBody: string) => {
                        if (err) {
                            console.error(`ERROR: An error occurred while trying to fetch the URL: ${this.url}: ${err.message}`);
                            return reject('');
                        }
                        return resolve(decodedBody);
                });
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