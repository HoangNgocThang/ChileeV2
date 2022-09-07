import storage from "../utils/storage";
const $key = '@zLocation21';
export class ConfigStore  {
    private province = {id:18, name: 'Hà Nội'};
    private onChanges = [];

    serialize() {
        storage.set($key, this.province);
    }

    async unserialize() {
        this.province = await storage.get($key,null);
    }

    async hasProvince() {
        const a = await storage.get($key);
        return !!a;
    }

    setProvince(province: any){
        this.province = {
            id: province.id,
            name: province.name
        };
        this.onChanges.forEach(cb => cb());
        this.serialize();
    }

    getProvince() {
        if ( this.province) {
            return  this.province;
        }
        return  {id:18, name: 'Hà Nội'};
    }

    onChange( cb: any) {
        this.onChanges.push(cb);
    }

    onProvinceChange( cb: any) {
        this.onChanges.push(cb);
    }
}

const store = new ConfigStore();
export default store;
