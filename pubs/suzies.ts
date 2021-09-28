import * as dayjs from 'dayjs';
import * as Table from 'cli-table';
import * as colors from 'colors';
import Util from '../helpers/util';
import Pub from './pub';
import { BasicAcceptedElems, Cheerio, CheerioAPI, Element } from 'cheerio';

class Suzies extends Pub {
    private mainDishesTable: Table;
    private dessertTable: Table;

    public constructor() {
        super('https://www.suzies.cz/poledni-menu');
        this.initializeTables();
    }

    protected initializeTables(): void {
        this.mainDishesTable = new Table({
            head: [colors.cyan('Hlavní chod'), colors.cyan('Cena')],
            colWidths: [180, 10]
        });

        this.dessertTable = new Table({
            head: [colors.cyan('Dezert'), colors.cyan('Ks'), colors.cyan('Cena')]
        });
    }

    public async printMenu(date: dayjs.Dayjs): Promise<void> {
        try {
            console.log('\n==> Fetching the daily menu from Suzie\'s\n');
            const $ = await this.getHtmlPage();
            const dayElements = $('body').find('.menu-pages .item');

            this.validateDate($, dayElements, date);

            dayElements.map((idx, el) => {
                const day = this.parseDate($, el).split('.')[0];
                if (Number(day) === date.date()) {
                    console.log(this.getSoup($, el));
                    this.parseMainDishes($, el);
                    this.parseDessert($, el);
                }
            });

            console.log(`${this.mainDishesTable.toString()}\n`);
            console.log(`${this.dessertTable.toString()}`);
        } catch (err) {
            console.log(err.message);
        }
    }

    private validateDate($: CheerioAPI, dayElements: Cheerio<Element>, date: dayjs.Dayjs): void {
        const menuDates = dayElements.clone().map((idx, el) => 
        this.parseDate($, el)).get()
        .map(d => d.split('.').reverse().join('-'));

        if (!Util.isDateInMenu(date, menuDates)) {
            throw new Error('Nothing found for today :(');
        }
    }

    private parseDate($: CheerioAPI, el: BasicAcceptedElems<Element>): string {
        return $(el).find('h2').text().trim().split(' ')[1];
    }

    protected getSoup($: CheerioAPI, el: BasicAcceptedElems<Element>): string {
       return `Polévka: ${$(el).children('div').eq(1).text().trim()}\n`;
    }

    protected parseMainDishes($: CheerioAPI, el: BasicAcceptedElems<Element>): void {
        const mainDishes = $(el).children('div').slice(2, -1);

        mainDishes.map((idx, el) => {
            const price = $(el).find('.price').text();
            const descriptionElement = $(el).find('.uk-width-expand');
            const size = descriptionElement.find('span').text();
            descriptionElement.find('span').remove();
            const description = descriptionElement.text().trim();

            this.mainDishesTable.push([ (size) ? `${size} ${description}` : description, price ]);
        });
    }

    private parseDessert($: CheerioAPI, el: BasicAcceptedElems<Element>): void {
        const dessertElement = $(el).children('div').last();
        const pieces = $(dessertElement).find('span').text().trim();

        dessertElement.find('span').remove();
        const price = dessertElement.find('.price').text().trim();
        dessertElement.find('.price').remove();
        const dish = dessertElement.text().trim();

        this.dessertTable.push([dish, pieces, price]);
    }
}

export default new Suzies();
