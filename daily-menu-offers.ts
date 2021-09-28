import * as figlet from 'figlet';
import * as dayjs from 'dayjs';
import PivniceUCapa from './pubs/pivnice-u-capa';

class DailyMenuOffers {

    public constructor() {
        try {
            this.printHeader();
            const date = dayjs('2021-09-29');
            console.log(`\nDate: ${date.format('dddd, DD/MM/YYYY')}\n`);

            this.validateDate(date);
            const pub = new PivniceUCapa();
            pub.parseMenu(date);
        } catch (err) {
           console.error(err.message); 
        }
    }

    private printHeader() {
        console.log(figlet.textSync('Daily Menu Offers', { horizontalLayout: 'full' }));
    }

    /**
     * 
     * 0 => Sunday, 6 => Saturday
     */
    private validateDate(date: dayjs.Dayjs) {
        const dayOfTheWeek = date.day();
        if (dayOfTheWeek === 0 || dayOfTheWeek === 6) {
            throw new Error('There is no daily menu in the weekend :)\nPlease check again another day.');
        }
    }

}

export default DailyMenuOffers;
