import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateUserPasswordSchema = z.object({
  currentPassword: z.string().min(6).max(25),
  newPassword: z.string().min(6).max(25),
});

export class UpdateUserPasswordDto extends createZodDto(
  UpdateUserPasswordSchema,
) {}
