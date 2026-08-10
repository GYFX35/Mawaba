import request from 'supertest';
import app from './index';

describe('Backend API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.message).toContain('Mawaba Core API');
    });
  });

  describe('GET /api/integrations', () => {
    it('should return list of integrations', async () => {
      const response = await request(app).get('/api/integrations');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const names = response.body.map((item: any) => item.name);
      expect(names).toContain('NCR');
      expect(names).toContain('Square');
      expect(names).toContain('Toast');
    });
  });

  describe('POST /api/integrations/:name/connect', () => {
    it('should connect successfully for valid integration', async () => {
      const response = await request(app).post('/api/integrations/Square/connect');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Connected to Square successfully');
      expect(response.body.integration).toBeDefined();
      expect(response.body.integration.connected).toBe(true);
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
