'use strict'

const URL = 'https://baconipsum.com/api/?type=all-meat&paras=';
const textBox = document.querySelector('.training-field__for-text');
let numOfPar = document.querySelector('.num_of_par');
const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
restartButton.disabled = true;

function get_text(numOfPar) {
    return fetch(`${URL}${numOfPar}`)
        .then(result => result.json()).catch(error => {
            console.log(error);
            return [];
        })
}

function render_text(numOfPar) {
    get_text(numOfPar).then(res => {
        for (let i = 0; i < numOfPar; i++) {
            let p = document.createElement('p');
            // for (let x = 0; x < res[i].length; x++) {
            //     p.insertAdjacentHTML('beforeend', `<span>${res[i][x]}</span>`)
            // }
            for (let x = 0; x < 10; x++) {
                p.insertAdjacentHTML('beforeend', `<span>${res[i][x]}</span>`)
            }
            textBox.append(p);
        }
    })
}

function startTyping() {
    let spanIndx = 0;
    let paragIndx = 0;
    let kdwnCount = 0;
    let trueCount = 0;
    let falseCount = 0;
    let startTime = Date.now();
    textBox.children[paragIndx].children[spanIndx].classList.add('green');

    const handler = (ev) => {
        if (ev.key.length === 1) {
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
                    finish(startTime, falseCount, trueCount);
                    return;
                }
                nextTarget.className = 'green';
            } else {
                targetSpan.className = 'red';
                falseCount++;
            }
            calcAccuracy(trueCount, kdwnCount);
            calcSpeed(trueCount, (Date.now() - startTime) / 1000)
        }
    }
    document.addEventListener('keydown', handler);
    return () => {
        document.removeEventListener('keydown', handler);
    }
}

function finish(startTime, falseCount, trueCount) {
    let cart = document.querySelector('#modal');
    let modalclose = document.querySelector('.close-finished-result');
    cart.style.display = "block";
    modalclose.addEventListener('click', () => {
        cart.style.display = "none";
    })
    document.querySelector('.time').textContent = ((Date.now() - startTime) / (1000 * 60)).toFixed(2);
    document.querySelector('.mistakes').textContent = falseCount;
    document.querySelector('.accuracy-final').textContent = document.querySelector('span[data-id="accuracy-info"]').textContent;
    document.querySelector('.average-speed').textContent = calcSpeed(trueCount, (Date.now() - startTime) / 1000);
    unsubscribeCurrentTyping();
    resetValues();
}

function calcAccuracy(trueCount, clickCount) {
    let accuracyInf = document.querySelector('span[data-id="accuracy-info"]');
    accuracyInf.textContent = Math.round((trueCount / clickCount) * 100);
}

function calcSpeed(trueCount, time) {
    let speedInfo = document.querySelector('span[data-id="speedo-info"]');
    let averageSpeed = [];
    let speed = Math.round((trueCount / time) * 60);
    averageSpeed.push(speed);
    speedInfo.textContent = speed;
    return averageSpeed.reduce((sum, a) => sum + a, 0) / averageSpeed.length;
}

function resetValues() {
    textBox.textContent = '';
    document.querySelector('span[data-id="accuracy-info"]').textContent = '0';
    document.querySelector('span[data-id="speedo-info"]').textContent = '0';
    if (document.querySelector('.green')) {
        document.querySelector('.green').classList = '';
    } else if (document.querySelector('.red')) {
        document.querySelector('.red').classList = '';
    }
    startButton.disabled = false;
}

render_text(+numOfPar.value);

numOfPar.addEventListener('change', () => {
    startButton.disabled = false;
    resetValues();
    render_text(+numOfPar.value);
})



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