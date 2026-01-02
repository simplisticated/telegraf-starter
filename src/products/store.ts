import { Product } from "./product";

export interface ProductStore<ProductType = Product> {
    getAllProducts(): Promise<ProductType[]>;
    getProductById(id: string): Promise<ProductType | null>;
}
