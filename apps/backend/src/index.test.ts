import request from 'supertest';
import app from './index';

describe('Backend API Endpoints', () => {
  describe('User Account Endpoints', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/users/register').send({
        name: 'Isaac Newton',
        email: 'isaac@gravity.org',
        password: 'principiamathematica'
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User account created successfully');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe('Isaac Newton');
      expect(response.body.user.email).toBe('isaac@gravity.org');
      expect(response.body.user.password).toBeUndefined(); // Should not return password
    });

    it('should reject registration missing required fields', async () => {
      const response = await request(app).post('/api/users/register').send({
        email: 'test@example.com'
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name, email, and password are required');
    });

    it('should reject registration with invalid email format', async () => {
      const response = await request(app).post('/api/users/register').send({
        name: 'Test User',
        email: 'not-an-email',
        password: 'password123'
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid email address format');
    });

    it('should reject registration with password under 6 characters', async () => {
      const response = await request(app).post('/api/users/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Password must be at least 6 characters long');
    });

    it('should prevent duplicate user registration with same email', async () => {
      const response = await request(app).post('/api/users/register').send({
        name: 'Marie Curie Duplicate',
        email: 'marie@curie.org',
        password: 'password123'
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('An account with this email already exists');
    });

    it('should authenticate existing user on login', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'marie@curie.org',
        password: 'password123'
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe('marie@curie.org');
    });

    it('should reject invalid credentials on login', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'marie@curie.org',
        password: 'wrongpassword'
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });
  });

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

  describe('POST /api/ai/tutor', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/ai/tutor').send({ question: 'What is physics?' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing question or discipline');
    });

    it('should return tailored answer, key takeaways, follow-ups, and quiz for valid query', async () => {
      const response = await request(app).post('/api/ai/tutor').send({
        question: 'What is quantum superposition?',
        discipline: 'STEM & Sciences',
        level: 'Beginner',
        responseType: 'Explanation'
      });

      expect(response.status).toBe(200);
      expect(response.body.discipline).toBe('STEM & Sciences');
      expect(response.body.level).toBe('Beginner');
      expect(response.body.answer).toContain('In simple terms:');
      expect(Array.isArray(response.body.keyTakeaways)).toBe(true);
      expect(response.body.keyTakeaways.length).toBeGreaterThan(0);
      expect(Array.isArray(response.body.followUpQuestions)).toBe(true);
      expect(response.body.quiz).toHaveProperty('question');
      expect(response.body.quiz).toHaveProperty('options');
      expect(response.body.quiz).toHaveProperty('answer');
    });

    it('should customize output when Quiz responseType is selected', async () => {
      const response = await request(app).post('/api/ai/tutor').send({
        question: 'How do catalysts work?',
        discipline: 'Sciences',
        level: 'Intermediate',
        responseType: 'Quiz'
      });

      expect(response.status).toBe(200);
      expect(response.body.answer).toContain('Here is a quick practice quiz');
      expect(response.body.quiz).toBeDefined();
    });

    it('should handle Google Gemini provider requests', async () => {
      const response = await request(app).post('/api/ai/tutor').send({
        question: 'Explain photosythesis',
        discipline: 'STEM & Sciences',
        provider: 'gemini'
      });

      expect(response.status).toBe(200);
      expect(response.body.provider).toContain('gemini');
      expect(response.body.model).toContain('Gemini');
      expect(response.body.answer).toBeDefined();
    });

    it('should handle OpenAI provider requests', async () => {
      const response = await request(app).post('/api/ai/tutor').send({
        question: 'Explain macroeconomics',
        discipline: 'Business & Economics',
        provider: 'openai'
      });

      expect(response.status).toBe(200);
      expect(response.body.provider).toContain('openai');
      expect(response.body.model).toContain('GPT');
      expect(response.body.answer).toBeDefined();
    });
  });

  describe('World Bank APIs', () => {
    it('GET /api/worldbank/countries should return paginated list of countries', async () => {
      const response = await request(app).get('/api/worldbank/countries?page=1&per_page=5');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('countries');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.countries)).toBe(true);
      expect(response.body.countries.length).toBeLessThanOrEqual(5);
    });

    it('GET /api/worldbank/indicators should fetch development indicator data', async () => {
      const response = await request(app).get('/api/worldbank/indicators?country=USA&indicator=NY.GDP.MKTP.CD');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('countryName');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty('year');
        expect(response.body.data[0]).toHaveProperty('value');
      }
    });

    it('GET /api/worldbank/projects should search global development projects', async () => {
      const response = await request(app).get('/api/worldbank/projects?q=education&rows=5');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('query', 'education');
      expect(response.body).toHaveProperty('projects');
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBeLessThanOrEqual(5);
    }, 15000);
  });
});
