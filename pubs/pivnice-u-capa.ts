import * as dayjs from 'dayjs';
import * as Table from 'cli-table';
import * as colors from 'colors';
import Util from '../helpers/util';
import Pub from './pub';

class PivniceUCapa extends Pub {

    public constructor() {
        super('https://www.pivnice-ucapa.cz/denni-menu.php');
        console.log('==> Fetching the daily menu from Pivnice U Čapa\n');
    }

    public async parseMenu(date: dayjs.Dayjs): Promise<string> {
        const $ = await this.getHtmlPage();
        const dateElements = $('body').find('.listek .date');

        const menuDates = dateElements.map((idx, el) => 
            $(el).text().trim().split('. ').map(e => 
                Util.addTrailingZero(Number(e))).reverse().join('-'));

        if (!this.isDateInMenu(date, menuDates.get())) {
            throw new Error('Nothing found for today :(');
        }

        const menuRows = $('body').find('.listek > .row');

        const table = new Table({
            head: [colors.cyan('Hlavní chod'), colors.cyan('Cena')]
        });

        menuRows.map((idx, el) => {
            const day = $(el).find('.date').text().split('. ')[0];
            if (Number(day) === date.date()) {
                const offer = $(el).find('.cont');
                console.log(`Polévka: ${offer.children('.row-polevka').text().trim()}`);
                
                offer.children('.row-food').map((idx, el) => {
                    table.push([
                        $(el).find('.food').text().trim(), 
                        $(el).find('.price').text().trim()
                    ]);
                });
            }
        });

        console.log(table.toString());
        return 'Hi';
    }

    protected isDateInMenu(date: dayjs.Dayjs, menuDates: string[]): boolean {
        const dateInMenu = menuDates.find(d => date.isSame(dayjs(d), 'day'));
        return (dateInMenu) ? true : false;
    }

}

export default PivniceUCapa;
