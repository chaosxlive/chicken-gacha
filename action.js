let currState = 1;
let currType = 1;

let optCnt = +(window.localStorage.getItem('optCnt') || 11);
let usableCnt = optCnt;

const resize = () => {
    const body = document.querySelector('body');
    const w = window.innerWidth;
    const h = window.innerHeight;
    const r = 1366 / 1024;
    if (w * r > h) {
        body.style.width = `${h / r}px`;
        body.style.height = `${h}px`;
    } else {
        body.style.width = `${w}px`;
        body.style.height = `${w * r}px`;
    }

    const boxes = document.getElementsByClassName('box');
    const m = (Math.min(w, h) - 200) * 0.18;
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].style.width = `${m}px`;
        boxes[i].style.height = `${m}px`;
        boxes[i].style.lineHeight = `${m}px`;
        boxes[i].style.fontSize = `${m}px`;
    }
};

resize();

addEventListener("resize", () => resize());

const btnGo = document.getElementById('go-gacha');

const shine = document.getElementById('shine');

const pancake1 = document.getElementById('pancake_1');
const pancake2 = document.getElementById('pancake_2');

const type1 = document.getElementById('type-1');
const type10 = document.getElementById('type-10');

const closeBtn = document.getElementById('close-btn');
const result1 = document.getElementById('result-1');
const result10 = document.getElementById('result-10');
const result1boxes = result1.getElementsByClassName('box');
const result10boxes = result10.getElementsByClassName('box');

const opt = document.getElementById('options');
const optInputCnt = document.getElementById('input-cnt');

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const USABLE = (() => {
    const c = window.localStorage.getItem('usable');
    if (c) {
        return JSON.parse(c);
    }
    const v = {};
    for (let i = 0; i < 26; i++) {
        v[ALPHABET[i]] = true;
    }
    return v;
})();

optInputCnt.value = optCnt;
changeCnt();

let expired = 0;
let doubleTouch = function (e) {
    if (e.touches.length === 1) {
        if (!expired) {
            expired = e.timeStamp + 400
        } else if (e.timeStamp <= expired) {
            e.preventDefault()
            option()
            expired = null
        } else {
            expired = e.timeStamp + 400
        }
    }
}
document.getElementById('cmd').addEventListener('touchstart', doubleTouch);

function goGacha() {
    if (currState === 2) {
        return;
    }

    currState = 2;

    pancake1.classList.add('state-hide');
    pancake2.classList.remove('state-hide');

    const showing = setInterval(() => {
        shine.style.opacity = +shine.style.opacity + 0.01;
    }, 10);

    setTimeout(() => {
        clearInterval(showing);

        const hiding = setInterval(() => {
            shine.style.opacity = +shine.style.opacity - 0.02;
        }, 10);

        setTimeout(() => {
            clearInterval(hiding);

            setTimeout(() => {
                pancake1.classList.remove('state-hide');
                pancake2.classList.add('state-hide');

                result1boxes.item(0).textContent = randAlphabet(usableCnt);
                for (let i = 0; i < 10; i++) {
                    result10boxes.item(i).textContent = randAlphabet(usableCnt);
                }

                if (currType === 1) {
                    result1.classList.remove('hide');
                    closeBtn.classList.remove('hide');
                } else {
                    result10.classList.remove('hide');
                    closeBtn.classList.remove('hide');
                }
            }, 500);
        }, 500);
    }, 1 * 1000);
}

function closeAll() {
    currState = 1;
    closeBtn.classList.add('hide');
    result1.classList.add('hide');
    result10.classList.add('hide');
}

function switchType(type) {
    if (currState === 2) {
        return;
    }
    currType = type;
    if (currType === 1) {
        type10.classList.remove('type-active');
        type1.classList.add('type-active');
    } else {
        type1.classList.remove('type-active');
        type10.classList.add('type-active');
    }
}

function option() {
    if (currState === 2) {
        return;
    }
    const pwd = prompt('PWD:');
    if (pwd !== 'LOCO65') {
        return;
    }
    opt.classList.remove('hide');
}

function save() {
    opt.classList.add('hide');

    window.localStorage.setItem('optCnt', optCnt);
    window.localStorage.setItem('usable', JSON.stringify(USABLE));
}

function changeCnt() {
    optCnt = +optInputCnt.value;
    if (optCnt <= 0) {
        optInputCnt.value = 1;
        optCnt = 1;
    }
    if (optCnt > 26) {
        optInputCnt.value = 26;
        optCnt = 26;
    }
    const list = document.getElementById('usable-list');
    list.innerHTML = '';
    usableCnt = 0;
    for (let i = 0; i < optCnt; i++) {
        const e = document.createElement('div');
        e.classList.add('usable-box');
        if (!USABLE[ALPHABET[i]]) {
            e.classList.add('sold-out');
        }
        e.onclick = () => {
            USABLE[ALPHABET[i]] = !USABLE[ALPHABET[i]];
            if (USABLE[ALPHABET[i]]) {
                e.classList.remove('sold-out');
                usableCnt++;
            } else {
                e.classList.add('sold-out');
                usableCnt--;
            }
        };
        e.innerText = ALPHABET[i];
        list.appendChild(e);
        if (USABLE[ALPHABET[i]]) {
            usableCnt++;
        }
    }
}

function randInt(n) {
    let r = Math.floor(Math.random() * n);
    if (r === n) {
        r = 0;
    }
    return r;
}

function randAlphabet(n) {
    const r = randInt(n);
    let i = 0;
    let j = 0;
    do {
        if (USABLE[ALPHABET[i]]) {
            j++;
        }
        if (j > r) {
            return ALPHABET[i];
        }
        i++;
    } while (i < optCnt);
    return '-';
}
