// My code is ugly :(
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let currState = 1;
let currType = 1;

const APP_PREFIX = 'CHICKEN_V1.1_';

let currTheme = window.localStorage.getItem(APP_PREFIX + 'theme') || 'chicken';

let optCnt = 1;
let usableCnt = optCnt;

const body = document.querySelector('body');

const resize = () => {
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
        boxes[i].style.lineHeight = `${m * 0.25}px`;
        boxes[i].style.fontSize = `${m * 0.25}px`;
    }
};

resize();

addEventListener("resize", () => resize());

const btnGo = document.getElementById('go-gacha');

const shine = document.getElementById('shine');

const chicken1 = document.getElementById('chicken_1');
const chicken2 = document.getElementById('chicken_2');

const type1 = document.getElementById('type-1');
const type5 = document.getElementById('type-5');
const type10 = document.getElementById('type-10');

const closeBtn = document.getElementById('close-btn');
const result1 = document.getElementById('result-1');
const result5 = document.getElementById('result-5');
const result10 = document.getElementById('result-10');
const result1boxes = result1.getElementsByClassName('box');
const result5boxes = result5.getElementsByClassName('box');
const result10boxes = result10.getElementsByClassName('box');

const opt = document.getElementById('options');
const optInputCnt = document.getElementById('input-cnt');
const historyList = document.getElementById('history-list');
const storedHistoryList = window.localStorage.getItem(APP_PREFIX + 'historyList');
if (storedHistoryList) {
    storedHistoryList.split(';').forEach(h => {
        const e = document.createElement('li');
        e.innerText = h;
        historyList.appendChild(e);
    });
}

const USABLE_CHICKEN = loadUsable('chicken');

function loadUsable(theme) {
    const c = (() => {
        if (theme === 'chicken') {
            return window.localStorage.getItem(APP_PREFIX + 'usable-chicken');
        }
    })();
    if (c) {
        return JSON.parse(c);
    }
    const v = {};
    for (let i = 0; i < 26; i++) {
        v[ALPHABET[i]] = true;
    }
    return v;
}

refreshOptCnt(currTheme);

function refreshOptCnt(theme) {
    if (theme === 'chicken') {
        optCnt = +(window.localStorage.getItem(APP_PREFIX + 'optCnt-chicken') || 6);
    }
    usableCnt = optCnt;
    optInputCnt.value = optCnt;
    changeCnt();
}

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
document.getElementById('logo').addEventListener('touchstart', doubleTouch);

function goGacha() {
    if (currState === 2) {
        return;
    }

    currState = 2;

    chicken1.classList.add('state-hide');
    chicken2.classList.remove('state-hide');

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
                chicken1.classList.remove('state-hide');
                chicken2.classList.add('state-hide');

                const removeAllResultClass = (ele) => {
                    for (const c of ALPHABET) {
                        ele.classList.remove(`result-code-${c}`);
                    }
                };
                let hs = [];
                if (currType === 1) {
                    const a = randAlphabet(usableCnt)
                    hs.push(a);
                    result1boxes.item(0).textContent = a;
                    removeAllResultClass(result1boxes.item(0));
                    result1boxes.item(0).classList.add(`result-code-${a}`);
                    result1.classList.remove('hide');
                    closeBtn.classList.remove('hide');
                } else if (currType === 5) {
                    for (let i = 0; i < 5; i++) {
                        const a = randAlphabet(usableCnt)
                        hs.push(a);
                        result5boxes.item(i).textContent = a;
                        removeAllResultClass(result5boxes.item(i));
                        result5boxes.item(i).classList.add(`result-code-${a}`);
                    }
                    result5.classList.remove('hide');
                    closeBtn.classList.remove('hide');
                } else {
                    for (let i = 0; i < 10; i++) {
                        const a = randAlphabet(usableCnt)
                        hs.push(a);
                        result10boxes.item(i).textContent = a;
                        removeAllResultClass(result10boxes.item(i));
                        result10boxes.item(i).classList.add(`result-code-${a}`);
                    }
                    result10.classList.remove('hide');
                    closeBtn.classList.remove('hide');
                }
                const e = document.createElement('li');
                e.innerText = `${new Date().toLocaleString()}: [${currTheme}] ${hs.sort().join(', ')}`;
                historyList.appendChild(e);
                if (historyList.childNodes.length > 10) {
                    historyList.removeChild(historyList.childNodes[0]);
                }
                window.localStorage.setItem(APP_PREFIX + 'historyList', Object.values(historyList.childNodes).map(n => n.innerText).join(';'));
            }, 500);
        }, 500);
    }, 1 * 1000);
}

function closeAll() {
    currState = 1;
    closeBtn.classList.add('hide');
    result1.classList.add('hide');
    result5.classList.add('hide');
    result10.classList.add('hide');
}

function switchType(type) {
    if (currState === 2) {
        return;
    }
    currType = type;
    if (currType === 1) {
        type1.classList.add('type-active');
        type5.classList.remove('type-active');
        type10.classList.remove('type-active');
    } else if (currType === 5) {
        type1.classList.remove('type-active');
        type5.classList.add('type-active');
        type10.classList.remove('type-active');
    } else {
        type1.classList.remove('type-active');
        type5.classList.remove('type-active');
        type10.classList.add('type-active');
    }
}

function option() {
    if (currState === 2) {
        return;
    }
    opt.classList.remove('hide');
}

function save() {
    opt.classList.add('hide');

    if (currTheme === 'chicken') {
        window.localStorage.setItem(APP_PREFIX + 'optCnt-chicken', optCnt);
        window.localStorage.setItem(APP_PREFIX + 'usable-chicken', JSON.stringify(USABLE_CHICKEN));
    }
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
    const USABLE = (() => {
        if (currTheme === 'chicken') {
            return USABLE_CHICKEN;
        }
    })();
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
    const USABLE = (() => {
        if (currTheme === 'chicken') {
            return USABLE_CHICKEN;
        }
    })();
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

function switchTheme(theme) {
    switch (theme) {
        case 'chicken':
            // body.classList.remove("");
            currTheme = 'chicken';
            window.localStorage.setItem(APP_PREFIX + 'theme', 'chicken');
            break;
        default:
            break;
    }
    refreshOptCnt(theme);
}
