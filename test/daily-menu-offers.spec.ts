import * as dayjs from 'dayjs';
import DailyMenuOffers from '../daily-menu-offers';
import Util from '../helpers/util';
import PivniceUCapa from '../pubs/pivnice-u-capa';
const dateFormat = 'YYYY-MM-DD';

describe('# DailyMenuOffers', (): void => {
    it('should use today\'s date if no date is informed', () => {
        const today = dayjs();
        const dailyMenuOffers: any = new DailyMenuOffers();
        expect(today.format(dateFormat)).toEqual(dailyMenuOffers.date.format(dateFormat));
    });

    it('should use a date other than today if it\'s informed', () => {
        const date = '2021-09-29';
        const dailyMenuOffers: any = new DailyMenuOffers(date);
        expect(date).toEqual(dailyMenuOffers.date.format(dateFormat));
    });

    it('should identify a day is in the weekend', () => {
        const dailyMenuOffersWeekend: any = new DailyMenuOffers('2021-10-02');
        const dailyMenuOffersWeekday: any = new DailyMenuOffers('2021-10-01');

        expect(dailyMenuOffersWeekend.validateDate).toThrow('There is no daily menu in the weekend');
        expect(dailyMenuOffersWeekday.validateDate).not.toThrow();
    });

    it('should run successfully', async () => {
        const dailyMenuOffers: any = new DailyMenuOffers('2021-10-01');
        jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(PivniceUCapa, 'printMenu').mockImplementation();
        
        const utilSpy = jest.spyOn(Util, 'loadPubs').mockImplementation(async () => {
            return [PivniceUCapa];
        });
  
        await dailyMenuOffers.getOffers();

        expect(utilSpy).toHaveBeenCalled();
    });

    it('should not run if the date is in the weekend', async () => {
        const dailyMenuOffers: any = new DailyMenuOffers('2021-10-02');
        const consoleSpy = jest.spyOn(console, 'log');

        jest.spyOn(dailyMenuOffers, 'printHeader').mockImplementation();
        jest.spyOn(Util, 'loadPubs').mockImplementation();

        await dailyMenuOffers.getOffers();
      
        expect(consoleSpy).toHaveBeenCalledWith('There is no daily menu in the weekend :)\nPlease check again another day.');
      });
});
