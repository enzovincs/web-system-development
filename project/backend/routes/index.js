import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByType,
  getTaskTypes,
  createTaskType,
} from '../controllers/taskController.js';

const router = Router();

router.get('/task-types', getTaskTypes);
router.post('/task-types', createTaskType);

router.get('/tasks', getTasks);
router.get('/tasks/type/:typeId', getTasksByType);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
