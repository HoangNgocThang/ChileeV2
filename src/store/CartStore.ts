import {GeneralResponse, Pack, Product} from "../api/interfaces";
import CartRequest from '../api/requests/CartRequest';
import {CartItem} from "../api/interfaces";
import storage from "../utils/storage";
import {$alert} from "../ui/Alert";


export class CartStore  {
    private items: Array<CartItem> = [];

    private onChanges: Array<any> = [];

    async add(item: CartItem) {
        delete item.product.content;
        const res = await CartRequest.add(item);
        if (res.err_code === 0) {
            this.items = res.items;
            this.onChanges.forEach(cb => cb());
        }
        return res;
    }

    async remove(item){
        const res = await CartRequest.remove(item.id);

        let newItems = [];
        for (let i = 0; i < this.items.length; i++) {
            if (item.id != this.items[i].id) {
                newItems.push(this.items.id);
            }
        }

        this.items = newItems;
        this.onChanges.forEach(cb => cb());
        return res;
    }

    onChange( cb: any) {
        this.onChanges.push(cb);
    }

    async serialize() {
        const auth = await storage.getAuth();
        if (auth) {
            const items = this.getItems();
            console.log('serialize');
            storage.set('CartStore.' + auth.user.id, items, 10000);
        }
    }

    async unserialize() {
        const auth = await storage.getAuth();

        if (auth) {
            const res = await CartRequest.get();
            this.items = await res.items;
        }
    }

    async get() {
        const res = await CartRequest.get();
        this.items = await res.items;
        return res;
    }

    getItems(): Array<CartItem> {
        return this.items;
    }


    count() {
        return this.items.length;
    }

    clear() {
        this.items = [];
        this.onChanges.forEach(cb => cb());
    }


}

const store = new CartStore();
export default store;
