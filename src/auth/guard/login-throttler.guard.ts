/* eslint-disable @typescript-eslint/require-await */
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

export class LoginThrottlerGuard extends ThrottlerGuard {
  private readonly MAX_LOGIN_ATTEMPTS = 3;
  private readonly TTL_MS = 600_000;

  protected getTracker = async (
    request: Record<string, any>,
  ): Promise<string> => {
    const email = request.body?.email ?? 'anonymous';
    return `login-${email}`;
  };

  protected getLimit = async (): Promise<number> => {
    return Promise.resolve(this.MAX_LOGIN_ATTEMPTS);
  };

  protected getTtl = async (): Promise<number> => {
    return Promise.resolve(this.TTL_MS);
  };

  protected throwThrottlingException = async (): Promise<void> => {
    throw new ThrottlerException(
      `Too many attempts, Please try again in 10 minutes.`,
    );
  };
}
