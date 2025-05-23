
// 表示の管理、１つのみ表示

export class Selection {
    constructor() {
        this.options = {};
        this.current = '';
    }

    add(id, show = false) {
        this.options[id] = document.getElementById(id);
        if(show) {
            show(id); 
            return;
        }
        this.options[id].classList.add('hidden');
    }

    show(id) {
        if(this.current !== '') this.options[this.current].classList.add('hidden');

        this.options[id].classList.remove('hidden');
        this.current = id;
    }
}