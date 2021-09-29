import cheerio, { CheerioAPI, Cheerio, Element, BasicAcceptedElems } from 'cheerio';
import * as dayjs from 'dayjs';
import * as Table from 'cli-table';
import * as colors from 'colors';
import Pub from './pub';
import Util from '../helpers/util';

class Veroni extends Pub {
    private soupsTable: Table;
    private mainDishesTable: Table;

    public constructor() {
        super('https://www.menicka.cz/4921-veroni-coffee--chocolate.html');
        this.initializeTables();
    }
    
    protected initializeTables(): void {
        this.soupsTable = new Table({
            head: [colors.cyan('Hlavní chod'), colors.cyan('Cena')],
            colWidths: [180, 10]
        });

        this.mainDishesTable = new Table({
            head: [colors.cyan('Hlavní chod'), colors.cyan('Cena')]
        });
    }

    public async printMenu(date: dayjs.Dayjs): Promise<void> {
        try {
            console.log('\n==> Fetching the daily menu from Veroni\n');
            const $ = await this.getHtmlPage(true);
            const dayElements = $('body').find('.obsah');

            dayElements.children('.menicka').map((idx, el) => {
                console.log($(el).html());
            });

            /*this.validateDate($, dayElements, date);

            dayElements.map((idx, el) => {
                const day = this.parseDate($, el).split('.')[0];
                if (Number(day) === date.date()) {
                    console.log(this.getSoup($, el));
                    this.parseMainDishes($, el);
                    this.parseDessert($, el);
                }
            });

            console.log(`${this.mainDishesTable.toString()}\n`);
            console.log(`${this.dessertTable.toString()}`);*/
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
    
    protected getSoup($: CheerioAPI, el: Cheerio<Element>): string {
        return `Polévka: ${$(el).children('div').eq(1).text().trim()}\n`;
    }
    
    protected parseMainDishes($: CheerioAPI, el: Cheerio<Element>): void {
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

}

export default new Veroni();
