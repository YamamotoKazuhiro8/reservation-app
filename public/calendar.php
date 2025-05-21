
<button onclick="reload()">再読み込み</button>

<div id="user-reservatins-list" class="hidden">
    <button onclick="toggleList()">開</button>
    <ul class="close"></ul>
</div>

<div id="calendar-viewer">
    <div id="loading">ロード中</div>
    <div id="server-error" class="hidden">サーバーエラー</div>
    <div id="outOfPeriod" class="hidden">期間外</div>
    <div id="month-viewer" class="hidden">月カレンダー</div>
</div>