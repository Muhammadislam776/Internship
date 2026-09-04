const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  addComment,
  addSubtask,
  toggleSubtask,
  deleteSubtask
} = require('../controllers/taskController');

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .patch(patchTask)
  .delete(deleteTask);

router.post('/:id/comments', addComment);
router.post('/:id/subtasks', addSubtask);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);
router.delete('/:id/subtasks/:subtaskId', deleteSubtask);

module.exports = router;
