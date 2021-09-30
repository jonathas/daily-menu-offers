import DailyMenuOffers from './daily-menu-offers';
import { argv } from 'yargs';
new DailyMenuOffers((argv.date) ? String(argv.date) : '');