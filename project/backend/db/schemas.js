import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  priority: z.number().int().optional(),
  completed: z.boolean().optional(),
  task_type_id: z.number().int().min(1, 'El tipo de tarea es obligatorio'),
  finished_at: z.string().optional().nullable(),
});

export const taskTypeSchema = z.object({
  name: z.string().min(1, 'El nombre del tipo es obligatorio'),
});