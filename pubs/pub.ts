import axios from 'axios';
import cheerio, { CheerioAPI } from 'cheerio';
import { Dayjs } from 'dayjs';

abstract class Pub {
    private url: string;

    public constructor(menuPageUrl: string) {
        this.url = menuPageUrl;
    }

    protected async getHtmlPage(): Promise<CheerioAPI> {
        const html = await this.fetchHtml();
        return cheerio.load(html);
    }

    private async fetchHtml(): Promise<string> {
        try {
            const { data } = await axios.get(this.url);
            return data;
        } catch (err) {
            console.error(`ERROR: An error occurred while trying to fetch the URL: ${this.url}: ${err.message}`);
            return '';
        }
    }

    protected abstract printMenu(date: Dayjs): Promise<void>;
}

export default Pub;