/**
 * MyBCABus
 * 
 * MyBCABus refactored to be more efficient and maintainable
 * IE (both mobile and desktop) and Opera mobile do not support the Fetch API
 * 
 * @since 1.0
 * @version 1.1
 * @author Sam Olaogun
 */
'use strict';

// PUBLIC
const KEY = '1tJllDysWV5Xn9C7MKlVDttPXp2jXuQCYLP3jbf4FW28';
const SPREADSHEET_URL = `https://spreadsheets.google.com/feeds/list/${KEY}/od6/public/values?alt=json`;

/**
 * @class       MyBCABus
 * @description Recursively updates the view and polls for 
 *              new spreadsheet data.
 */
class MyBCABus {
    constructor() {
        this.firstRender = true;
        this.towns = {};
        this.inputElement = document.querySelector('.town__search');
        this.favoriteContainer = document.querySelector('.favorite__container');
        this.townContainer = document.querySelector('.town__container');

        // Begin local long-polling cycle
        this._poll();
    }

    get favorite() {
        return this.favoriteElement || void 0;
    }

    set favorite(element) {
        this.favoriteElement = element;

        if ('Storage' in window)
            localStorage.setItem('favorite', this.favoriteElement.dataset.town);
    }

    /**
     * @description Pull data from the spreadsheet on each render.
     * @async
     * @protected
     */
    async _poll() {
        const data = await fetch(SPREADSHEET_URL);
        const json = await data.json();

        // Populate towns
        json.feed.entry.forEach(entry => {
            if ('gsx$_cre1l' in entry && 'gsx$townsbuslocation_2' in entry)
                this.towns[entry.gsx$townsbuslocation_2.$t] = entry.gsx$_cre1l.$t;

            if ('gsx$_cokwr' in entry && 'gsx$townsbuslocation' in entry)
                this.towns[entry.gsx$townsbuslocation.$t] = entry.gsx$_cokwr.$t;
        });

        this._render();
        this._poll();
    }

    /**
     * @description Render the application state.
     * @protected
     */
    _render() {
        // PERF: Mount only on first render
        if (this.firstRender) {
            this.firstRender = false;
            Object.keys(this.towns).forEach(this._createTown, this);
        } else {
            document.querySelectorAll('.town').forEach(town =>
                town.children[1].textContent = this.towns[town.dataset.town]);

            this.inputElement.addEventListener('input', this._handleInput);
        }
    }

    /**
     * @description Handles search field value changes.
     * @callback    _handleInput
     * @protected
     */
    _handleInput() {

        document.querySelectorAll(`.town`).forEach(town =>
            town.style.display = 'flex');

        // Cheaply hide irrelevant towns
        // TODO: Change route to match query and push to history
        if (this.inputElement.value)
            document.querySelectorAll(`.town:not([data-town*="${input.value}" i])`).forEach(town =>
                town.style.display = 'none');
    }

    /**
     * @description               Creates town element on first render.
     * @param       {string} town the town name
     * @protected
     */
    _createTown(town) {
        const townElement = document.createElement('div');

        townElement.classList.add('town');
        townElement.dataset.town = town;
        townElement.insertAdjacentHTML('beforeend', `
            <span class="town__name">${town}</span>
            <span class="town__loc">${this.towns[town]}</span>
        `);

        townElement.addEventListener('click', _ => {
            if (this.favoriteElement) {
                this.favoriteContainer.removeChild(this.favoriteElement);
                this.townContainer.insertAdjacentElement('beforeend', this.favoriteElement);
            }

            this.favoriteContainer.insertAdjacentElement('beforeend', this.favoriteElement = townElement);
        });

        if (this.favorite === town)
            this.favoriteContainer.insertAdjacentElement('beforeend', this.favorite = townElement);
        else
            this.townContainer.insertAdjacentElement('beforeend', townElement);
    }
};

window.addEventListener('DOMContentLoaded', _ => new MyBCABus);

// TODO: Implement App Shell & Service Worker
// TODO: Configure Webhook
// TODO: Configure Routers