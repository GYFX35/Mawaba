import request from 'supertest';
import app from './index';

describe('Backend API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        message: 'Backend is running',
      });
    });
  });

  describe('GET /api/integrations', () => {
    it('should return list of integrations', async () => {
      const response = await request(app).get('/api/integrations');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toContain('NCR');
      expect(response.body).toContain('Square');
      expect(response.body).toContain('Toast');
    });
  });

  describe('POST /api/integrations/:name/connect', () => {
    it('should connect successfully for valid integration', async () => {
      const response = await request(app).post('/api/integrations/Square/connect');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Connected to Square successfully',
      });
    });

    it('should return 404 for invalid integration', async () => {
      const response = await request(app).post('/api/integrations/InvalidPartner/connect');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Integration not found',
      });
    });
  });
});
