
// 要注意: カレンダー他の付きの日付せるID重複
// 保留: createCalendarFragment()が毎回同じHTMLを返すが、reload時に破棄せず、tdの中身だけ破棄した方が効率的か
// 次　: ラベル、
// 次他: エラーぺージの表示
	
import {config} from './config';

import {ids} from './domIDs';
import {dateString} from './dateUtils';

import { Selection } from './selection';

const selection = new Selection();

document.addEventListener('DOMContentLoaded', () => {
    selection.add(ids.CALENDAR_LOADING);
    selection.add(ids.CALENDAR_SERVER_ERROR)
    selection.add(ids.CALENDAR_OUT_OF_PERIOD);
    selection.add(ids.CALENDAR_CONTAINER);

    reload(); // 初期読み込み
})

async function reload() {
    selection.show(ids.CALENDAR_LOADING);

    document.getElementById(ids.USER_RESERVATION_LIST).querySelector('ul').innerHTML = '';
    document.getElementById(ids.CALENDAR_CONTAINER).innerHTML = '';

    const data = await get_reservations(); // 予約データの取得

    if(data.status === 'error') {
        // エラー表示
        selection.show(ids.CALENDAR_SERVER_ERROR);
        return;
    }
    // データ取得成功

    // 前処理
    const isLogin = data.status === 'user'; 
    const dayinfo = {}; // 日付ごとの予約数を記録
    const userReservations = []; // ログインユーザーの予約のみ格納
    data.reservations.forEach(reservation => {
        if (isLogin && reservation.is_user === true) {
            userReservations.push(reservation);
        }
        const start = new Date(reservation.start_date);
        const end   = new Date(reservation.end_date);
        for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
            const dayString = `${day.getMonth()+1}-${day.getDate()}`;
            dayinfo[dayString] = (dayinfo[dayString] || 0) + 1;
        }
    });

    // カレンダー作成
    document.getElementById(ids.CALENDAR_CONTAINER).appendChild(createCalendarFragment(dayinfo, userReservations));
    // ユーザー予約リスト作成
    // document.getElementById('user-reservatins-list').querySelector('ul').appendChild(createList(userReservations));

    // 表示
    selection.show(ids.CALENDAR_CONTAINER);
}

/**
 * データベースから予約情報を取得する関数
 * @returns {Promise<Reservations[]>} 予約情報の配列（JSONオブジェクト）
 */
async function get_reservations(){
    try {
        const res = await fetch('../api/get_reservations.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                start_date: dateString(config.startDate),
                end_date:  dateString(config.endDate)
            })
        });

        if(!res.ok) {
            throw new Error(`${res.statusText}`);
        }

        return await res.json(); 
    } catch (error) {
        return {status: 'error', message: error.message};
    }
}

/*月カレンダーの作成*/
/**
 * 
 * @returns {DocumentFragment}
 */
function createCalendarFragment(dayinfo, userReservations){
    const fragment = document.createDocumentFragment();
    const firstMonth = config.startDate.getMonth();
    const lastMonth  = config.endDate.getMonth();
    for(let month = firstMonth; month <= lastMonth; month++){ // 予約期間内の全ての月
        fragment.appendChild(createMonthCalendarElement(month, dayinfo));
    }
    return fragment;
}

// 日tdにイベントリスナー追加
function addDayEventListener(td){}

/**
 * 月テーブルの作成
 * 
 * 　ーーー
 * ｜　
 * 
 * @param {Number} month (0～11)
 * @return {Element} 
 */
function createMonthCalendarElement(month, dayinfo){
    const id = `m-${month + 1}`; // id="m-8"等
    
    const calendar = document.createElement('div');
    calendar.id = id;
    calendar.className = 'calendar-month';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = `${month + 1}月`;
    calendar.appendChild(title);

    const table = document.createElement('table');

    {
        // 曜日列
        
        const tr = document.createElement('tr');
        ["日","月","火","水","木","金","土"].forEach(weekday => {
            const th = document.createElement('th');
            th.className = weekday === '日' ? 'sun' : weekday === '土' ? 'sat' : '';
            th.textContent = weekday;
            tr.appendChild(th);
        });
        table.appendChild(tr);
    }

    {
        // 日セル

        const lastMonth = new Date(config.year, month - 1, 1).getMonth();
        const nextMonth = new Date(Config.year, month + 1, 1).getMonth();
        let day = new Date(config.year, month, 1);
        day.setDate(day.getDate() - day.getDay()); // カレンダーの最初の日

        for (let week = 0; week < 6; week++) {
            if(day.getMonth() === nextMonth) break;

            const tr_dayColumn = document.createElement('tr');   /**単日情報 */
            const tr_labelColumn = document.createElement('tr'); /**複数日をまたぐ情報 : ラベル */
            for (let i = 0; i < 7; i++) {

                const td_day = document.createElement('td'); // 日
                td_day.id = `${id}-${day.getDate()}`; // id="m-07-19"
                addDayEventListener(td_day);
                {
                    const day_head = document.createElement('div'); // 日付
                    day_head.className = 'head ';
                    day_head.className += (day.getMonth() === lastMonth || day.getMonth() === nextMonth) ? 'mute' 
                                            : i === 0 ? 'sun' 
                                            : i === 6 ? 'sat' 
                                            : 'n';
                    day_head.textContent = `${day.getDate()}`;
                    td_day.appendChild(day_head);

                    const day_info = document.createElement('div'); // その日の予約情報
                    day_info.id = `${id}-${day.getDate()}-info`;
                    day_info.className = 'info';

                    // 空き状況
                    const numRemain = config.numRooms - (dayinfo[`${day.getMonth()+1}-${day.getDate()}`] || 0);
                    if(numRemain <= 0) {
                        day_info.textContent = '満室';
                    } else {
                        day_info.textContent = `空きあり(${numRemain})`;

                        if(numRemain > 3) day_info.classList.add('many');
                        else              day_info.classList.add('few');
                    }

                    td_day.appendChild(day_info);
                }
                tr_dayColumn.appendChild(td_day);

                const td_label = document.createElement('td');
                td_label.id = `${id}-${day.getDate()}-label`; // id="m-07-19"
                td_label.className = 'label';
                addDayEventListener(td_label);
                tr_labelColumn.appendChild(td_label);

                day.setDate(day.getDate() + 1);
            }
            table.appendChild(tr_dayColumn);
            table.appendChild(tr_labelColumn);
        }
    }

    calendar.appendChild(table);
    return calendar;
}

function createList(userReservations){
}