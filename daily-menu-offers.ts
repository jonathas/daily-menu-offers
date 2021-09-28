import * as figlet from 'figlet';

class DailyMenuOffers {

    public constructor() {
        this.printHeader();
    }

    private printHeader() {
        console.log(figlet.textSync('Daily Menu Offers', { 'horizontalLayout': 'full' }));
    }

}

export default DailyMenuOffers;
