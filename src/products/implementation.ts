import { Product } from "./product";
import { ProductStore } from "./store";

const products: Product[] = [
    {
        id: "example-product",
        name: "Example Product",
        description: "It's a product for testing purposes",
        price_per_unit: 50,
        currency: "usd",
    },
];

const PRODUCT_STORE: ProductStore<Product> = {
    async getAllProducts() {
        return products;
    },
    async getProductById(id) {
        return products.find(product => product.id === id) ?? null;
    },
};
export default PRODUCT_STORE;
