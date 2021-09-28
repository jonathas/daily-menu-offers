import * as dayjs from 'dayjs';
import * as Table from 'cli-table';
import * as colors from 'colors';
import Util from '../helpers/util';
import Pub from './pub';

class PivniceUCapa extends Pub {

    public constructor() {
        super('https://www.pivnice-ucapa.cz/denni-menu.php');
        console.log('\n==> Fetching the daily menu from Pivnice U Čapa\n');
    }

    public async printMenu(date: dayjs.Dayjs): Promise<void> {
        const $ = await this.getHtmlPage();
        const dateElements = $('body').find('.listek .date');

        const menuDates = dateElements.map((idx, el) => 
            $(el).text().trim().split('. ').reverse().join('-'));

        if (!Util.isDateInMenu(date, menuDates.get())) {
            throw new Error('Nothing found for today :(');
        }

        const menuRows = $('body').find('.listek > .row');

        const table = new Table({
            head: [colors.cyan('Hlavní chod'), colors.cyan('Cena')]
        });

        menuRows.map((idx, el) => {
            const day = $(el).find('.date').text().split('. ')[0];
            if (Number(day) === date.date()) {
                const offers = $(el).find('.cont');
                console.log(`Polévka: ${offers.children('.row-polevka').text().trim()}`);
                
                offers.children('.row-food').map((idx, el) => {
                    table.push([
                        $(el).find('.food').text().trim(), 
                        $(el).find('.price').text().trim()
                    ]);
                });
            }
        });

        console.log(`${table.toString()}\n`);
    }
}

export default PivniceUCapa;
