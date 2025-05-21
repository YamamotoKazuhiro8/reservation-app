
// 注意: ConfigはDBに移動させる
// 要注意: カレンダー他の付きの日付せるID重複
// 保留: createCalendarFragment()が毎回同じHTMLを返すが、reload時に破棄せず、tdの中身だけ破棄した方が効率的か
// 次　: ラベル、
// 次他: エラーぺージの表示
	
// 設定情報（期間・部屋情報）
// 後々DBに移動
class Config {
    static numRooms = 9; // 部屋数
    // static rooms = [2, 3, 4, 5, 6, 8, 9, 10, 11]; // 部屋番号
    static year = 2025;
    static startDate = new Date(`${this.year}-07-15`); // 予約期間開始日 
    static endDate   = new Date(`${this.year}-09-15`); // 予約期間終了日
}

// 日付処理ユーティリティ（比較、差分、フォーマット）
class DateUtils{
    /**
     * Date型の文字列を返す
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

document.addEventListener('DOMContentLoaded', () => {
    reload();
})

let isListOpen = false;
function toggleList(){
    // const ul = document.getElementById('user-reservatins-list').querySelector('ul');
    // ul.className = isListOpen ? 'close' : 'open';
    isListOpen = !isListOpen; 
}

async function reload() {
    ['user-reservatins-list', 'server-error', 'outOfPeriod', `month-viewer`].forEach(elm => {elm.className = 'hidden'});
    document.getElementById('loading').className = '';

    document.getElementById('user-reservatins-list').querySelector('ul').innerHTML = '';
    document.getElementById('month-viewer').innerHTML = '';

    try {
        const data = await get_reservations();
        if(data.status === 'error') throw new Error(data.message);

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
        document.getElementById('month-viewer').appendChild(createCalendarFragment(dayinfo, userReservations));
        // ユーザー予約リスト作成
        // document.getElementById('user-reservatins-list').querySelector('ul').appendChild(createList(userReservations));

        document.getElementById('loading').className = 'hidden';
        document.getElementById('month-viewer').className = '';
        document.getElementById('user-reservatins-list').className = '';
    } catch (error) {
        console.error('データ取得エラー'+error.message);
        // エラー画面の表示
            // 接続エラー
            // 読み込み失敗エラー
            // 表示失敗エラー
        document.getElementById('loading').className = 'hidden';
        document.getElementById('server-error').className = '';
    }
}

/**
 * データベースから予約情報を取得する関数
 * @param {String} start_date - 開始日 (YYYY-MM-DD)
 * @param {string} end_date - 終了日 (YYYY-MM-DD)
 * @returns {Promise<Reservations[]>} 予約情報の配列（JSONオブジェクト）
 */
async function get_reservations(){
    const res = await fetch('../api/get_reservations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            start_date: DateUtils.dateString(Config.startDate),
            end_date:  DateUtils.dateString(Config.endDate)
        })
    });

    if(!res.ok) {
        throw new Error(res.status);
    }

    return await res.json(); 
}

/*月カレンダーの作成*/
/**
 * 
 * @returns {DocumentFragment}
 */
function createCalendarFragment(dayinfo, userReservations){
    const fragment = document.createDocumentFragment();
    const firstMonth = Config.startDate.getMonth();
    const lastMonth  = Config.endDate.getMonth();
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

        const lastMonth = new Date(Config.year, month - 1, 1).getMonth();
        const nextMonth = new Date(Config.year, month + 1, 1).getMonth();
        let day = new Date(Config.year, month, 1);
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
                    const numRemain = Config.numRooms - (dayinfo[`${day.getMonth()+1}-${day.getDate()}`] || 0);
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