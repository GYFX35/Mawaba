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

  describe('Environment Protection Endpoints', () => {
    it('GET /api/environment/initiatives should return list of initiatives', async () => {
      const response = await request(app).get('/api/environment/initiatives');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('category');
    });

    it('POST /api/environment/initiatives should create new initiative', async () => {
      const newInitiative = {
        title: 'Community Tree Nursery',
        category: 'Reforestation',
        description: 'Establishing local native plant nurseries to reforest degraded watersheds.',
        location: 'Lima, Peru',
        impact: '10,000 Saplings Produced/Yr',
        author: 'Andes Green Collective'
      };

      const response = await request(app).post('/api/environment/initiatives').send(newInitiative);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Community Tree Nursery');
      expect(response.body.upvotes).toBe(1);
    });

    it('POST /api/environment/initiatives/:id/upvote should increment upvote count', async () => {
      const response = await request(app).post('/api/environment/initiatives/env-1/upvote');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.upvotes).toBeGreaterThan(0);
    });

    it('GET /api/environment/pledges should return pledge statistics', async () => {
      const response = await request(app).get('/api/environment/pledges');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalPledges');
      expect(response.body).toHaveProperty('totalCo2ReductionKg');
      expect(Array.isArray(response.body.recentPledges)).toBe(true);
    });

    it('POST /api/environment/pledges should record new pledge', async () => {
      const pledge = {
        name: 'Elena Rostova',
        country: 'Estonia',
        pledgeType: '100% Electric Transit & Bike Commuting',
        co2ReductionEst: 1500
      };

      const response = await request(app).post('/api/environment/pledges').send(pledge);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Eco-pledge recorded successfully');
      expect(response.body.pledge.name).toBe('Elena Rostova');
      expect(response.body.totalPledges).toBeGreaterThan(0);
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

  describe('Climate Change Solutions APIs', () => {
    it('GET /api/climate/solutions should return curated solutions list', async () => {
      const response = await request(app).get('/api/climate/solutions');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.solutions)).toBe(true);
      expect(response.body.solutions.length).toBeGreaterThan(0);
    });

    it('GET /api/climate/solutions should support category filtering', async () => {
      const response = await request(app).get('/api/climate/solutions?category=Renewable%20Energy');
      expect(response.status).toBe(200);
      expect(response.body.solutions.every((s: any) => s.category === 'Renewable Energy')).toBe(true);
    });

    it('POST /api/climate/calculator should compute estimated CO2 impact', async () => {
      const response = await request(app).post('/api/climate/calculator').send({
        renewablePercentage: 50,
        solarCapacityKw: 5,
        treeCount: 20,
        evKmPerYear: 10000,
        wasteRecycledKg: 200
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(response.body.results.totalCo2SavedKg).toBeGreaterThan(0);
      expect(response.body.results.totalCo2SavedTons).toBeGreaterThan(0);
      expect(response.body.results.equivalentTreesPlanted).toBeGreaterThan(0);
      expect(response.body.results).toHaveProperty('impactGrade');
    });

    it('GET and POST /api/climate/initiatives should allow viewing and submitting climate projects', async () => {
      const getRes = await request(app).get('/api/climate/initiatives');
      expect(getRes.status).toBe(200);
      expect(Array.isArray(getRes.body)).toBe(true);

      const postRes = await request(app).post('/api/climate/initiatives').send({
        title: 'Geothermal School Heating Conversion',
        location: 'Reykjavik, Iceland',
        category: 'Renewable Energy',
        description: 'Converting fossil heating in rural schools to localized geothermal loops.',
        organizer: 'Iceland Clean Energy Foundation',
        targetImpact: '350 Tons CO2/yr'
      });

      expect(postRes.status).toBe(201);
      expect(postRes.body.title).toBe('Geothermal School Heating Conversion');
      expect(postRes.body.supporters).toBe(1);

      const supportRes = await request(app).post(`/api/climate/initiatives/${postRes.body.id}/support`);
      expect(supportRes.status).toBe(200);
      expect(supportRes.body.supporters).toBe(2);
    });
  });

  describe('Global Chat APIs', () => {
    it('GET /api/chat/messages should return list of global chat messages', async () => {
      const response = await request(app).get('/api/chat/messages');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('username');
      expect(response.body[0]).toHaveProperty('message');
      expect(response.body[0]).toHaveProperty('room');
    });

    it('GET /api/chat/messages?room=STEM%20%26%20AI should filter messages by room', async () => {
      const response = await request(app).get('/api/chat/messages?room=STEM%20%26%20AI');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((m: any) => m.room.toLowerCase().includes('stem'))).toBe(true);
    });

    it('POST /api/chat/messages should reject missing username and message/media', async () => {
      const response = await request(app).post('/api/chat/messages').send({ username: 'Alice' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and message or media attachment are required');
    });

    it('POST /api/chat/messages should publish a new message with optional camera image and video attachment', async () => {
      const sampleCameraSnapshot = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const sampleVideo = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAA==';
      const newMsg = {
        username: 'Elena',
        message: 'Live video and photo snapshot from our lab test!',
        room: 'STEM & AI',
        image: sampleCameraSnapshot,
        video: sampleVideo
      };

      const response = await request(app).post('/api/chat/messages').send(newMsg);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe('Elena');
      expect(response.body.image).toBe(sampleCameraSnapshot);
      expect(response.body.video).toBe(sampleVideo);
    });
  });

  describe('Community Forum APIs', () => {
    it('GET /api/forum/topics should return list of topics', async () => {
      const response = await request(app).get('/api/forum/topics');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('category');
    });

    it('POST /api/forum/topics should create a new topic with camera image and video support', async () => {
      const topicData = {
        title: 'Capturing Solar Panel Degradation with Mobile Vision',
        category: 'Climate & Earth',
        content: 'We can utilize standard phone cameras to detect solar surface defects via AI vision models.',
        author: 'Dr. Solar',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ',
        video: 'data:video/webm;base64,GkXfo59ChoEBQveBAAGU'
      };

      const response = await request(app).post('/api/forum/topics').send(topicData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Capturing Solar Panel Degradation with Mobile Vision');
      expect(response.body.video).toBe('data:video/webm;base64,GkXfo59ChoEBQveBAAGU');
      expect(response.body.likes).toBe(0);
    });

    it('POST /api/forum/topics/:id/like should increment topic likes', async () => {
      const response = await request(app).post('/api/forum/topics/ft-1/like');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.likes).toBeGreaterThan(18);
    });

    it('POST /api/forum/topics/:id/replies should post a reply to a topic with video support', async () => {
      const replyData = {
        author: 'Student Bob',
        text: 'Fascinating topic! Can we test this with basic WebRTC video feeds?',
        video: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAA=='
      };

      const response = await request(app).post('/api/forum/topics/ft-1/replies').send(replyData);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.reply.author).toBe('Student Bob');
      expect(response.body.reply.video).toBe(replyData.video);
    });
  });

  describe('Global Culture APIs', () => {
    it('GET /api/culture/items should return curated culture items', async () => {
      const response = await request(app).get('/api/culture/items');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('region');
      expect(response.body[0]).toHaveProperty('country');
      expect(response.body[0]).toHaveProperty('category');
    });

    it('GET /api/culture/items should support filtering by region and category', async () => {
      const response = await request(app).get('/api/culture/items?region=Africa&category=Music%20%26%20Dance');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((item: any) => item.region === 'Africa')).toBe(true);
    });

    it('POST /api/culture/items should create new cultural publication with photos and video', async () => {
      const newCulturePost = {
        title: 'Diwali Festival of Lights Traditions',
        country: 'India',
        region: 'Asia-Pacific',
        category: 'Festival',
        description: 'Diwali symbolizes the spiritual victory of light over darkness. Families illuminate oil lamps (diyas), decorate entrances with colorful rangoli patterns, and share traditional sweets.',
        author: 'Priya Sharma',
        image: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5',
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      };

      const response = await request(app).post('/api/culture/items').send(newCulturePost);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Diwali Festival of Lights Traditions');
      expect(response.body.likes).toBe(0);
      expect(response.body.video).toBe(newCulturePost.video);
    });

    it('POST /api/culture/items/:id/like should increment likes', async () => {
      const response = await request(app).post('/api/culture/items/cult-1/like');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.likes).toBeGreaterThan(64);
    });

    it('POST /api/culture/items/:id/comments should add comment to culture item', async () => {
      const commentData = {
        author: 'Kwame',
        text: 'The jump height during the Adumu dance is truly incredible!'
      };

      const response = await request(app).post('/api/culture/items/cult-1/comments').send(commentData);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.comment.author).toBe('Kwame');
      expect(response.body.comment.text).toBe(commentData.text);
    });
  });
});
