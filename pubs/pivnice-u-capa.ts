import * as dayjs from 'dayjs';
import * as Table from 'cli-table';
import * as colors from 'colors';
import Util from '../helpers/util';
import Pub from './pub';
import { Cheerio, CheerioAPI, Element } from 'cheerio';

class PivniceUCapa extends Pub {
    private mainDishesTable: Table;

    public constructor() {
        super('https://www.pivnice-ucapa.cz/denni-menu.php');
        this.initializeTables();
    }

    protected initializeTables(): void {
        this.mainDishesTable = new Table({
            head: [colors.cyan('Hlavní chod'), colors.cyan('Cena')],
            colWidths: [100, 10]
        });
    }

    public async printMenu(date: dayjs.Dayjs): Promise<void> {
        try {
            console.log('\n==> Fetching the daily menu from Pivnice U Čapa\n');
            const $ = await this.getHtmlPage();
            this.validateDates($, date);

            const menuRows = $('body').find('.listek > .row');
            menuRows.map((idx, el) => {
                const day = $(el).find('.date').text().split('. ')[0];
                if (Number(day) === date.date()) {
                    const offers = $(el).find('.cont');
                    console.log(this.getSoup($, offers));
                    this.parseMainDishes($, offers);
                }
            });

            console.log(`${this.mainDishesTable.toString()}`);
        } catch (err) {
            console.log(err.message);
        }
    }

    private validateDates($: CheerioAPI, date: dayjs.Dayjs): void {
        const dateElements = $('body').find('.listek .date');
        const menuDates = dateElements.map((idx, el) => 
            $(el).text().trim().split('. ').reverse().join('-'));

        if (!Util.isDateInMenu(date, menuDates.get())) {
            throw new Error('Nothing found for today :(');
        }
    }

    private getSoup($: CheerioAPI, el: Cheerio<Element>): string {
        return `Polévka: ${el.children('.row-polevka').text().trim()}\n`;
    }

    protected parseMainDishes($: CheerioAPI, el: Cheerio<Element>): void {
        el.children('.row-food').map((idx, el) => {
            this.mainDishesTable.push([
                $(el).find('.food').text().trim(), 
                $(el).find('.price').text().trim()
            ]);
        });
    }
}

export default new PivniceUCapa();
