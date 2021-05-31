'use strict'

const URL = 'https://baconipsum.com/api/?type=all-meat&paras=';
const textBox = document.querySelector('.text-box');
const numOfPar = document.querySelector('.num-of-par');
const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const modalclose = document.querySelector('.close-finished-result');
const cart = document.querySelector('#modal');
const layoutMsg = document.querySelector('.warning-message');
const speedInfo = document.querySelector('#speedo-info');
const accuracyInf = document.querySelector('#accuracy-info');
const regExp = /[а-яё]/i;

function get_text(numOfPar) {
    return fetch(`${URL}${numOfPar}`)
        .then(result => result.json()).catch(error => {
            console.log(error);
            return [];
        })
}

function render_text(numOfPar) {
    startButton.disabled = true;
    restartButton.disabled = true;
    get_text(numOfPar).then(res => {
        for (let i = 0; i < numOfPar; i++) {
            let p = document.createElement('p');
            for (let x = 0; x < res[i].length; x++) {
                p.insertAdjacentHTML('beforeend', `<span>${res[i][x]}</span>`)
            }
            textBox.append(p);
        }
        startButton.disabled = false;
    })
}

function startTyping() {
    let spanIndx = 0;
    let paragIndx = 0;
    let kdwnCount = 0;
    let trueCount = 0;
    let startTime = Date.now();
    textBox.children[paragIndx].children[spanIndx].classList.add('green');

    const handler = (ev) => {
        if (ev.key.length === 1) {
            layoutMsg.hidden = true;
            kdwnCount++;
            let targetSpan = textBox.children[paragIndx].children[spanIndx];
            targetSpan.classList.remove(...targetSpan.classList);
            if (targetSpan.textContent === ev.key) {
                let nextTarget;
                targetSpan.className = 'executed';
                trueCount++;
                if (targetSpan.nextSibling) {
                    spanIndx++;
                    nextTarget = targetSpan.nextSibling;
                } else if (textBox.children[paragIndx].nextSibling) {
                    paragIndx++;
                    spanIndx = 0;
                    nextTarget = textBox.children[paragIndx].children[spanIndx];
                } else {
                    finish(startTime, kdwnCount, trueCount);
                    return;
                }
                nextTarget.className = 'green';
            } else {
                if (regExp.test(ev.key)) {
                    layoutMsg.hidden = false;
                }
                targetSpan.className = 'red';
            }
            calcAccuracy(trueCount, kdwnCount);
            calcSpeed(trueCount, (Date.now() - startTime) / 1000);
        }
    }
    document.addEventListener('keydown', handler);
    return () => {
        document.removeEventListener('keydown', handler);
    }
}

function calcAccuracy(trueCount, clickCount) {
    accuracyInf.textContent = Math.round((trueCount / clickCount) * 100);
}

function calcSpeed(trueCount, time) {
    speedInfo.textContent = Math.round((trueCount / time) * 60);
}

function resetValues() {
    textBox.textContent = '';
    accuracyInf.textContent = '0';
    speedInfo.textContent = '0';
    unsubscribeCurrentTyping();
}

function finish(startTime, kdwnCount, trueCount) {
    let totalTime = (Date.now() - startTime) / (1000 * 60);
    cart.style.display = "block";
    document.querySelector('.time').textContent = totalTime.toFixed(2);
    document.querySelector('.mistakes').textContent = kdwnCount - trueCount;
    document.querySelector('.accuracy-final').textContent = accuracyInf.textContent;
    document.querySelector('.average-speed').textContent = Math.round(trueCount / totalTime);
    resetValues();
}

let unsubscribeCurrentTyping
startButton.addEventListener('click', () => {
    startButton.blur();
    startButton.disabled = true;
    restartButton.disabled = false;
    if (unsubscribeCurrentTyping) unsubscribeCurrentTyping()
    unsubscribeCurrentTyping = startTyping()
})

restartButton.addEventListener('click', () => {
    restartButton.blur();
    restartButton.disabled = true;
    startButton.disabled = false;
    resetValues();
    render_text(+numOfPar.value);
})

numOfPar.addEventListener('change', () => {
    startButton.disabled = false;
    resetValues();
    render_text(+numOfPar.value);
})

modalclose.addEventListener('click', () => {
    cart.style.display = "none";
})

textBox.addEventListener('click', () => {
    document.getElementById('mobile-input').focus()
})

render_text(+numOfPar.value);