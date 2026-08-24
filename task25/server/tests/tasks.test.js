import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { resetTasksData } from '../data/tasksData.js';

describe('Express REST API Tests — TaskForge', () => {
  beforeEach(() => {
    resetTasksData();
  });

  describe('GET /api/tasks', () => {
    it('should return 200 status code and JSON content', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.success).toBe(true);
    });

    it('should return an array of tasks', async () => {
      const response = await request(app).get('/api/tasks');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should filter tasks by search query', async () => {
      const response = await request(app).get('/api/tasks?search=Vitest');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].title).toMatch(/Vitest/i);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app).get('/api/tasks?status=Completed');
      expect(response.status).toBe(200);
      response.body.data.forEach(task => {
        expect(task.status).toBe('Completed');
      });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 200 and task details for a valid ID', async () => {
      const response = await request(app).get('/api/tasks/task-1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('task-1');
      expect(response.body.data.title).toBe('Implement Authentication UI');
    });

    it('should return 404 for an invalid task ID', async () => {
      const response = await request(app).get('/api/tasks/non-existent-id');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task and return 201 Created', async () => {
      const newTaskData = {
        title: 'Integration Test Task',
        description: 'Testing task creation via Supertest',
        priority: 'High',
        status: 'Todo',
        category: 'Testing',
        dueDate: '2026-09-01'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTaskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Integration Test Task');
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 Bad Request if task title is missing', async () => {
      const invalidTaskData = {
        description: 'Missing title',
        priority: 'Low'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTaskData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task title is required');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task and return 200 OK', async () => {
      const updateData = {
        title: 'Updated Authentication UI Task',
        status: 'Completed',
        priority: 'Critical'
      };

      const response = await request(app)
        .put('/api/tasks/task-1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Authentication UI Task');
      expect(response.body.data.priority).toBe('Critical');
    });

    it('should return 404 for updating a non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/invalid-999')
        .send({ title: 'New Title' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 400 when updating title with empty string', async () => {
      const response = await request(app)
        .put('/api/tasks/task-1')
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task title cannot be empty');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task and return 200 OK', async () => {
      const response = await request(app).delete('/api/tasks/task-1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('task-1');

      // Verify task is removed
      const getResponse = await request(app).get('/api/tasks/task-1');
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when attempting to delete non-existent task', async () => {
      const response = await request(app).delete('/api/tasks/ghost-id');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('GET /api/stats', () => {
    it('should return 200 OK and analytics metrics object', async () => {
      const response = await request(app).get('/api/stats');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalTasks');
      expect(response.body.data).toHaveProperty('completed');
      expect(response.body.data).toHaveProperty('inProgress');
      expect(response.body.data).toHaveProperty('testCoverage');
      expect(response.body.data.testCoverage).toBe(92);
    });
  });
});
