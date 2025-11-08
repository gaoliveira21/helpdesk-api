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
      app: {
        port: Number(process.env.PORT || 3000),
        env: process.env.NODE_ENV || 'development',
      },
      auth: {
        secret: process.env.JWT_SECRET || '',
        accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    } as Config;
  }

  private validate() {
    const timeDurationSchema = z
      .stringFormat('TimeDuration', /^\d+(w|d|h|min)$/)
      .brand<TimeDuration>()
      .nonempty();

    const schema = z.object({
      app: z.object({
        port: z.number().int().positive(),
        env: z.enum(['development', 'production', 'test']),
      }),
      auth: z.object({
        secret: z.string().nonempty(),
        accessTokenExpiresIn: timeDurationSchema,
        refreshTokenExpiresIn: timeDurationSchema,
      }),
    });

    const result = schema.safeParse(this._config);
    if (!result.success) {
      throw new Error(
        `Invalid configuration: ${JSON.stringify(result.error.issues)}`,
      );
    }
    this._config = result.data as Config;
  }
}
