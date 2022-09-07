export class NotificationStore {
    listeners: Array<any> = [];
    unread = 0;

    setUnread(value: number) {
        this.unread = value;
    }

    onChange(cb: any) {
        this.listeners.push(cb);
    }

    decrease(step = 1) {
        this.unread = this.unread - step;
        if (this.unread < 0) {
            this.unread = 0;
        }
        this.listeners.forEach((cb:any) => {
           cb(this.unread);
        });
    }


}

const store = new NotificationStore();
export default store;
