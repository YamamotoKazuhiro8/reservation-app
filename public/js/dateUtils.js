
// 日付処理ユーティリティ（比較、差分、フォーマット）

/**
 * Date型の文字列を返す
 * @param {Date} date 
 * @returns {String} yy-mm-dd : mmは(1～12)
 */
export function dateString(date){
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
export function compare(a, b) {
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
export function diff(a, b){
    const toDate = (str) => {
        const parts = str.split('-').map(Number);
        if(parts.length === 3) {
            return new Date(parts[0], parts[1] - 1, parts[2]);
        } else {
            return new Date(config.year, parts[0] - 1, parts[1]);
        }
    };
    const dateA = toDate(a);
    const dateB = toDate(b);
    return Math.floor((dateA - dateB) / (1000 * 60 * 60 * 24));
}
