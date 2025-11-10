import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateUserPasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export class UpdateUserPasswordDto extends createZodDto(
  UpdateUserPasswordSchema,
) {}
