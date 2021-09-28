import * as dayjs from 'dayjs';
import { readdir } from 'fs';
import { sep } from 'path';
import * as util from 'util';
import Pub from '../pubs/pub';
const readDir = util.promisify(readdir);

class Util {

    public isDateInMenu(date: dayjs.Dayjs, menuDates: string[]): boolean {
        const dateInMenu = menuDates.find(d => date.isSame(dayjs(d), 'day'));
        return (dateInMenu) ? true : false;
    }

    public async loadPubs(): Promise<Pub[]> {
        const pubsPath = `${__dirname}${sep}..${sep}pubs`;
        const pubClasses = await readDir(pubsPath);

        const pubs: Pub[] = [];
        // eslint-disable-next-line security/detect-non-literal-require
        pubClasses.filter(p => p !== 'pub.ts').forEach(file => pubs.push(require(`${pubsPath}${sep}${file}`).default));

        return pubs;
    }

}

export default new Util();
