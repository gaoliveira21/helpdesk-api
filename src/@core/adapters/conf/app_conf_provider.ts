import z from 'zod';

import {
  Config,
  ConfProvider,
} from 'src/@core/application/ports/conf_provider.port';

export class AppConfProvider implements ConfProvider {
  private _config: Config;

  constructor() {
    this.loadFromEnv();
    this.validate();
  }

  get<P extends GetKeys<Config>>(path: P): ValueAtPath<Config, P> {
    const value = this.accessNestedValue(this._config, path) as ValueAtPath<
      Config,
      P
    >;

    return value;
  }

  private accessNestedValue(obj: Record<string, unknown>, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  private loadFromEnv() {
    this._config = {
      auth: {
        secret: process.env.JWT_SECRET || '',
        accessTokenExpiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
        refreshTokenExpiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
      },
    };
  }

  private validate() {
    const schema = z.object({
      auth: z.object({
        secret: z.string().nonempty(),
        accessTokenExpiresIn: z.number().min(1),
        refreshTokenExpiresIn: z.number().min(1),
      }),
    });

    const result = schema.safeParse(this._config);
    if (!result.success) {
      throw new Error(
        `Invalid configuration: ${JSON.stringify(result.error.issues)}`,
      );
    }
    this._config = result.data;
  }
}
