import { pool } from '../db/pool.js';

async function getAllTasks() {
  const result = await pool.query(`
    SELECT 
      tasks.*,
      task_types.name AS type_name
    FROM tasks
    LEFT JOIN task_types
      ON tasks.task_type_id = task_types.id
    ORDER BY tasks.created_at DESC
  `);

  return result.rows;
}

async function getTasksByTypeId(typeId) {
  const result = await pool.query(`
    SELECT 
      tasks.*,
      task_types.name AS type_name
    FROM tasks
    JOIN task_types
      ON tasks.task_type_id = task_types.id
    WHERE task_types.id = $1
    ORDER BY tasks.created_at DESC
  `, [typeId]);

  return result.rows;
}

async function getTaskTypes() {
  const result = await pool.query(`
    SELECT id, name
    FROM task_types
    ORDER BY name
  `);

  return result.rows;
}


async function createTaskType(name) {
  const result = await pool.query(
    `
    INSERT INTO task_types (name)
    VALUES ($1)
    RETURNING id, name;
    `,
    [name]
  );

  return result.rows[0];
}


async function createTask({
  title,
  description = null,
  priority = null,
  completed = false,
  task_type_id,
  finished_at = null,
}) {
  const result = await pool.query(
    `
    INSERT INTO tasks (title, description, priority, completed, task_type_id, finished_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `,
    [title, description, priority, completed, task_type_id, finished_at]
  );

  return result.rows[0];
}

async function updateTask(id, fields) {
  const {
    title,
    description,
    priority,
    completed,
    task_type_id,
    finished_at,
  } = fields;

  const result = await pool.query(
    `
    UPDATE tasks
    SET
      title        = COALESCE($2, title),
      description  = COALESCE($3, description),
      priority     = COALESCE($4, priority),
      completed    = COALESCE($5, completed),
      task_type_id = COALESCE($6, task_type_id),
      finished_at  = COALESCE($7, finished_at)
    WHERE id = $1
    RETURNING *;
    `,
    [id, title, description, priority, completed, task_type_id, finished_at]
  );

  return result.rows[0];
}


async function deleteTask(id) {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING id;',
    [id]
  );

  return result.rowCount > 0;
}

export default {
  getAllTasks,
  getTasksByTypeId,
  getTaskTypes,
  createTaskType,
  createTask,
  updateTask,
  deleteTask,
};
