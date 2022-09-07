export interface GeneralResponse {
    err_code: number,
    message: string
}

export interface Thumb {
    uri: string,
    width: number,
    height: number
}
export interface ShareInfo {
    id: number,
    price: number,
    price_discount: number,
    required_member: number,
    end_time: number,
    number_sold: number,
    discount_percent: number,
    quantity: number,
    groupCount: number,
    groups: Array<any>
}

export interface ProductPrice {
    id: number,
    quantity: number,
    price: number,
    explain: string
}

export interface Product {
    id: number,
    name: string,
    category_name: string,
    from: string,
    price: number,
    unit: string,
    content: string,
    pack: Array<string>
    packs: Array<any>,
    shareInfo: Array<ShareInfo>,
    thumb: Thumb,
    thumbs: Array<any>,
    province_name: string,
    note: string,
    start_time: number,
    end_time: number,
    time_range: string,
    allow_booking_time: boolean,
    saleable: boolean,
    quantity: number,
    shipment_note: string,
    fast_shipping: number,
    shareable:boolean,
    ship_fee_type: number,
    price_discount: number,
    countdown_show: boolean,
    countdown_label: string,
    discount_end_at: number,
    priceByQuantities: Array<ProductPrice>,
    shop: Shop
}

export interface Campaign {
    id: number,
    name: string,
    products: Array<Product>,
    readmore: number
}


export interface User {
    id: number,
    name: string,
    facebook_id: string,
    avatar: Thumb,
    username: string,
    email: string,
    phone: string,
}

export interface Address {
    id?: number,
    name: string,
    phone: string,
    district_id: number,
    province_id: number,
    address: string,
    ship_fee?: number,
    decoded: string,
    type: number,
    buyer_name: string,
    buyer_phone: string,
    buyer_phone2: string,
}

export interface RemoteConfig {
    privacyUrl: string,
    groupShareLink: string,
    boCongThuongUrl: string,
    pageLimit: number,
    payment: {
        show: boolean,
        paymentUrl: string,
        createUrl: string,
        historyUrl: string
    },
    notification: {
        unread: number
    },
    socialAuth: {
        facebook: boolean,
        google: boolean,
        apple: boolean
    },
    showBuyShare: boolean,
    phone: string,
    updates: {
        show: boolean,
        latestVersionCode: number,
        force: boolean,
        title: string,
        content: string,
        link: string,
    }
}

export interface Pack {
    name: string,
    price: number,
    image: string,
    checked: boolean,
    id: number
}

export interface Category {
    id: string,
    name: string,
    thumb: Thumb
}

export interface CategoryProduct {
    id: string,
    name: string,
    thumb: Thumb,
    products: Array<Product>
}

export interface PaginateOption {
    limit: number,
    page: number,
    order: string,
    direction: string
}

export interface AboutInfo {
    id: number,
    uri: string,
    name: string
}

export interface Notification {
    id: number,
    title: string,
    summary: string
    content: string,
    read: boolean,
    created_at: string
}

export interface NotificationData {
    screen: string,
    props: any
}

export interface Cart {
    name: string,
    user_id: number,
    amount: number,
    amount_origin: number,
    ship_fee: number,
    discounted: number
}

export interface CartItem {
    product: Product,
    pack: Pack,
    quantity: number,
    price: number,
    price_origin: number,
}

export interface Shop {
    id: number,
    name: string,
    banner: string,
    avatar: string
}

export interface FeeData {
    shipFee: number,
    fastShipFee: number,
    allowBookingTime: number,
    allowFastShipping: boolean,
    fastShippingNote: string,
    shipmentNote: string,
}
