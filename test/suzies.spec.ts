import * as dayjs from 'dayjs';
import Suzies from '../pubs/suzies';
import { readFile } from 'fs';
import { promisify } from 'util';
import axios from 'axios';
import { Cheerio, CheerioAPI, Element } from 'cheerio';
const read = promisify(readFile);

jest.mock('axios');

let menuPage = '';
let $: CheerioAPI;
const suzies: any = Suzies;
let dayElements: Cheerio<Element>;

describe('# Suzie\'s', (): void => {
    beforeAll(async () => {
        menuPage = await read(`${__dirname}/mocks/suzies.html`, 'utf8');
        (axios as any).get.mockResolvedValue({ data: menuPage });
        $ = await suzies.getHtmlPage();
        dayElements = $('body').find('.menu-pages .item');
    });

    it('should not throw if the date exists in the menu', () => {
        expect(() => suzies.validateDate($, dayElements, dayjs('2021-09-30'))).not.toThrow();
    });

    it('should throw if the date doesnt exist in the menu', () => {
        expect(() => suzies.validateDate($, dayElements, dayjs('2021-10-10'))).toThrow();
    });

    it('should get the soup', () => {
        const date = dayjs('2021-09-30');
        jest.spyOn(suzies, 'getDateFromPage').mockImplementationOnce(() => '2021-09-30');

        dayElements.map((idx, el) => {
            const day = suzies.parseDate($, el, date).split('.')[0];
            if (Number(day) === date.date()) {
                expect(suzies.getSoup($, el)).toContain('Polévka: ');
            }
        });
    });

    it('should print the menu', async () => {
        jest.spyOn(console, 'log').mockImplementation();
        const getSoupSpy = jest.spyOn(suzies, 'getSoup').mockImplementation();
  
        await suzies.printMenu(dayjs('2021-09-30'));

        expect(getSoupSpy).toHaveBeenCalled();
    });

    it('shold not print the menu if the date is not found', async () => {
        jest.spyOn(console, 'log').mockImplementation();
        await suzies.printMenu(dayjs('2021-10-10'));
        expect(() => suzies.validateDates($, dayjs('2021-10-10'))).toThrow();
    });
});
