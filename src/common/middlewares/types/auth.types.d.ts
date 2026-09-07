import { TReqUser, TSignUpGoogleReqUser } from '../../libs/type';

declare global {
  namespace Express {
    interface User extends TReqUser {}

    interface User extends TSignUpGoogleReqUser {}

    interface User {
      deletedAt: string;
    }

    interface Request {
      guest: any;
    }

    interface Response {
      user: any;
    }
  }
}
