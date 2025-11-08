import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AuthenticateSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export class AuthenticateDto extends createZodDto(AuthenticateSchema) {}
