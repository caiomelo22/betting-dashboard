# Frontend

To access the backend project, go to [Betting Dashboard: Back](https://github.com/caiomelo22/Betting-Dashboard-Back).

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:8080
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

## Overview
This project was made with the objective of tracking your betting history. In this plataform you can register your bets by selecting the league, teams, match date, bet value, bet odds, bet type (Moneyline or Total) and your prediction.


<img width="913" alt="4" src="https://user-images.githubusercontent.com/49076270/171308431-4faed0a0-3fc0-44fe-9cc0-6901cb5d14b1.PNG">


After you register your bets, you can check their result in the bets table, where the outcome of each bet is displayed.


<img width="895" alt="1" src="https://user-images.githubusercontent.com/49076270/171308542-a43e94e4-e9be-43a7-a4ee-222ba3ec11ed.PNG">


For the bets to receive an outcome, the result of the match must be registered in the matches table so the system can update the result of every bet related to that particular game. The only matches that are going to be displayed in this table are the ones that are yet to receive a result update.


<img width="892" alt="2" src="https://user-images.githubusercontent.com/49076270/171308819-36cb9e9a-5b6a-4cb4-b122-4be0d9b67236.PNG">


Finally, you can track your profit as the time passes in the bets dashboard. In this page, you can also edit the deposited value and check out other stats.


![Captura de tela 2022-08-01 144529](https://user-images.githubusercontent.com/49076270/182210251-1122db83-4eca-495a-96ea-ab029d1c2c9d.jpg)

