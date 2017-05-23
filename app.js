/**
 * MyBCABus
 * 
 * @since 1.0
 * @author Sam Olaogun
 * @description MyBCABus refactored to be more efficient and maintainable
 * IE (both mobile and desktop) and Opera mobile do not support the Fetch API
 */
'use strict'

// Public Key
const key = '1tJllDysWV5Xn9C7MKlVDttPXp2jXuQCYLP3jbf4FW28'
const url = `https://spreadsheets.google.com/feeds/list/${key}/od6/public/values?alt=json`

const input = document.querySelector('.town__search')
const townContainer = document.querySelector('.town__container')
const towns = {}

const favoriteTown = document.cookie.match(/favoriteTown\=*/)
console.log(favoriteTown)

const favoriteContainer = document.querySelector('.favorite__container')
let count = 0

function favorite(element, town) {
    if (element.dataset.favorite) {
        townContainer.append(element)
        delete element.dataset.favorite
    } else {
        element.dataset.favorite = 'true'
        document.cookie = `favoriteTown=${town}`
        favoriteContainer.append(element)
    }

    // Hack, does not work
    if (!count++) {
        favoriteContainer.style['marginTop'] = '.5rem'
        favoriteContainer.style['marginBottom'] = '.5rem'
    }
}

/**
 * Recursively updates the view
 * 
 * @constructor updateView
 * @param start {boolean} First mount
 * @param url {string} Google Spreadsheets API url
 */
(function updateView(start, url) {
    fetch(url)
        .then(data => data.json()
            .then(data => {
                data.feed.entry.forEach(entry => {
                    if ('gsx$_cre1l' in entry && 'gsx$townsbuslocation_2' in entry)
                        towns[entry.gsx$townsbuslocation_2.$t] = entry.gsx$_cre1l.$t

                    if ('gsx$_cokwr' in entry && 'gsx$townsbuslocation' in entry)
                        towns[entry.gsx$townsbuslocation.$t] = entry.gsx$_cokwr.$t
                })

                // Mount only the first update
                if (start) {
                    Object.keys(towns).forEach(town =>
                        townContainer.insertAdjacentHTML('beforeend', `
                            <div class="town" data-town="${town}" onClick="favorite(this, this.dataset.town)">\
                                <span class="town__name">${town}</span>\
                                <span class="town__loc">${towns[town]}</span>\
                            </div>
                        `)
                    )
                } else {
                    document.querySelectorAll('.town').forEach(town =>
                        town.children[1].textContent = towns[town.dataset.town])

                    input.addEventListener('input', () => {
                        // TODO: Change route to match query and push to history
                        document.querySelectorAll(`.town`).forEach(town =>
                            town.style.display = 'flex')

                        if (input.value)
                            document.querySelectorAll(`.town:not([data-town*="${input.value}" i])`).forEach(town =>
                                town.style.display = 'none')
                    })
                }

                updateView(false, url)
            })
        ).catch(() => document.write('No buses are here.'))
})(true, url)

// TODO: Implement App Shell (Service Worker)
// TODO: Configure Webhook
// TODO: Configure Routers
// TODO: Tail-call test