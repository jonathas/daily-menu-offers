import * as dayjs from 'dayjs';
import Veroni from '../pubs/veroni';
import { createReadStream } from 'fs';
import axios from 'axios';
import { Cheerio, CheerioAPI, Element } from 'cheerio';

jest.mock('axios');

let $: CheerioAPI;
const veroni: any = Veroni;
let dayElements: Cheerio<Element>;

describe('# Veroni', (): void => {
    beforeAll(async () => {
        const menuPage = createReadStream(`${__dirname}/mocks/veroni.html`);
        (axios as any).request.mockResolvedValue({ data: menuPage });
        $ = await veroni.getHtmlPage(true);
        dayElements = $('body').find('.obsah .menicka');
    });

    it('should not throw if the date exists in the menu', () => {
        expect(() => veroni.validateDate($, dayElements, dayjs('2021-09-30'))).not.toThrow();
    });

    it('should throw if the date doesnt exist in the menu', () => {
        expect(() => veroni.validateDate($, dayElements, dayjs('2021-10-10'))).toThrow();
    });

    it('shold not print the menu if the date is not found', async () => {
        jest.spyOn(console, 'log').mockImplementation();
        await veroni.printMenu(dayjs('2021-10-10'));
        expect(() => veroni.validateDates($, dayjs('2021-10-10'))).toThrow();
    });

    it('should print the menu', async () => {
        jest.spyOn(console, 'log').mockImplementation();
        const getDayElementsSpy = jest.spyOn(veroni, 'getDayElements').mockImplementation(() => dayElements);
  
        await veroni.printMenu(dayjs('2021-09-30'));


        await veroni.printMenu(dayjs('2021-10-05'));

        expect(getDayElementsSpy).toHaveBeenCalled();
    });

    it('should not print the menu when it is empty', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
  
        veroni.weHaveFoodToday = false;
        await veroni.printMenu(dayjs('2021-10-05'));

        expect(consoleSpy).toHaveBeenCalledWith('Nothing found for today :(');
    });
});
