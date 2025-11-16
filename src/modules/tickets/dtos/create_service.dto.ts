import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const CreateServiceSchema = z.object({
  name: z.string().min(3).max(50).nonempty(),
  price: z.number().positive().nonoptional(),
});

export class CreateServiceDto extends createZodDto(CreateServiceSchema) {}
