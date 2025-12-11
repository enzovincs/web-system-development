
import { taskSchema, taskTypeSchema } from '../db/schemas.js';
import taskModel from '../models/taskModel.js';


export const getTasks = async (req, res) => {
  try {
    const tasks = await taskModel.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasksByType = async (req, res) => {
  const { typeId } = req.params;

  try {
    const tasks = await taskModel.getTasksByTypeId(typeId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskTypes = async (req, res) => {
  try {
    const types = await taskModel.getTaskTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const createTaskType = async (req, res) => {
  // Validamos el body con Zod
  const parsed = taskTypeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(parsed.error.issues);
  }

  try {
    const { name } = parsed.data;
    const newType = await taskModel.createTaskType(name);
    return res.status(201).json(newType);
  } catch (error) {
    // 23505 = violación de UNIQUE en Postgres
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ese tipo de tarea ya existe' });
    }
    return res.status(500).json({ error: error.message });
  }
};


export const createTask = async (req, res) => {
  // Validación de datos con Zod
  const parsed = taskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(parsed.error.issues);
  }

  try {
    const newTask = await taskModel.createTask(parsed.data);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const updated = await taskModel.updateTask(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await taskModel.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
