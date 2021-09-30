import * as dayjs from 'dayjs';
import PivniceUCapa from '../pubs/pivnice-u-capa';
import { readFile } from 'fs';
import { promisify } from 'util';
import axios from 'axios';
import { CheerioAPI } from 'cheerio';
const read = promisify(readFile);

jest.mock('axios');

let menuPage = '';
let $: CheerioAPI;
const pivniceUCapa: any = PivniceUCapa;

describe('# Pivnice U Čapa', (): void => {
    beforeAll(async () => {
        menuPage = await read(`${__dirname}/mocks/pivnice_u_capa.html`, 'utf8');
        (axios as any).get.mockResolvedValue({ data: menuPage });
        $ = await pivniceUCapa.getHtmlPage();
    });

    it('should not throw if the date exists in the menu', () => {
        expect(() => pivniceUCapa.validateDates($, dayjs('2021-09-30'))).not.toThrow();
    });

    it('should throw if the date doesnt exist in the menu', () => {
        expect(() => pivniceUCapa.validateDates($, dayjs('2021-10-10'))).toThrow();
    });

    it('should get the soup', () => {
        const menuRows = $('body').find('.listek > .row');
        menuRows.map((idx, el) => {
            const day = $(el).find('.date').text().split('. ')[0];
            if (Number(day) === dayjs('2021-09-30').date()) {
                const offers = $(el).find('.cont');
                expect(pivniceUCapa.getSoup($, offers)).toContain('Polévka: ');
            }
        });
    });

    it('should print the menu', async () => {
        jest.spyOn(console, 'log').mockImplementation();
        const getSoupSpy = jest.spyOn(pivniceUCapa, 'getSoup').mockImplementation();
  
        await pivniceUCapa.printMenu(dayjs('2021-09-30'));

        expect(getSoupSpy).toHaveBeenCalled();
    });

    it('shold not print the menu if the date is not found', async () => {
        jest.spyOn(console, 'log').mockImplementation();
        await pivniceUCapa.printMenu(dayjs('2021-10-10'));
        expect(() => pivniceUCapa.validateDates($, dayjs('2021-10-10'))).toThrow();
    });
});
