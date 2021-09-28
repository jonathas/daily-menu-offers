import * as figlet from 'figlet';
import * as dayjs from 'dayjs';
import PivniceUCapa from './pubs/pivnice-u-capa';
import Suzies from './pubs/suzies';

class DailyMenuOffers {

    public constructor() {
        try {
            this.printHeader();
            const date = dayjs();
            console.log(`\nDate: ${date.format('dddd, DD/MM/YYYY')}\n`);
            console.log('(Best viewed in full-screen)');
            console.log('-'.repeat(process.stdout.columns));

            this.validateDate(date);

            const pub = new PivniceUCapa();
            pub.printMenu(date).then(data => {
                console.log('-'.repeat(process.stdout.columns));
            });

            /*const pub = new Suzies();
            pub.printMenu(date).then(data => {
                console.log('-'.repeat(process.stdout.columns));
            });*/
        } catch (err) {
           console.log(err.message); 
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
