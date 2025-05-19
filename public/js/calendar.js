
// 注意:
// 保留: createMonthCalendarHTML()が毎回同じHTMLを返すが、reload時に破棄せず、tdの中身だけ破棄した方が早いか
// 次　: 予約データの前処理、ラベル化、カレンダーに反映
// 次　: ラベルを貼り付けて伸ばす
// 次他: エラーぺージの表示

class Config {
    static numRooms = 9; // 部屋数
    static rooms = [2, 3, 4, 5, 6, 8, 9, 10, 11]; // 部屋番号
    static startDate = new Date('2025-07-15')
    static endDate   = new Date('2025-09-15');
    static year(){ return this.startDate.getFullYear() };
}

// 日付処理
class DateUtils{
    // 基準日
    static weekdays = ["日","月","火","水","木","金","土"];

    /**
     * 
     * @param {Date} date 
     * @returns {String} yy-mm-dd : mmは(1～12)
     */
    static dateString(date){
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 文字列の日付を比較
     * @param {String} a - 'yy-mm-dd' or 'mm-dd'
     * @param {String} b
     * @returns {Number} - a > b -> 1, a == b -> 0, a < b -> -1
     */
    static compare(a, b) {
        const parse = (str) => {
            const parts = str.split('-');
            if (parts.length === 3) parts.shift(); // 年を除去
            return parts.map(Number); // [mm, dd]
        };

        const [am, ad] = parse(a);
        const [bm, bd] = parse(b);

        if (am !== bm) return am > bm ? 1 : -1;
        if (ad !== bd) return ad > bd ? 1 : -1;
        return 0;
    }

    /**
     * a, bの日付の差（日数）を返す
     * @param {string} a - 'yyyy-mm-dd' or 'mm-dd'
     * @param {string} b
     * @returns {number} - a - b の日数差（負値あり）
     */
    static diff(a, b){
        const toDate = (str) => {
            const parts = str.split('-').map(Number);
            if(parts.length === 3) {
                return new Date(parts[0], parts[1] - 1, parts[2]);
            } else {
                return new Date(Config.year, parts[0] - 1, parts[1]);
            }
        };
        const dateA = toDate(a);
        const dateB = toDate(b);
        return Math.floor((dateA - dateB) / (1000 * 60 * 60 * 24));
    }
}

/**
 * @param {HTMLElement} month_viewer_container - 月表示用コンテナのDOM要素
 * @param {HTMLElement} week_viewer_container  - 週表示用コンテナのDOM要素
 * @param {HTMLElement} mode_select
 */
class Elements {

    static month_viewer_container;
    static week_viewer_container;
    static mode_select;
    static calendar_title;

    static clear(){
        this.month_viewer_container.innerHTML = '';
        this.week_viewer_container.innerHTML = '';
        this.setMode('month');
    }

    static monthDOM(){
        return this.month_viewer_container;
    }

    static weekDOM(){
        return this.week_viewer_container;
    }

    static modeSelectDOM(){
        return this.mode_select;
    }

    static calendar_titleDOM(){
        return this.calendar_title;
    }

    static mode(){
        return this.modeSelectDOM().value;
    }

    static setMode(mode){
        this.modeSelectDOM().value = mode;
        this.modeSelectDOM().dispatchEvent(new Event('change'));
    }

    static onChanged(){
        if (this.mode() === "month") {
            document.getElementById('prevBtn').textContent = '← 先月';
            document.getElementById('nextBtn').textContent = '翌月 →';
        } else if (this.mode() === "week") {
            document.getElementById('prevBtn').textContent = '← 先週';
            document.getElementById('nextBtn').textContent = '翌週 →';
        }
    }
}

// 月用ラベル
class LabelMonth {}

// 週用ラベル
class LabelWeek {}

/**
 * @param {String} start_date - yy-mm-dd
 * @param {String} end_date
 * @param {HTMLElement} start_cell - 予約用ラベルのDOM要素の初日(td)
 */
class ReservationLabel {
}

/**
 * ユーザーの予約情報
 * @param {ReservationLabel[]} labels
 */
class User {
    constructor(labels){
    }
}

const users = [];

function user_id(){
    return window.appConfig.userId;
}

function isAdmin(){
    return window.appConfig.isAdmin;
}

/**
 * 初期化
 * DOM要素の読み込み後
 */
document.addEventListener("DOMContentLoaded", () => {
    Elements.month_viewer_container = document.getElementById('month-viewer-container');
    Elements.week_viewer_container = document.getElementById('week-viewer-container');
    Elements.calendar_title = document.getElementById('calendar-title');
    Elements.mode_select = document.getElementById('modeSelect');
    Elements.modeSelectDOM().addEventListener('change', () => {Elements.onChanged();});
    reload();
});

/**
 * 再読み込み・描画
 */
async function reload(){
    // カレンダーの破棄
    clearCalendar();

    // ロード画面の表示

    // データ取得
    try {
        const data = await get_reservations_fromDB(DateUtils.dateString(Config.startDate), DateUtils.dateString(Config.startDate));
        if(data.status === 'error') throw new Error(data.message);
        handleReservationsData(data.reservations);
        
        // カレンダーのHTML作成
        Elements.monthDOM().innerHTML = createMonthCalendarHTML();
        Elements.weekDOM().innerHTML  = createWeekCalendarHTML();

        // ラベルをカレンダーに適用

        // 描画するカレンダーの選択

        // (test)最初の月を表示
        // document.getElementById(`m-${Config.year()}-8`).classList.remove('hidden');
    } catch(error) {
        console.error('データ取得エラー'+error.message);
        // エラー画面の表示
        renderReservationFetchError();
        // 接続エラー
        // 読み込み失敗エラー
        // 表示失敗エラー
    }
}

/**
 * データベースから予約情報を取得する関数
 * Adminでない場合、単位に分割して表示
 * @param {String} start_date - 開始日 (YYYY-MM-DD)
 * @param {string} end_date - 終了日 (YYYY-MM-DD)
 * @returns {Promise<Reservations[]>} 予約情報の配列（JSONオブジェクト）
 */
async function get_reservations_fromDB(start_date, end_date){
    const res = await fetch('../api/reservations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            start_date: start_date,
            end_date: end_date
        })
    });

    if(!res.ok) {
        throw new Error(res.status);
    }

    return await res.json(); 
}

