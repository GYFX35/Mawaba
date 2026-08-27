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

  describe('GET /api/location/detect', () => {
    it('should return default English location metadata when no headers are provided', async () => {
      const response = await request(app).get('/api/location/detect');
      expect(response.status).toBe(200);
      expect(response.body.language.code).toBe('en');
      expect(Array.isArray(response.body.supportedLanguages)).toBe(true);
      expect(response.body.supportedLanguages.length).toBeGreaterThan(5);
    });

    it('should detect French language and location based on Accept-Language header', async () => {
      const response = await request(app)
        .get('/api/location/detect')
        .set('Accept-Language', 'fr-FR,fr;q=0.9');
      expect(response.status).toBe(200);
      expect(response.body.language.code).toBe('fr');
      expect(response.body.detectedLocation.countryCode).toBe('FR');
    });

    it('should detect language based on timezone header', async () => {
      const response = await request(app)
        .get('/api/location/detect')
        .set('x-timezone', 'Africa/Nairobi');
      expect(response.status).toBe(200);
      expect(response.body.language.code).toBe('sw');
      expect(response.body.detectedLocation.countryCode).toBe('KE');
    });

    it('should respect explicit lang query parameter', async () => {
      const response = await request(app).get('/api/location/detect?lang=es');
      expect(response.status).toBe(200);
      expect(response.body.language.code).toBe('es');
      expect(response.body.language.name).toBe('Español');
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

  describe('Global Health Promotion Endpoints', () => {
    it('GET /api/health-promotion/campaigns should return health campaigns', async () => {
      const response = await request(app).get('/api/health-promotion/campaigns');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('category');
      expect(response.body[0]).toHaveProperty('organizer');
    });

    it('GET /api/health-promotion/campaigns should support category and search filtering', async () => {
      const response = await request(app).get('/api/health-promotion/campaigns?category=Epidemic%20%26%20Disease%20Control');
      expect(response.status).toBe(200);
      expect(response.body.every((c: any) => c.category === 'Epidemic & Disease Control')).toBe(true);
    });

    it('POST /api/health-promotion/campaigns should create a new campaign', async () => {
      const payload = {
        title: 'Community Dental Hygiene & Fluoride Drive',
        category: 'Wellness & Prevention',
        description: 'Providing free oral health screening and preventative dental care to school children.',
        location: 'Kuala Lumpur, Malaysia',
        organizer: 'Healthy Smiles Alliance',
        targetImpact: '5,000 Students Screened'
      };

      const response = await request(app).post('/api/health-promotion/campaigns').send(payload);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Community Dental Hygiene & Fluoride Drive');
      expect(response.body.supporters).toBe(1);
    });

    it('POST /api/health-promotion/campaigns/:id/support should increment campaign support count', async () => {
      const response = await request(app).post('/api/health-promotion/campaigns/hc-1/support');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.supporters).toBeGreaterThan(482);
    });

    it('GET /api/health-promotion/tips should return health tips list', async () => {
      const response = await request(app).get('/api/health-promotion/tips');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('content');
    });

    it('POST /api/health-promotion/tips should publish a new health tip', async () => {
      const newTip = {
        title: 'Ergonomic Posture & Workplace Spinal Care',
        category: 'Physical Activity',
        content: 'Taking a 2-minute standing break every 30 minutes reduces lumbar strain and improves blood circulation during desk work.',
        author: 'Dr. Alex Vance'
      };

      const response = await request(app).post('/api/health-promotion/tips').send(newTip);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Ergonomic Posture & Workplace Spinal Care');
      expect(response.body.likes).toBe(0);
    });

    it('POST /api/health-promotion/tips/:id/like should increment likes', async () => {
      const response = await request(app).post('/api/health-promotion/tips/ht-1/like');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.likes).toBeGreaterThan(89);
    });

    it('POST /api/health-promotion/assessment should calculate BMI and hydration target', async () => {
      const payload = {
        weightKg: 70,
        heightCm: 175,
        age: 30,
        dailyWaterLiters: 2.5
      };

      const response = await request(app).post('/api/health-promotion/assessment').send(payload);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('assessment');
      expect(response.body.assessment.bmi).toBe(22.9); // 70 / (1.75 * 1.75) = 22.857 -> 22.9
      expect(response.body.assessment.bmiCategory).toBe('Normal Weight');
      expect(response.body.assessment.recommendedWaterLiters).toBe(2.5); // 70 * 0.035 = 2.45 -> 2.5
      expect(response.body.assessment.hydrationStatus).toBe('Optimal');
    });

    it('POST /api/health-promotion/assessment should reject missing or invalid weight/height', async () => {
      const response = await request(app).post('/api/health-promotion/assessment').send({ weightKg: -10 });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Valid weight in kg and height in cm are required');
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

  describe('DTC (Direct-to-Consumer) APIs', () => {
    it('GET /api/dtc/products should return product catalog', async () => {
      const response = await request(app).get('/api/dtc/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('stock');
    });

    it('GET /api/dtc/products should support category and search filtering', async () => {
      const response = await request(app).get('/api/dtc/products?search=Bamboo');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toContain('Bamboo');
    });

    it('POST /api/dtc/products should create a new DTC product', async () => {
      const newProduct = {
        name: 'Organic Cotton Fair-Trade Tote Bag',
        category: 'Sustainable Living',
        price: 15.00,
        stock: 50,
        description: 'Durable organic cotton tote with reinforced handles.'
      };

      const response = await request(app).post('/api/dtc/products').send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Organic Cotton Fair-Trade Tote Bag');
      expect(response.body.rating).toBe(5.0);
    });

    it('GET /api/dtc/orders should return list of customer orders', async () => {
      const response = await request(app).get('/api/dtc/orders');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('customerName');
      expect(response.body[0]).toHaveProperty('totalAmount');
    });

    it('POST /api/dtc/orders should create a new DTC customer order and update stock', async () => {
      const orderPayload = {
        customerName: 'Marcus Aurelius',
        customerEmail: 'marcus@stoic.org',
        shippingAddress: '1 Capitol Hill, Rome',
        paymentMethod: 'Credit Card',
        items: [
          { productId: 'dtc-p1', quantity: 1, price: 28.99 }
        ]
      };

      const response = await request(app).post('/api/dtc/orders').send(orderPayload);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customerName).toBe('Marcus Aurelius');
      expect(response.body.totalAmount).toBe(28.99);
      expect(response.body.status).toBe('Processing');
    });

    it('GET /api/dtc/analytics should return sales and conversion metrics', async () => {
      const response = await request(app).get('/api/dtc/analytics');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('metrics');
      expect(response.body.metrics).toHaveProperty('totalRevenue');
      expect(response.body.metrics).toHaveProperty('conversionRate');
      expect(Array.isArray(response.body.topProducts)).toBe(true);
    });
  });

  describe('Videos Hub Entertainment APIs', () => {
    it('GET /api/videos should return list of videos', async () => {
      const response = await request(app).get('/api/videos');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('videoUrl');
      expect(response.body[0]).toHaveProperty('likes');
      expect(response.body[0]).toHaveProperty('shares');
      expect(response.body[0]).toHaveProperty('downloads');
    });

    it('GET /api/videos should support category and search filtering', async () => {
      const response = await request(app).get('/api/videos?category=Gaming%20%26%20Esports');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toContain('Cyberpunk Drone Race');
    });

    it('GET /api/videos/:id should return video details and increment views', async () => {
      const initialRes = await request(app).get('/api/videos/vid-1');
      expect(initialRes.status).toBe(200);
      const initialViews = initialRes.body.views;

      const response = await request(app).get('/api/videos/vid-1');
      expect(response.status).toBe(200);
      expect(response.body.views).toBe(initialViews + 1);
    });

    it('POST /api/videos/submit should create and publish a new video', async () => {
      const newVideoPayload = {
        title: 'Deep Ocean Exploration Vlog',
        category: 'Culture & Vlogs',
        description: 'Underwater ROV footage of hydrothermal vents and deep-sea creatures.',
        author: 'Oceanic Research',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
      };

      const response = await request(app).post('/api/videos/submit').send(newVideoPayload);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Deep Ocean Exploration Vlog');
      expect(response.body.likes).toBe(0);
      expect(response.body.shares).toBe(0);
      expect(response.body.downloads).toBe(0);
    });

    it('POST /api/videos/submit should reject missing required fields', async () => {
      const response = await request(app).post('/api/videos/submit').send({ title: 'Incomplete Video' });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required video fields');
    });

    it('POST /api/videos/:id/like should increment likes count', async () => {
      const response = await request(app).post('/api/videos/vid-1/like');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.likes).toBeGreaterThan(128);
    });

    it('POST /api/videos/:id/share should increment shares count and return shareable URL', async () => {
      const response = await request(app).post('/api/videos/vid-1/share');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.shares).toBeGreaterThan(45);
      expect(response.body.shareUrl).toContain('/videos?id=vid-1');
    });

    it('POST /api/videos/:id/download should increment downloads count and return download URL', async () => {
      const response = await request(app).post('/api/videos/vid-1/download');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.downloads).toBeGreaterThan(32);
      expect(response.body.downloadUrl).toBeDefined();
    });

    it('POST /api/videos/:id/comments should append comment to video', async () => {
      const commentPayload = {
        author: 'Samantha',
        text: 'Super high quality video playback!'
      };

      const response = await request(app).post('/api/videos/vid-1/comments').send(commentPayload);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.comment.author).toBe('Samantha');
      expect(response.body.comment.text).toBe('Super high quality video playback!');
    });
  });

  describe('Gaming Feature & Monetization APIs', () => {
    it('GET /api/games should return list of games', async () => {
      const response = await request(app).get('/api/games');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('monetizationModel');
      expect(response.body[0]).toHaveProperty('devRevenueShare');
    });

    it('GET /api/games should filter by genre and monetizationModel', async () => {
      const response = await request(app).get('/api/games?genre=Eco%20%26%20Climate&monetization=Ad-Supported');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('EcoGrid: Renewable Energy Tycoon');
    });

    it('GET /api/games/:id should return single game details or 404', async () => {
      const resOk = await request(app).get('/api/games/game-1');
      expect(resOk.status).toBe(200);
      expect(resOk.body.title).toBe('EcoGrid: Renewable Energy Tycoon');

      const resNotFound = await request(app).get('/api/games/non-existent-game');
      expect(resNotFound.status).toBe(404);
      expect(resNotFound.body.error).toBe('Game not found');
    });

    it('POST /api/games/submit should register and publish a new developer game', async () => {
      const newGamePayload = {
        title: 'Solar Racer 3000',
        developer: 'Future Craft',
        developerEmail: 'future@craft.io',
        genre: 'Action & Arcade',
        description: 'Race high-speed solar-powered hover vehicles while managing battery capacity and light shadow paths.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
        gameUrl: 'https://cdn.html5games.com/solarracer',
        monetizationModel: 'Premium Purchase',
        price: 3.99
      };

      const response = await request(app).post('/api/games/submit').send(newGamePayload);
      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Game submitted and published successfully');
      expect(response.body.game).toHaveProperty('id');
      expect(response.body.game.title).toBe('Solar Racer 3000');
      expect(response.body.game.devRevenueShare).toBe(85);
      expect(response.body.game.price).toBe(3.99);
    });

    it('POST /api/games/submit should reject missing required fields or invalid price', async () => {
      const resMissing = await request(app).post('/api/games/submit').send({ title: 'Incomplete Game' });
      expect(resMissing.status).toBe(400);
      expect(resMissing.body.error).toContain('Missing required game submission fields');

      const resZeroPrice = await request(app).post('/api/games/submit').send({
        title: 'Free Premium Game',
        developer: 'Dev',
        developerEmail: 'dev@test.com',
        genre: 'Puzzle & Logic',
        description: 'Test puzzle game',
        monetizationModel: 'Premium Purchase',
        price: 0
      });
      expect(resZeroPrice.status).toBe(400);
      expect(resZeroPrice.body.error).toBe('Premium games require a price greater than $0');
    });

    it('POST /api/games/:id/play should increment play count and accumulate ad revenue if ad-supported', async () => {
      const initialRes = await request(app).get('/api/games/game-1');
      const initialPlays = initialRes.body.playCount;
      const initialEarnings = initialRes.body.totalEarnings;

      const response = await request(app).post('/api/games/game-1/play');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.playCount).toBe(initialPlays + 1);
      expect(response.body.totalEarnings).toBeGreaterThan(initialEarnings);
    });

    it('POST /api/games/:id/purchase should record monetization transaction with 85% dev payout split', async () => {
      const purchasePayload = {
        userEmail: 'gamer@mawaba.org',
        amount: 4.99,
        type: 'Purchase',
        paymentMethod: 'Credit Card'
      };

      const response = await request(app).post('/api/games/game-2/purchase').send(purchasePayload);
      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Monetization transaction executed successfully');
      expect(response.body.transaction).toHaveProperty('id');
      expect(response.body.transaction.amount).toBe(4.99);
      expect(response.body.transaction.devPayoutAmount).toBe(4.24); // 85% of 4.99 = 4.2415
      expect(response.body.transaction.platformFeeAmount).toBe(0.75);
    });

    it('GET /api/games/monetization/analytics should return revenue summary and developer payouts', async () => {
      const response = await request(app).get('/api/games/monetization/analytics');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('grossRevenue');
      expect(response.body.summary).toHaveProperty('developerPayoutTotal');
      expect(response.body.summary.devShareRate).toBe('85%');
      expect(Array.isArray(response.body.topEarningGames)).toBe(true);
      expect(Array.isArray(response.body.recentTransactions)).toBe(true);
    });
  });

  describe('Sponsorship & GitHub Partnership APIs', () => {
    it('GET /api/sponsorship/tiers should return sponsorship tiers list', async () => {
      const response = await request(app).get('/api/sponsorship/tiers');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4);
      expect(response.body[0]).toHaveProperty('id', 'individual');
      expect(response.body[1]).toHaveProperty('id', 'developer');
    });

    it('GET /api/sponsorship/sponsors should return metrics and list of sponsors', async () => {
      const response = await request(app).get('/api/sponsorship/sponsors');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('metrics');
      expect(response.body.metrics).toHaveProperty('totalAmountRaised');
      expect(response.body.metrics.activeSponsorsCount).toBeGreaterThan(0);
      expect(Array.isArray(response.body.sponsors)).toBe(true);
    });

    it('POST /api/sponsorship/checkout should process Stripe payment checkout', async () => {
      const payload = {
        sponsorName: 'Quantum Tech Labs',
        sponsorEmail: 'support@quantumtech.org',
        tierId: 'corporate',
        billingCycle: 'monthly',
        paymentMethod: 'stripe'
      };

      const response = await request(app).post('/api/sponsorship/checkout').send(payload);
      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Stripe sponsorship checkout session initiated');
      expect(response.body).toHaveProperty('checkoutUrl');
      expect(response.body).toHaveProperty('sessionId');
      expect(response.body.transaction.paymentMethod).toBe('stripe');
      expect(response.body.transaction.amount).toBe(250);
    });

    it('POST /api/sponsorship/checkout should process direct Credit/Debit Card payment', async () => {
      const payload = {
        sponsorName: 'Ada Lovelace Club',
        sponsorEmail: 'ada@lovelace.org',
        tierId: 'developer',
        customAmount: 50,
        billingCycle: 'monthly',
        paymentMethod: 'card',
        cardNumber: '4111 2222 3333 4444',
        cardExpiry: '12/28',
        cardCvc: '123'
      };

      const response = await request(app).post('/api/sponsorship/checkout').send(payload);
      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Card sponsorship payment processed successfully');
      expect(response.body).toHaveProperty('receiptNumber');
      expect(response.body.transaction.amount).toBe(50);
      expect(response.body.transaction.paymentMethod).toBe('card');
    });

    it('POST /api/sponsorship/checkout should process Bank Transfer sponsorship order', async () => {
      const payload = {
        sponsorName: 'Global Education Foundation',
        sponsorEmail: 'grants@globaledu.org',
        tierId: 'strategic',
        billingCycle: 'one-time',
        paymentMethod: 'bank_transfer'
      };

      const response = await request(app).post('/api/sponsorship/checkout').send(payload);
      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Bank transfer sponsorship order created');
      expect(response.body).toHaveProperty('bankDetails');
      expect(response.body.bankDetails).toHaveProperty('iban');
      expect(response.body.bankDetails).toHaveProperty('swiftBic');
      expect(response.body.transaction.status).toBe('pending');
      expect(response.body.transaction.amount).toBe(1000);
    });

    it('POST /api/sponsorship/checkout should reject invalid email or missing fields', async () => {
      const responseMissing = await request(app).post('/api/sponsorship/checkout').send({
        sponsorName: 'Test'
      });
      expect(responseMissing.status).toBe(400);

      const responseInvalidEmail = await request(app).post('/api/sponsorship/checkout').send({
        sponsorName: 'Test',
        sponsorEmail: 'not-an-email',
        paymentMethod: 'stripe'
      });
      expect(responseInvalidEmail.status).toBe(400);
      expect(responseInvalidEmail.body.error).toBe('Invalid sponsor email address format');
    });
  });
});
