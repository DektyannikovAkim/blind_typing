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
                p.insertAdjacentHTML('beforeend', `<span class="letter">${res[i][x]}</span>`)
            }
            textCont.append(p);
        }
    })
}

function startTyping() {
    let spanCount = 0;
    let trueCount = 0;
    let clickCount = 0;
    let p = document.querySelector('p');
    p.childNodes[spanCount].classList.add('green');

    document.addEventListener('keydown', (ev) => {
        if (ev.key.length === 1) {
            if (p.childNodes[spanCount].textContent === ev.key) {
                p.childNodes[spanCount].classList = '';
                spanCount++;
                p.childNodes[spanCount].classList.add('green');
                calcAccuracy(++trueCount, ++clickCount);
            } else {
                p.childNodes[spanCount].classList.add('red');
                calcAccuracy(trueCount, ++clickCount);
            }
        }
    })

}

function calcAccuracy(trueCount, clickCount) {
    let accuracyInf = document.querySelector('span[data-id="accuracy-info"]');
    accuracyInf.textContent = Math.round((trueCount / clickCount) * 100);
}

let textCont = document.querySelector('.training-field__for-text');

let numOfPar = document.querySelector('.num_of_par');

render_text(+numOfPar.value);

numOfPar.addEventListener('change', () => {
    textCont.textContent = '';
    document.querySelector('span[data-id="accuracy-info"]').textContent = '';
    render_text(+numOfPar.value);
})

let startButton = document.querySelector('.start');


startButton.addEventListener('click', () => {
    startButton.blur();
    startButton.disabled = true;
    startTyping()
})