
<button onclick="reload()">再読み込み</button>

<!--ユーザーの予約リスト一覧表-->
<div id="user-reservatins-list" class="hidden">
    <button onclick="toggleList()">開</button>
    <ul class="close"></ul>
</div>

<!--カレンダー-->
<div id="calendar-viewer">
    <div id="loading">ロード中</div>
    <div id="server-error" class="hidden">サーバーエラー</div>
    <div id="outOfPeriod" class="hidden">期間外</div>
    <div id="calendar-container" class="hidden">月カレンダー</div>
</div>

<div id="reservation-footer-fixed">
    予約について
</div>

<div id="reservation-footer-spacer">
    予約について
</div>