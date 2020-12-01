export class ProductModel {
    public constructor(
        public _id?: number,
        public productName?: string,
        public categoryId?: string,
        public price?: number,
        public picturePath?: string,
    ) { }
}