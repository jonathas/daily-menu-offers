# Daily Menu Offers

[![Coverage Status](https://coveralls.io/repos/github/jonathas/daily-menu-offers/badge.svg?branch=develop)](https://coveralls.io/github/jonathas/daily-menu-offers?branch=develop)

What are my favourite pubs/restaurants serving today?

Every pub presents information about its daily or weekly menu somewhere on the web.
This script finds out and presents information about what each of the restaurants below is cooking today (it also includes soups).
The information is printed to the console.

It's good to know what's being cooked when you don't know what you're craving.

![Screenshot](./screenshot.png "screenshot")

## Running

- Install yarn if you don't have it
- Run the command to install the packages:

```bash
yarn install
```

- Run the script (today's date):

```bash
yarn start
```

- Optional: Run the script (specifying a date):

```bash
yarn start --date 2021-10-01
```

Ps: The date format must be YYYY-MM-DD

## Testing

In order to run the tests, run the following command:

```bash
yarn test
```

## Pubs

- [Pivnice U Čapa](https://www.pivnice-ucapa.cz/denni-menu.php)
- [Suzie's Steak Pub](http://www.suzies.cz/poledni-menu)
- [Veroni Cafe](https://www.menicka.cz/4921-veroni-coffee--chocolate.html)
