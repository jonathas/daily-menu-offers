import DailyMenuOffers from './daily-menu-offers';
import { argv } from 'yargs';
const dailyMeuOffers = new DailyMenuOffers((argv.date) ? String(argv.date) : '');
dailyMeuOffers.getOffers();