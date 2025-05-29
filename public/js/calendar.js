
import {ids} from './domIDs.js';
import { classNames } from './classNames.js';
import { createBezierCurve  } from './utils.js';

let calendarScroll; // カレンダーのスクロールを制御するクラス

// 初期化
document.addEventListener('DOMContentLoaded', () => {

    calendarScroll = new CalendarScroll();

    // リロードボタンにクリックイベント追加
    const button = document.getElementById(ids.RELOAD_BUTTON);
    button.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.querySelector('.'+classNames.RELOAD_BUTTON_ROTATE_RIGHT).classList.add('hidden');
        btn.querySelector('.'+classNames.RELOAD_BUTTON_SPNNER).classList.remove('hidden');

        // 再読み込み
        reload(); 
        calendarScroll.init();

        btn.querySelector('.'+classNames.RELOAD_BUTTON_SPNNER).classList.add('hidden');
        btn.querySelector('.'+classNames.RELOAD_BUTTON_ROTATE_RIGHT).classList.remove('hidden');
        btn.disabled = false;
    });

    reload();
    calendarScroll.init();

    const container = document.getElementById(ids.CALENDAR_CONTAINER);
    container.addEventListener('wheel', (e) => { calendarScroll.scroll(e) });
});

// カレンダーのスクロールを制御するクラス
class CalendarScroll {
    constructor() {
        this.container = document.getElementById(ids.CALENDAR_CONTAINER);
        this.duration = 200;
    }

    init() {
        this.currentLine = 0;
        this.headHeight = document.querySelector('#calendar-container table thead').offsetHeight;
        this.currentTop = 0;
        this.numLines = document.querySelectorAll('#calendar-container table tbody tr').length; 

        this.animationFrame = null;
        this.bezierCurve = null;
        this.t = 0;
    }

    scroll(e) {
        e.preventDefault();

        const direction = e.deltaY > 0 ? 1 : -1;
        const nextLine = this.currentLine + direction;
        const next = document.getElementById(`line-${nextLine}`);
        if (!next) return;
        
        const current = document.getElementById(`line-${this.currentLine}`);
         
        if(direction < 0 || current.offsetTop - this.headHeight + this.container.clientHeight < this.container.scrollHeight) {
            this.currentLine = nextLine;
            this.scrollAnimation(next.offsetTop - this.headHeight);
        }
    }

    scrollAnimation(target){
        const position = this.container.scrollTop;
        let velocity = 0;

        if(this.animationFrame){
            cancelAnimationFrame(this.animationFrame);
            velocity = this.bezierCurve.v(this.t);
        }

        this.bezierCurve = createBezierCurve(position, velocity, target);
        this.t = 0;

        let lastTime = performance.now();

        const animate = (currentTime) => {
            const dt = currentTime - lastTime;
            lastTime = currentTime;

            this.t += dt / this.duration;
            const clampedT = Math.min(this.t, 1);

            const nextPosition = this.bezierCurve.p(clampedT);
            this.container.scrollTop = nextPosition;

            if (clampedT < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.animationFrame = null;
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }
}

// 再読み込み
// 結果を返す（成功, エラー）
function reload() {
    const fragment = document.createDocumentFragment();

    const firstDate = new Date(2025, 7, 1);
    const lastDate  = new Date(2025, 10, 0);

    let day = new Date(firstDate);
    day.setDate(day.getDate() - day.getDay());

    const weekdays = ['sun','','','','','','sat'];

    let line = 0;
    let month = firstDate.getMonth() + 1;
    while(day <= lastDate) {
        const tr = document.createElement('tr');
        tr.id = `line-${line}`;    // 行のインデックス 
        tr.dataset.month = month;  // 行の月
        fragment.appendChild(tr);

        weekdays.forEach((weekday) => {
            if(day.getDate() === 1) {
                month = day.getMonth() + 1;
                tr.dataset.month = month;
            }

            const td = document.createElement('td');
            tr.appendChild(td);

            const num = document.createElement('div');
            const info = document.createElement('div');
            const label = document.createElement('div');

            td.appendChild(num);
            td.appendChild(info);
            td.appendChild(label);

            num.className = weekday;
            num.textContent = day.getDate();

            info.textContent = '満室';

            day.setDate(day.getDate() + 1);
        });

        line++;
    }

    const body = document.getElementById(ids.CALENDAR_CELL_CONTAINER);
    body.innerHTML = '';
    body.appendChild(fragment);
}

// 予約データの取得
async function getReservations() {
    const res = await fetch('../api/get_booking.php');
}