/**
 * 予約データの処理
 * @param {Promise<Reservations[]>} reservations 予約情報の配列（JSONオブジェクト）
 */
function handleReservationsData(reservations){
}

/**
 * DBから予約データの取得に失敗したときにエラーメッセージを表示する
 */
function renderReservationFetchError() {
}

function clearCalendar() {
    Elements.clear(); // DOMのクリア
    users.length = 0;    // ユーザーデータのクリア
}

function showMonthCalendar(month){}
function hiddenMonthCalendar(month){}
function hiddenAllMonthCalendar(){}

function showWeekCalendar(){}
function hiddenWeekCalendar(){}

/*月カレンダーの作成*/

function createMonthCalendarHTML(){
    let html = '';
    const firstMonth = Config.startDate.getMonth();
    const lastMonth  = Config.endDate.getMonth();
    for(let month = firstMonth; month <= lastMonth; month++){ // 予約期間内の全ての月
        html += createMonthTableHTML(Config.year(), month, `${Config.year()}-${month + 1}`)
    }
    console.log(html);
    return html;
}
/**
 * 月テーブルの作成
 */
function createMonthTableHTML(year, month , yy_mm){
    const tdDefaultHTML = '読み込み中';
    
    const id = `m-${yy_mm}`; // id="m-2025-08"等

    let html = `<div id="${id}" class="calendar-month">`;

    html += '<table><thead><tr>';
    for (let i = 0; i < 7; i++) {
        html += `<th class="day-head${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}">${DateUtils.weekdays[i]}</th>`;
    }
    html += '</tr></thead><tbody>';

    const lastMonth = new Date(year, month - 1, 1).getMonth();
    const nextMonth = new Date(year, month + 1, 1).getMonth();
    let day = new Date(year,month,1);
    day.setDate(day.getDate() - day.getDay()); // カレンダーの最初の日

    for (let week = 0; week < 6; week++) {
        if(day.getMonth() === nextMonth) break;

        html += '<tr>';
        for (let i = 0; i < 7; i++) {
            if (day.getMonth() === lastMonth) {
                html += `<td id="${id}-${day.getDate()}">`; // id="m-2025-08-11"等
                html += `<div class="day-head mute">${day.getDate()}</div>`;
                html += `<div class="day-body">${tdDefaultHTML}</div>`;
                html += '</td>';
            } else if (day.getMonth() === nextMonth) {
                html += `<td id="${id}-${day.getDate()}">`;
                html += `<div class="day-head mute">${day.getDate()}</div>`;
                html += `<div class="day-body">${tdDefaultHTML}</div>`;
                html += '</td>';
            } else {
                html += `<td id="${id}-${day.getDate()}">`;
                html += `<div class="day-head${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}">${day.getDate()}</div>`;
                html += `<div class="day-body">${tdDefaultHTML}</div>`;
                html += '</td>';
            }
            day.setDate(day.getDate() + 1);
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    html += '</div>';
    return html;
}

/*週カレンダーの作成*/
function createWeekCalendarHTML(){
    const tdDefaultHTML = '読み込み中';

    let html = '<div class="calendar-week">';
    html += '<table><tr>';

    html += '<th></th>'; // 1行1列目
    // 1行目ヘッダーの作成
    for(let day = new Date(Config.startDate); day <= Config.endDate; day.setDate(day.getDate()+1)){
        const id = `w-${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`; // id="w-2025-07-02" 等
        const weekDays = DateUtils.weekdays[day.getDay()];
        html += `<th id="${id}"><div class="dayOfWeek">${weekDays}</div><div class="day">${day.getDate()}</div></th>`;
    }
    html += '</tr>';

    // 部屋セル
    for(let room = 0; room < Config.numRooms; room++){
        html += '<tr>';
        html += `<th>${Config.rooms[room]}</th>`; // 部屋番号
        for(let day = new Date(Config.startDate); day <= Config.endDate; day.setDate(day.getDate()+1)){
            const id = `w-${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}-${room}-2`; // id="w-2025-07-02-3-2" 等
            html += `<td id="${id}">${tdDefaultHTML}</td>`;
        }
        html += '</tr>';
    }

    html += '</table>';


    html += '</div>';
    return html;
}