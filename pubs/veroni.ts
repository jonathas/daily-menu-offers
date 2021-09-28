import { CheerioAPI, Cheerio, Element } from 'cheerio';
import { Dayjs } from 'dayjs';
import Pub from './pub';

class Veroni extends Pub {

    public constructor() {
        super('https://www.menicka.cz/4921-veroni-coffee--chocolate.html');
        this.initializeTables();
    }
    
    protected initializeTables(): void {
        // console.log('Not yet implemented');
    }

    public async printMenu(date: Dayjs): Promise<void> {
        console.log('\n==> Fetching the daily menu from Veroni\n');
        console.log('Not yet implemented');
    }
    
    protected getSoup($: CheerioAPI, el: Cheerio<Element>): string {
        throw new Error('Method not implemented.');
    }
    
    protected parseMainDishes($: CheerioAPI, el: Cheerio<Element>): void {
        throw new Error('Method not implemented.');
    }

}

export default new Veroni();
