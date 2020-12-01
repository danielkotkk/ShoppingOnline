export class UserModel {
    public constructor(
        public _id?: number,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public identity?: string,
        public password?: string,
        public city?: string,
        public street?: string,
        public isAdmin?: string,
        public token?: string,
        public token2?: string
    ) { }
}