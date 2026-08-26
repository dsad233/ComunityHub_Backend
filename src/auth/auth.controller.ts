import { AuthService } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  CertifiEmailDto,
  CreateUserDto,
  TUpdatePasswordRequestDto,
  SignInDto,
  UpdatePassowrdDto,
  UpdatePasswordRequestDto,
  AuthEmailDto,
} from './dto';
import {
  GOOGLE_CALLBACK_LOGIN_URL,
  GOOGLE_CALLBACK_SUCCESS_URL,
  GOOGLE_LINK_SUCCESS_URL,
} from '../common/configs/keys';

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  // 로그인 아이디 유무 확인
  checkLoginId = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; data: boolean }>> => {
    return res.status(StatusCodes.OK).json({
      verify: await this.authService.checkLoginId(req.query.loginId as string),
    });
  };

  // 이메일 유무 확인
  checkEmail = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; data: boolean }>> => {
    return res.status(StatusCodes.OK).json({
      verify: await this.authService.checkEmail(req.query.email as string),
    });
  };

  // 닉네임 유무 확인
  checkNickname = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; data: boolean }>> => {
    return res.status(StatusCodes.OK).json({
      verify: await this.authService.checkNickname(
        req.query.nickname as string,
      ),
    });
  };

  // 유저 생성
  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.signUp(await CreateUserDto(req.body));

    return res.status(StatusCodes.CREATED).json({ message: '회원 가입 완료.' });
  };

  // 유저 이메일 인증 여부 업데이트
  verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.verifyEmail(
      (await CertifiEmailDto(req.query.email as string)).email,
    );

    return res.status(StatusCodes.OK).json({ message: '이메일 인증 완료.' });
  };

  // 로그인
  signIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<
    Response<{
      message: string;
      data: { access_token: string; refresh_token: string };
    }>
  > => {
    const tokens = await this.authService.signIn(await SignInDto(req.body));

    return res.status(StatusCodes.OK).json({
      message: '로그인 완료.',
      data: tokens,
    });
  };

  // 로그아웃
  signOut = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.signOut(req.user.id);
    return res.status(StatusCodes.OK).json({ message: '로그아웃 완료.' });
  };

  // 토큰 재발급
  reissue = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const { refreshToken } = req.body;

    const tokens = await this.authService.reissue(refreshToken);

    return res
      .status(StatusCodes.OK)
      .json({ message: '토큰 재발급 완료.', data: tokens });
  };

  // 패스워드 변경
  updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.updatePassword(
      await UpdatePasswordRequestDto(req.query as TUpdatePasswordRequestDto),
      (await UpdatePassowrdDto(req.body)).newPassowrd,
    );

    return res.status(StatusCodes.OK).json({ message: '비밀번호 변경 완료.' });
  };

  // 패스워드 변경 이메일 인증
  certifiEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.certifiEmail(
      (await CertifiEmailDto(req.body.email)).email,
    );

    return res.status(StatusCodes.OK).json({ message: '이메일 전송 완료.' });
  };

  // 패스워드 변경 이메일 인증 완료
  authenticationEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const token = await this.authService.authenticationEmail(
      (await CertifiEmailDto(req.body.email)).email,
      await AuthEmailDto(req.body),
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: '이메일 인증 완료.', token: token });
  };

  /**
   * OAuth 2.0 Google 로그인
   */

  // Google 로그인 요청
  googleCallback = async (req: Request, res: Response): Promise<void> => {
    // 이미 회원 가입 이력이 있을 시에, 로그인 처리
    if (req.user.id) {
      const tokens = await this.authService.googleSignIn(req.user);
      res.writeHead(StatusCodes.OK, {
        'Content-Type': 'text/html; charset=utf-8',
      });
      res.write(
        `<script>window.location.href="${GOOGLE_CALLBACK_SUCCESS_URL}?res_ack=${tokens.access_token}&res_ref=${tokens.refresh_token}"</script>`,
      );

      return;
    }

    // 구글 계정으로 회원 가입 진행 처리
    await this.authService.googleSignUp(req.user);
    res.writeHead(StatusCodes.OK, {
      'Content-Type': 'text/html; charset=utf-8',
    });
    res.write(
      "<script>alert('회원가입이 완료되었습니다. 다시 로그인을 시도해 주세요.')</script>",
    );
    res.write(
      `<script>window.location.href="${GOOGLE_CALLBACK_LOGIN_URL}"</script>`,
    );

    return;
  };

  // 구글 계정 연동 URL 요청
  googleSocialLink = (
    req: Request,
    res: Response,
  ): Response<{ data: string }> => {
    return res.status(StatusCodes.OK).json({
      url: this.authService.googleSocialLink(),
    });
  };

  // 구글 계정 연동 콜백
  googleSocialLinkCallback = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const email = await this.authService.googleSocialLinkCallback(
      req.query.code as string,
    );
    res.redirect(GOOGLE_LINK_SUCCESS_URL + `?email=${email}`);
    return;
  };

  // 구글 계정 등록 처리
  googleSocialLinkRegister = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.googleSocialLinkRegister(
      req.user.id,
      req.body.email,
    );

    return res.status(StatusCodes.OK).json({
      message: '구글 계정 연동 완료.',
    });
  };
}
