'use strict'

const URL = 'https://baconipsum.com/api/?type=meat-and-filler';

function get_text() {
    return fetch(`${URL}`)
        .then(result => result.json()).catch(error => {
            console.log(error);
            return [];
        })
}

function render_text(num_of_par) {
    get_text().then(res => {
        for (let i = 0; i < num_of_par; i++) {
            let p = document.createElement('p');
            for (let x = 0; x < res[i].length; x++) {
                p.insertAdjacentHTML('beforeend', `<span>${res[i][x]}</span>`)
            }
            textCont.append(p);
        }
    })
}

let textCont = document.querySelector('.training-field__for-text');

let num_of_par = document.querySelector('.num_of_par');

render_text(+num_of_par.value);

num_of_par.addEventListener('change', () => {
    textCont.textContent = '';
    render_text(+num_of_par.value);
})