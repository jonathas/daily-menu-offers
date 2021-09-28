import * as dayjs from 'dayjs';

class Util {

    public isDateInMenu(date: dayjs.Dayjs, menuDates: string[]): boolean {
        const dateInMenu = menuDates.find(d => date.isSame(dayjs(d), 'day'));
        return (dateInMenu) ? true : false;
    }

}

export default new Util();
