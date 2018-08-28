export interface Product {
    // #[id]
    id: number;

    name: string;

    price: number;

    category: Category;
}

export interface Category {
    // #[id]
    id: number;

    name: string;
}
