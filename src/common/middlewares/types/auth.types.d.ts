import { TReqUser, TSignUpGoogleReqUser } from '../../libs/type';

declare namespace Express {
  export interface Request {
    user: TReqUser | TSignUpGoogleReqUser;
    guest: any;
  }
  export interface Response {
    user: any;
  }
}
