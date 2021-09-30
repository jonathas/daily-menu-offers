import * as figlet from 'figlet';
import * as dayjs from 'dayjs';
import Util from './helpers/util';

class DailyMenuOffers {
    private date: dayjs.Dayjs;

    public constructor(date = '') {
        this.date = (date) ? dayjs(date) : dayjs();
    }

    public async getOffers(): Promise<void> {
        try {
            this.printHeader();
            this.validateDate();
            const pubs = await Util.loadPubs();
            for (const pub of pubs) {
                await pub.printMenu(this.date);
                console.log(`\n${'-'.repeat(process.stdout.columns)}`);
            }
        } catch (err) {
            console.log(err.message); 
        }
    }

    private printHeader(): void {
        console.log(figlet.textSync('Daily Menu Offers', { horizontalLayout: 'full' }));
        console.log(`\nDate: ${this.date.format('dddd, DD/MM/YYYY')}\n`);
        console.log('(Best viewed in full-screen)\n');
        console.log('-'.repeat(process.stdout.columns));
    }

    /**
     * 
     * 0 => Sunday, 6 => Saturday
     */
    private validateDate = (): void => {
        const dayOfTheWeek = this.date.day();
        if (dayOfTheWeek === 0 || dayOfTheWeek === 6) {
            throw new Error('There is no daily menu in the weekend :)\nPlease check again another day.');
        }
    }
}

export default DailyMenuOffers;
