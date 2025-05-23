
// 設定情報（期間・部屋情報）
// 後々DBに移動
export const config = {
    numRooms : 9, // 部屋数
    year : 2025,
    startDate : new Date(`${this.year}-07-15`), // 予約期間開始日 
    endDate : new Date(`${this.year}-09-15`) // 予約期間終了日
}