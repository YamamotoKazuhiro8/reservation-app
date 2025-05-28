

/**
 * 要素グループの表示・非表示を切り替える
 * @param {{name: string, elements: Element[]}[]} groups
 */
export class VisibilitySwitcher {
    constructor(...groups) {
        this.current = '';
        this.collections = new Map();
        for (const group of groups) {
            this.collections.set(group.name, group.elements);
            for(const elem of group.elements) {
                elem.classList.add('hidden');
            }
        }
    }

    show(name) {
        if (this.current !== '') {
            const prev = this.collections.get(this.current);
            if (prev) {
                prev.forEach(el => el.classList.remove('hidden'));
            }
        }

        const next = this.collections.get(name);
        if (!next) {
            console.warn(`No such group: ${name}`);
            return this;
        }

        next.forEach(el => el.classList.add('hidden'));
        this.current = name;
        return this;
    }
}

class Switcher extends VisibilitySwitcher{
    addToGroup(name, element){
        if(!this.collections.has(name)) this.collections.set(name, []);
        this.collections.get(name).push(element);
    }
}