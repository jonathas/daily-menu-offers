import { CheerioAPI, Cheerio, Element, BasicAcceptedElems } from 'cheerio';
import * as dayjs from 'dayjs';
import * as Table from 'cli-table';
import * as colors from 'colors';
import Pub from './pub';
import Util from '../helpers/util';

class Veroni extends Pub {
    private soupsTable: Table;
    private mainDishesTable: Table;
    private weHaveFoodToday = false;

    public constructor() {
        super('https://www.menicka.cz/4921-veroni-coffee--chocolate.html');
        this.initializeTables();
    }
    
    protected initializeTables(): void {
        this.soupsTable = new Table({
            head: [colors.cyan('Polévky'), colors.cyan('Cena')],
            colWidths: [100, 10]
        });

        this.mainDishesTable = new Table({
            head: [colors.cyan('Hlavní chod'), colors.cyan('Cena')],
            colWidths: [100, 10]
        });
    }

    public async printMenu(date: dayjs.Dayjs): Promise<void> {
        try {
            console.log('\n==> Fetching the daily menu from Veroni\n');
            const $ = await this.getHtmlPage(true);
            const dayElements = $('body').find('.obsah .menicka');

            this.validateDate($, dayElements, date);

            dayElements.map((idx, el) => {
                const day = this.parseDate($, el).split('.')[0];
                if (Number(day) === date.date()) {
                    this.parseSoups($, el);
                    this.parseMainDishes($, el);
                }
            });

            if (this.weHaveFoodToday) {
                console.log(`${this.soupsTable.toString()}\n`);
                console.log(`${this.mainDishesTable.toString()}\n`);
            } else {
                console.log('Nothing found for today :(');
            }
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
        return $(el).find('.nadpis').text().split(' ')[1];
    }

    private parseSoups($: CheerioAPI, el: BasicAcceptedElems<Element>): void {
        const soups = $(el).find('.polevka');

        soups.map((idx, el) => {
            if ($(el).children().hasClass('polozka')) {
                const description = $(el).find('.polozka').text().trim();
                const price = $(el).find('.cena').text().trim();
                this.soupsTable.push([description, price]);
                this.weHaveFoodToday = true;
            }
        });
    }
    
    protected parseMainDishes($: CheerioAPI, el: BasicAcceptedElems<Element>): void {
        const mainDishes = $(el).find('.jidlo');
        
        mainDishes.map((idx, el) => {
            const descriptionElement = $(el).find('.polozka');
            descriptionElement.find('.poradi').remove();
            const description = descriptionElement.text().trim();
            const price = $(el).find('.cena').text().trim();
            this.mainDishesTable.push([description, price]);
        });
    }

}

export default new Veroni();
