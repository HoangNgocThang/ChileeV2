// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

const prefix = 'a.';
export class Storage {
	private memoryCache: any = {};
	public readonly commonTimeout = 1800;
	private onChangesMap:any = {};
	private readonly KEY_AUTH = 'auth';

	async set(key : string, value: any, ttl = 0) {
		key = prefix + key;
		try {
			let obj = {
				value : value,
				ttl: ttl === 0 ? 0 :Date.now() + ttl* 1000
			};

			this.memoryCache[key] = obj;
			await AsyncStorage.setItem(key, JSON.stringify( obj));
			if (this.onChangesMap[key] && this.onChangesMap[key].length) {
				this.onChangesMap[key].forEach((cb: any) => {
					try {
						cb(value);
					} catch (err) {

					}
				});
			}
		} catch (e) {
			console.log('[ERR]', e);
		}
	}

	async get(key: string, defaultValue = null, useMemoryCache = true): Promise<any> {
		key = prefix + key;
		try {
			let obj;

			if (useMemoryCache) {
				if (this.memoryCache[key]) {
					obj = this.memoryCache[key];

					if (obj.ttl === 0) {
						//console.log('[INFO]', 'Fetch ' + key +' from memory cache 1')
						return obj.value;
					}

					if (obj.ttl < Date.now()) {
						delete this.memoryCache[key];
						await AsyncStorage.removeItem(key);
						return  defaultValue;
					}

					//console.log('[INFO]', 'Fetch ' + key +' from memory cache 2')
					return obj.value;
				}
			}

			let json = await AsyncStorage.getItem(key);
			try {
				obj = JSON.parse(json);
				if (!obj) {
					return defaultValue;
				}
			} catch (e1) {
				return defaultValue;
			}


			if (useMemoryCache) {
				this.memoryCache[key] = obj;
			}

			if (obj.ttl === 0) {
				return obj.value;
			}

			if (obj.ttl < Date.now()) {
				//console.log('[INFO]', 'Remove Item: ' + key);

				if (useMemoryCache) {
					delete this.memoryCache[key];
				}

				await AsyncStorage.removeItem(key);
				return defaultValue;
			}

			return obj.value;
		} catch (err) {
			console.log('[INFO]', 'error storage.get', err);
			return defaultValue;
		}
	}

	async incr(key, unit = 1) {
		let value = await this.get(key);
		value += unit;
		await this.set(key, value);
	}

	async decr (key, unit = 1) {
		let value = await this.get(key);
		value -= unit;
		await this.set(key, value);
	}

	async remove(key: string) {
		key = prefix + key;
		try {
			delete this.memoryCache[key];
			await AsyncStorage.removeItem( key);
		} catch (err) {
			console.log('[INFO]', 'error storage.remove', err);
		}
	}

	async getAuth() {
		return this.get(this.KEY_AUTH);
	}

	async getTempCustomerId() {
		let tmpCustomerId = await this.get(this.KEY_TEMP_CUSTOMER);
		if (!tmpCustomerId) {
			let d = new Date;
			let timestamp = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()+":";
			tmpCustomerId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});

			tmpCustomerId = timestamp +  tmpCustomerId;

			await this.set(this.KEY_TEMP_CUSTOMER, tmpCustomerId);
		}

		return tmpCustomerId;
	}

	async setAuth(authData) {
		this.clearCommonCache();
		this.set(this.KEY_AUTH, authData);
	}

	async clearAuth() {
		this.clearCommonCache();
		this.remove(this.KEY_AUTH);
	}

	clearCommonCache() {
		let keys = [
			this.KEY_FEATURED_CAMPAIGN,
		];
		keys.forEach ( k => {
			this.remove(k);
		})
	}

	onKeyChange(key, cb) {
		key = prefix + key;
		if (!this.onChangesMap[key]) {
			this.onChangesMap[key] = [];
		}

		this.onChangesMap[key].push(cb);
	}

	removeKeyChangeListener(key) {
		key = prefix + key;
		this.onChangesMap[key] = [];
	}


}


export default  new Storage();
