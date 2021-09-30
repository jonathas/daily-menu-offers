import * as dayjs from 'dayjs';
import Util from '../helpers/util';
import Pub from '../pubs/pub';

describe('# Util', (): void => {
    it('should match the received date with one of the dates in the menu', () => {
        const datesInMenu = ['2021-9-30', '2021-10-1', '2021-10-2'];
        const result1 = Util.isDateInMenu(dayjs('2021-09-30'), datesInMenu);
        expect(result1).toBeTruthy();

        const result2 = Util.isDateInMenu(dayjs('2021-10-3'), datesInMenu);
        expect(result2).toBeFalsy();
    });

    it('should be loading instances of Pub', async () => {
        const pubs = await Util.loadPubs();
        expect(pubs[0]).toBeInstanceOf(Pub);
    });
});
