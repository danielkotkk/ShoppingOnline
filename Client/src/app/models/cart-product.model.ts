export class CartProduct {
    public constructor(
        public _id?: number,
        public productId?: number,
        public productName?: string,
        public picturePath?: string,
        public units?: number,
        public calculatedPrice?: number,
        public cartId?: string,
    ) { }
}