import storage from "../utils/storage";
import {CartItem} from "./CartStore";

export interface SearchItem {
    id: number,
    key: string
}

export class SearchStore  {
    private items = [];
    private itemMap:any = {};


    add(item: string) {
        const id = this.items.length;
        if (!this.itemMap[item]) {
            this.itemMap[item] = true;
            this.items.unshift({id: id, key: item});
            this.serialize();
        }

    }

    serialize() {
        storage.set('SearchStore.', this.items);
    }

    async unserialize() {
        const items = await storage.get('SearchStore.',[]);

        let i = 0;
        if (Array.isArray(items)) {
            items.forEach((item, index) => {
                if (!this.itemMap[item.key] && i <= 10) {
                    this.itemMap[item.key] = true;
                    this.items.push(item);
                    i++;
                }
            })
        }

    }

    getItems(): Array<SearchItem> {
        return this.items;
    }


}

const store = new SearchStore();
export default store;
