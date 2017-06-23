'use strict';

import { SPREADSHEET_URL } from './Constants';

/**
 * @class       
 * @classdesc Recursively updates the view and locally
 *            long-polls for new spreadsheet data.
 */
export default class MyBCABus {
    constructor() {
        this.firstRender = true;
        this.towns = {};
        this.inputElement = document.querySelector('.town__search');
        this.favoriteContainer = document.querySelector('.favorite__container');
        this.townContainer = document.querySelector('.town__container');

        this._handleInput = this._handleInput.bind(this);
        this._poll();
    }

    /** @returns {Object} town element */
    get favorite() { return this.favoriteElement; }

    set favorite(element) {
        if (this.favoriteElement) {
            this.favoriteContainer.removeChild(this.favoriteElement);
            this.townContainer.insertAdjacentElement('beforeend', this.favoriteElement);
        }

        this.favoriteElement === element ?
            this.favoriteElement = void 0 :
            this.favoriteContainer.insertAdjacentElement('beforeend', this.favoriteElement = element);

        if ('Storage' in window)
            localStorage.setItem('favorite', void(!this.favoriteElement || this.favoriteElement.dataset.town));
    }

    /**
     * @desc Pull data from the spreadsheet on each render.
     * @async
     * @protected
     */
    async _poll() {
        const data = await fetch(SPREADSHEET_URL);
        const json = await data.json();

        // Populate the state
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
     * @desc Render the application state.
     * @protected
     */
    _render() {
        if (this.firstRender) {
            this.firstRender = false;
            this.townList = document.querySelectorAll('.town');
            Object.keys(this.towns).forEach(this._createTown, this);
        } else {
            this.townList.forEach(townElement => {
                const town = townElement.dataset.town;
                const townLocationElement = townElement.children[1];
                townLocationElement.textContent = this.towns[town];
            });

            this.inputElement.addEventListener('input', this._handleInput);
        }
    }

    /**
     * @description Handles search field value changes.
     * @protected
     */
    _handleInput() {
        document.querySelectorAll('.town').forEach(town => town.style.display = 'flex');

        // Cheaply hide irrelevant towns
        if (this.inputElement.value)
            document.querySelectorAll(`.town:not([data-town*="${this.inputElement.value}" i])`).forEach(town =>
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

        townElement.addEventListener('click', () => this.favorite = townElement);

        if ('Storage' in window && localStorage.getItem('favorite') === town)
            this.favorite = townElement;
        else
            this.townContainer.insertAdjacentElement('beforeend', townElement);
    }
}