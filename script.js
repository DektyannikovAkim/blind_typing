'use strict'

const URL = 'https://baconipsum.com/api/?type=meat-and-filler';

function get_text() {
    return fetch(`${URL}`)
        .then(result => result.json()).catch(error => {
            console.log(error);
            return [];
        })
}

function render_text(numOfPar) {
    get_text().then(res => {
        for (let i = 0; i < numOfPar; i++) {
            let p = document.createElement('p');
            for (let x = 0; x < res[i].length; x++) {
                p.insertAdjacentHTML('beforeend', `<span class="letter" data-num="${x}">${res[i][x]}</span>`)
            }
            textCont.append(p);
        }
    })
}

function startTyping() {

}

let textCont = document.querySelector('.training-field__for-text');

let numOfPar = document.querySelector('.num_of_par');

render_text(+numOfPar.value);

numOfPar.addEventListener('change', () => {
    textCont.textContent = '';
    render_text(+numOfPar.value);
})

let startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
    startTyping()
})