export interface ProductItemType {
    id: number
    title: string | null
    productTitle: string | null
    price: number | null
    quantity: number | null
    discount: number | null
    deliveryTime: number | null
    total: number | null
}

export interface TableHead  {
    title: string
    visible: boolean
    type: 'select' | 'input'
    width: number
    value: string
}
