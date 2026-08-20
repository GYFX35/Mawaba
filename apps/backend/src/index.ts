import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-Memory Database Interfaces
interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Idea {
  id: string;
  title: string;
  category: 'Health' | 'Education' | 'Business' | 'Development';
  description: string;
  author: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

interface ForumMessage {
  id: string;
  username: string;
  discipline: string;
  message: string;
  timestamp: string;
}

interface Integration {
  name: string;
  connected: boolean;
  desc: string;
  category: string;
}

interface EnvironmentInitiative {
  id: string;
  title: string;
  category: 'Climate Action' | 'Ocean & Marine' | 'Reforestation' | 'Renewable Energy' | 'Circular Economy';
  description: string;
  location: string;
  impact: string;
  author: string;
  upvotes: number;
  createdAt: string;
}

interface EcoPledge {
  id: string;
  name: string;
  country: string;
  pledgeType: string;
  co2ReductionEst: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Stored securely/simulated in-memory
  createdAt: string;
}

// Pre-populated Data
let users: User[] = [
  {
    id: 'u1',
    name: 'Marie Curie',
    email: 'marie@curie.org',
    password: 'password123',
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
  }
];
let ideas: Idea[] = [
  {
    id: '1',
    title: 'Quantum Mechanics Peer Tutoring',
    category: 'Education',
    description: 'A platform bridging physics undergraduates with high school students to simplify complex physics concepts through interactive simulations.',
    author: 'Prof. Marie Curie',
    likes: 12,
    comments: [
      { id: '101', author: 'Albert E.', text: 'Fabulous initiative! Quantum theory is simple when visualised.', createdAt: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: '2',
    title: 'Solar-Powered Mobile Health Clinics',
    category: 'Health',
    description: 'Providing sustainable off-grid healthcare units equipped with tele-medicine systems powered by mini-solar grids in remote rural areas.',
    author: 'Dr. Jane Goodall',
    likes: 24,
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: '3',
    title: 'AI-Driven Supply Chain Logistics',
    category: 'Business',
    description: 'Connecting smallholder farmers directly to city restaurants using a real-time forecasting and optimization API to reduce food waste.',
    author: 'Elon M.',
    likes: 8,
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

let forumMessages: ForumMessage[] = [
  { id: 'm1', username: 'Einstein101', discipline: 'STEM & Sciences', message: 'Has anyone integrated any live quantum simulator on NextJS?', timestamp: new Date(Date.now() - 100000).toISOString() },
  { id: 'm2', username: 'AdaLovelace', discipline: 'STEM & Sciences', message: 'Yes! Check out React-Three-Fiber, it works wonders for 3D state representations.', timestamp: new Date(Date.now() - 50000).toISOString() },
  { id: 'm3', username: 'GutenbergPioneer', discipline: 'Literature & Languages', message: 'I am planning to launch a creative writing challenge next week.', timestamp: new Date(Date.now() - 20000).toISOString() }
];

let integrations: Integration[] = [
  { name: 'NCR', connected: false, desc: 'Global leader in consumer transaction technologies.', category: 'Payments' },
  { name: 'Revel', connected: true, desc: 'Cloud-based POS system for restaurants and retailers.', category: 'POS' },
  { name: 'Lightspeed', connected: false, desc: 'Commerce platform for retail and hospitality businesses.', category: 'E-commerce' },
  { name: 'Square', connected: false, desc: 'Comprehensive suite of business tools and payment solutions.', category: 'Payments' },
  { name: 'Toast', connected: true, desc: 'Built specifically for restaurants to streamline operations.', category: 'POS' },
  { name: 'Shopline', connected: false, desc: 'Global smart commerce platform for merchants.', category: 'E-commerce' },
  { name: 'Clover', connected: false, desc: 'Integrated point of sale systems for all business types.', category: 'POS' }
];

let environmentInitiatives: EnvironmentInitiative[] = [
  {
    id: 'env-1',
    title: 'Coastal Mangrove Ecosystem Restoration',
    category: 'Ocean & Marine',
    description: 'Planting native red mangrove trees along coastal zones to prevent storm surges, enhance ocean biodiversity, and sequester blue carbon.',
    location: 'Mombasa, Kenya',
    impact: '150,000 Trees Planted • 45,000 Tons CO2 Sequestered/Yr',
    author: 'Blue Planet Alliance',
    upvotes: 42,
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    id: 'env-2',
    title: 'Community Solar Microgrid & Energy Storage',
    category: 'Renewable Energy',
    description: 'Installing decentralized solar microgrids in rural off-grid agricultural communities to reduce diesel generator reliance.',
    location: 'Oaxaca, Mexico',
    impact: '1.2 MW Clean Energy • 3,500 Families Powered',
    author: 'Solar Action Network',
    upvotes: 38,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'env-3',
    title: 'Zero-Waste Circular E-Waste Upcycling Hub',
    category: 'Circular Economy',
    description: 'Recovering rare earth metals and re-purposing old electronics to prevent toxic landfill leachate.',
    location: 'Accra, Ghana',
    impact: '85 Tons E-Waste Processed • 98% Material Recovery Rate',
    author: 'EcoTech Innovations',
    upvotes: 29,
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
  },
  {
    id: 'env-4',
    title: 'Urban Biodiversity Corridors & Native Pollinators',
    category: 'Reforestation',
    description: 'Transforming vacant urban spaces into indigenous plant refuges supporting native bees, birds, and insects.',
    location: 'Toronto, Canada',
    impact: '12 Green Corridors Established • 50+ Native Species Supported',
    author: 'Green Canopy Initiative',
    upvotes: 31,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

let ecoPledges: EcoPledge[] = [
  { id: 'p-1', name: 'Sophia Chen', country: 'Singapore', pledgeType: 'Switching to 100% Renewable Home Power', co2ReductionEst: 2400, createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
  { id: 'p-2', name: 'Amina Diallo', country: 'Senegal', pledgeType: 'Zero Single-Use Plastics & Active Composting', co2ReductionEst: 650, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'p-3', name: 'Lucas Rossi', country: 'Brazil', pledgeType: 'Planting 10 Native Trees Annually', co2ReductionEst: 1200, createdAt: new Date(Date.now() - 3600000 * 10).toISOString() }
];

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- ENDPOINTS ---

// 0. User Account & Auth APIs
app.post('/api/users/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: generateId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password, // In a real DB with auth, password would be hashed
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  // Exclude password from output response
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    message: 'User account created successfully',
    user: userWithoutPassword
  });
});

app.post('/api/users/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    message: 'Login successful',
    user: userWithoutPassword
  });
});

app.get('/api/users/me', (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter required' });
  }

  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// 1. Health Status API
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Mawaba Core API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 2. Ideas/Opinions APIs
app.get('/api/ideas', (req: Request, res: Response) => {
  res.json(ideas);
});

app.post('/api/ideas', (req: Request, res: Response) => {
  const { title, category, description, author } = req.body;
  if (!title || !category || !description || !author) {
    return res.status(400).json({ error: 'Missing required fields: title, category, description, author' });
  }

  const newIdea: Idea = {
    id: generateId(),
    title,
    category,
    description,
    author,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString()
  };

  ideas.unshift(newIdea); // Add to the top
  res.status(201).json(newIdea);
});

app.post('/api/ideas/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const idea = ideas.find(i => i.id === id);
  if (!idea) {
    return res.status(404).json({ error: 'Idea not found' });
  }

  idea.likes += 1;
  res.json({ success: true, likes: idea.likes });
});

app.post('/api/ideas/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ error: 'Missing author or text' });
  }

  const idea = ideas.find(i => i.id === id);
  if (!idea) {
    return res.status(404).json({ error: 'Idea not found' });
  }

  const newComment: Comment = {
    id: generateId(),
    author,
    text,
    createdAt: new Date().toISOString()
  };

  idea.comments.push(newComment);
  res.status(201).json(newComment);
});

// 3. Forums/Communication APIs
app.get('/api/forums/messages', (req: Request, res: Response) => {
  const { discipline } = req.query;
  if (discipline) {
    const filtered = forumMessages.filter(m => m.discipline === String(discipline));
    return res.json(filtered);
  }
  res.json(forumMessages);
});

app.post('/api/forums/messages', (req: Request, res: Response) => {
  const { username, message, discipline } = req.body;
  if (!username || !message || !discipline) {
    return res.status(400).json({ error: 'Missing required fields: username, message, discipline' });
  }

  const newMessage: ForumMessage = {
    id: generateId(),
    username,
    discipline,
    message,
    timestamp: new Date().toISOString()
  };

  forumMessages.push(newMessage);
  res.status(201).json(newMessage);
});

// 4. POS Integrations APIs
app.get('/api/integrations', (req: Request, res: Response) => {
  res.json(integrations);
});

app.post('/api/integrations/:name/connect', (req: Request, res: Response) => {
  const { name } = req.params;
  const integration = integrations.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (integration) {
    integration.connected = true;
    res.json({ success: true, message: `Connected to ${integration.name} successfully`, integration });
  } else {
    res.status(404).json({ success: false, message: 'Integration not found' });
  }
});

app.post('/api/integrations/:name/disconnect', (req: Request, res: Response) => {
  const { name } = req.params;
  const integration = integrations.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (integration) {
    integration.connected = false;
    res.json({ success: true, message: `Disconnected from ${integration.name} successfully`, integration });
  } else {
    res.status(404).json({ success: false, message: 'Integration not found' });
  }
});

// 4b. Environment Protection APIs
app.get('/api/environment/initiatives', (req: Request, res: Response) => {
  const { category } = req.query;
  if (category) {
    const filtered = environmentInitiatives.filter(
      i => i.category.toLowerCase() === String(category).toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(environmentInitiatives);
});

app.post('/api/environment/initiatives', (req: Request, res: Response) => {
  const { title, category, description, location, impact, author } = req.body;
  if (!title || !category || !description || !location || !author) {
    return res.status(400).json({ error: 'Missing required fields: title, category, description, location, author' });
  }

  const newInitiative: EnvironmentInitiative = {
    id: 'env-' + generateId(),
    title: title.trim(),
    category,
    description: description.trim(),
    location: location.trim(),
    impact: impact ? impact.trim() : 'Active Community Project',
    author: author.trim(),
    upvotes: 1,
    createdAt: new Date().toISOString()
  };

  environmentInitiatives.unshift(newInitiative);
  res.status(201).json(newInitiative);
});

app.post('/api/environment/initiatives/:id/upvote', (req: Request, res: Response) => {
  const { id } = req.params;
  const initiative = environmentInitiatives.find(i => i.id === id);
  if (!initiative) {
    return res.status(404).json({ error: 'Environment initiative not found' });
  }

  initiative.upvotes += 1;
  res.json({ success: true, upvotes: initiative.upvotes, initiative });
});

app.get('/api/environment/pledges', (req: Request, res: Response) => {
  const totalCo2Saved = ecoPledges.reduce((acc, p) => acc + p.co2ReductionEst, 0);
  res.json({
    totalPledges: ecoPledges.length,
    totalCo2ReductionKg: totalCo2Saved,
    recentPledges: ecoPledges
  });
});

app.post('/api/environment/pledges', (req: Request, res: Response) => {
  const { name, country, pledgeType, co2ReductionEst } = req.body;
  if (!name || !country || !pledgeType) {
    return res.status(400).json({ error: 'Missing required fields: name, country, pledgeType' });
  }

  const newPledge: EcoPledge = {
    id: 'p-' + generateId(),
    name: name.trim(),
    country: country.trim(),
    pledgeType: pledgeType.trim(),
    co2ReductionEst: typeof co2ReductionEst === 'number' && co2ReductionEst > 0 ? co2ReductionEst : 500,
    createdAt: new Date().toISOString()
  };

  ecoPledges.unshift(newPledge);
  const totalCo2Saved = ecoPledges.reduce((acc, p) => acc + p.co2ReductionEst, 0);

  res.status(201).json({
    message: 'Eco-pledge recorded successfully',
    pledge: newPledge,
    totalPledges: ecoPledges.length,
    totalCo2ReductionKg: totalCo2Saved
  });
});

// 6. World Bank Open Data APIs
app.get('/api/worldbank/countries', async (req: Request, res: Response) => {
  try {
    const { page = '1', per_page = '20', search = '' } = req.query;
    const response = await fetch(`https://api.worldbank.org/v2/country?format=json&per_page=300`);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch countries from World Bank API' });
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length < 2) {
      return res.status(502).json({ error: 'Unexpected response format from World Bank API' });
    }

    const metadata = data[0];
    let rawCountries = data[1] || [];

    // Filter out aggregate groupings if user wants specific country filtering or search
    if (search) {
      const q = String(search).toLowerCase();
      rawCountries = rawCountries.filter((c: any) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.capitalCity && c.capitalCity.toLowerCase().includes(q))
      );
    }

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(per_page), 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedCountries = rawCountries.slice(startIndex, startIndex + limitNum);

    res.json({
      page: pageNum,
      per_page: limitNum,
      total: rawCountries.length,
      totalPages: Math.ceil(rawCountries.length / limitNum),
      countries: paginatedCountries.map((c: any) => ({
        id: c.id,
        iso2Code: c.iso2Code,
        name: c.name,
        region: c.region?.value || 'N/A',
        incomeLevel: c.incomeLevel?.value || 'N/A',
        lendingType: c.lendingType?.value || 'N/A',
        capitalCity: c.capitalCity || 'N/A',
        longitude: c.longitude,
        latitude: c.latitude
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while fetching World Bank countries data' });
  }
});

app.get('/api/worldbank/indicators', async (req: Request, res: Response) => {
  try {
    const country = (req.query.country as string) || 'WLD';
    const indicator = (req.query.indicator as string) || 'NY.GDP.MKTP.CD';
    const date = req.query.date as string;

    let url = `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=50`;
    if (date) {
      url += `&date=${date}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch indicator from World Bank API' });
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length < 2) {
      return res.status(404).json({ error: 'Indicator data not found for given parameters', data });
    }

    const meta = data[0];
    const rawData = data[1] || [];

    const formattedData = rawData.map((item: any) => ({
      indicatorId: item.indicator?.id,
      indicatorName: item.indicator?.value,
      countryId: item.countryiso3code || item.country?.id,
      countryName: item.country?.value,
      year: item.date,
      value: item.value,
      unit: item.unit || ''
    }));

    res.json({
      metadata: meta,
      indicatorName: formattedData[0]?.indicatorName || indicator,
      countryName: formattedData[0]?.countryName || country,
      data: formattedData
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while fetching World Bank indicator data' });
  }
});

app.get('/api/worldbank/projects', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || 'development';
    const rows = (req.query.rows as string) || '10';

    const url = `https://search.worldbank.org/api/v2/projects?format=json&rows=${rows}&qterm=${encodeURIComponent(q)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch projects from World Bank API' });
    }

    const data = await response.json();
    const projectsObj = data.projects || {};

    const projectsList = Object.keys(projectsObj)
      .filter(key => key !== 'facets')
      .map(key => {
        const p = projectsObj[key];
        return {
          id: p.id,
          project_name: p.project_name,
          regionname: p.regionname,
          countryname: Array.isArray(p.countryname) ? p.countryname.join(', ') : p.countryshortname || 'Global',
          totalamt: p.totalamt,
          grantamt: p.grantamt || '0',
          boardapprovaldate: p.boardapprovaldate,
          closingdate: p.closingdate,
          status: p.status || p.projectstatusdisplay,
          url: p.url,
          sector: p.sector_namecode ? p.sector_namecode.map((s: any) => s.name).join(', ') : 'N/A'
        };
      });

    res.json({
      query: q,
      total: projectsList.length,
      projects: projectsList
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while fetching World Bank projects data' });
  }
});

// 5. AI Tutor Support API with Google Gemini & OpenAI Integration
app.post('/api/ai/tutor', async (req: Request, res: Response) => {
  const { question, discipline, level = 'Intermediate', responseType = 'Explanation', provider = 'auto' } = req.body;
  if (!question || !discipline) {
    return res.status(400).json({ error: 'Missing question or discipline' });
  }

  const lowerQ = question.toLowerCase();
  let answer = '';
  let followUpQuestions: string[] = [];
  let keyTakeaways: string[] = [];
  let quiz: { question: string; options: string[]; answer: string; explanation: string } | null = null;
  let activeProvider = provider;
  let modelUsed = 'Mawaba Simulated AI Engine';

  // Handle Google Gemini provider call if requested or available
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (provider === 'gemini' && geminiApiKey) {
    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI Tutor in ${discipline} for a ${level} student. User question: "${question}". Response format requested: ${responseType}.`
            }]
          }]
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          answer = generatedText;
          activeProvider = 'gemini';
          modelUsed = 'Gemini 1.5 Flash';
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to simulated engine", err);
    }
  }

  if (provider === 'openai' && openaiApiKey) {
    try {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `You are an AI Tutor in ${discipline} for a ${level} level student.` },
            { role: 'user', content: question }
          ]
        })
      });

      if (openaiRes.ok) {
        const data = await openaiRes.json();
        const generatedText = data.choices?.[0]?.message?.content;
        if (generatedText) {
          answer = generatedText;
          activeProvider = 'openai';
          modelUsed = 'GPT-4o mini';
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to simulated engine", err);
    }
  }

  // Fallback or default content generation logic if live API answer wasn't set
  if (!answer) {
    if (provider === 'gemini') {
      activeProvider = 'gemini-simulated';
      modelUsed = 'Gemini 1.5 Flash (Simulated)';
    } else if (provider === 'openai') {
      activeProvider = 'openai-simulated';
      modelUsed = 'GPT-4o mini (Simulated)';
    } else {
      activeProvider = 'auto';
      modelUsed = 'Mawaba AI Master Engine';
    }

  // Level prefix customization
  const levelPrefix = level === 'Beginner'
    ? 'In simple terms: '
    : level === 'Advanced'
    ? 'Deep Academic Breakdown: '
    : 'Conceptual Explanation: ';

  if (discipline === 'STEM & Sciences' || discipline === 'Sciences') {
    if (lowerQ.includes('quantum') || lowerQ.includes('physics')) {
      answer = `${levelPrefix}Quantum physics focuses on the behavior of matter and light at subatomic levels. A key concept is superposition, where particles exist in multiple states simultaneously until measured. We model these probabilities with state vectors and visual simulations.`;
      keyTakeaways = [
        'Superposition allows systems to exist in multiple potential states at once.',
        'Wave-particle duality illustrates that subatomic entities exhibit properties of both particles and waves.',
        'Quantum state collapse occurs upon direct measurement.'
      ];
      followUpQuestions = [
        'How does quantum entanglement differ from classical correlation?',
        'What are the real-world applications of quantum computing in cryptography?'
      ];
      quiz = {
        question: 'What happens to a quantum system upon measurement?',
        options: ['It remains in superposition', 'It collapses into a single definite state', 'It disappears completely', 'It accelerates to light speed'],
        answer: 'It collapses into a single definite state',
        explanation: 'Measurement causes the quantum superposition to collapse into a single measurable eigenstate.'
      };
    } else if (lowerQ.includes('biology') || lowerQ.includes('chemistry') || lowerQ.includes('water')) {
      answer = `${levelPrefix}Green chemistry and biological modeling allow us to simulate reaction pathways, minimize chemical waste, and synthesize eco-friendly materials using AI-guided catalyst optimization.`;
      keyTakeaways = [
        'Catalysts reduce activation energy required for bio-chemical processes.',
        'Simulated molecular modeling speeds up green solution discovery.',
        'Clean water ecosystems rely on real-time microbial and chemical sensing.'
      ];
      followUpQuestions = [
        'How can bio-catalysts reduce industrial environmental impact?',
        'What sensors are best for tracking watershed contamination in real time?'
      ];
      quiz = {
        question: 'What is the primary function of a catalyst in a chemical reaction?',
        options: ['Increase temperature', 'Lower activation energy', 'Consume all reactants', 'Prevent reaction'],
        answer: 'Lower activation energy',
        explanation: 'Catalysts speed up chemical reactions by lowering the required activation energy without being consumed.'
      };
    } else {
      answer = `${levelPrefix}STEM education empowers problem-solving through hypothesis testing, algorithmic thinking, and empirical observation. Virtual laboratories enable remote experimentations across disciplines.`;
      keyTakeaways = [
        'Empirical verification is core to scientific reasoning.',
        'Interactive simulations make complex physical principles intuitive.',
        'Data-driven models allow real-time feedback loops during experiments.'
      ];
      followUpQuestions = [
        'How do interactive simulations improve learning retention in STEM?',
        'Which programming tools best support dynamic physics modeling?'
      ];
      quiz = {
        question: 'What is the first step in the scientific method?',
        options: ['Drawing conclusions', 'Observation and asking a question', 'Publishing results', 'Skipping hypotheses'],
        answer: 'Observation and asking a question',
        explanation: 'The scientific method begins with observing a phenomenon and forming a specific question.'
      };
    }
  } else if (discipline === 'Literature & Languages' || discipline === 'Literature') {
    answer = `${levelPrefix}Language and literature represent the human experience across cultures. Modern natural language processing enables real-time context-aware translation, preserving cultural metaphors and idiomatic expressions across global works.`;
    keyTakeaways = [
      'Translation requires understanding cultural context, not just word substitution.',
      'Literary analysis uncovers universal themes across historical eras.',
      'LLMs assist in preserve endangered languages through oral and text digitizations.'
    ];
    followUpQuestions = [
      'How do cultural idioms challenge machine translation systems?',
      'In what ways does comparative literature foster cross-cultural empathy?'
    ];
    quiz = {
      question: 'What does "nuance" mean in literary translation?',
      options: ['Exact literal dictionary word swap', 'Subtle distinction in meaning or expression', 'Grammatical errors', 'Rhyming scheme'],
      answer: 'Subtle distinction in meaning or expression',
      explanation: 'Nuance refers to subtle variations in tone, emotion, or cultural meaning that must be preserved during translation.'
    };
  } else if (discipline === 'Business & Economics' || discipline === 'Business') {
    answer = `${levelPrefix}Building resilient businesses requires aligning economic value with global sustainability targets. By combining AI forecasting with point-of-sale integrations, organizations optimize supply chains and reduce carbon footprints.`;
    keyTakeaways = [
      'Triple bottom line focuses on People, Planet, and Profit.',
      'Real-time supply chain telemetry reduces inventory waste.',
      'Micro-finance and open APIs empower entrepreneurs in emerging economies.'
    ];
    followUpQuestions = [
      'How does micro-financing impact regional economic growth?',
      'What metrics best measure a business\'s environmental sustainability?'
    ];
    quiz = {
      question: 'What are the three pillars of the "Triple Bottom Line"?',
      options: ['Product, Price, Promotion', 'People, Planet, Profit', 'Sales, Revenue, Growth', 'Assets, Liabilities, Equity'],
      answer: 'People, Planet, Profit',
      explanation: 'The Triple Bottom Line framework measures social, environmental, and financial impact.'
    };
  } else {
    answer = `${levelPrefix}World development focuses on equitable growth, clean infrastructure, public health access, and sustainable technology. Open data networks connect local community metrics with global initiatives.`;
    keyTakeaways = [
      'Sustainable Development Goals (SDGs) provide a shared framework for progress.',
      'De-centralized sensor networks enable transparent environmental monitoring.',
      'Community-led innovations scale effectively with open platform APIs.'
    ];
    followUpQuestions = [
      'How do open data platforms improve disaster response efficiency?',
      'What role does clean energy infrastructure play in rural development?'
    ];
    quiz = {
      question: 'Which international framework guides global sustainability targets?',
      options: ['UN Sustainable Development Goals (SDGs)', 'World Trade Agreement', 'Global Tech Standard', 'ISO 9001'],
      answer: 'UN Sustainable Development Goals (SDGs)',
      explanation: 'The UN SDGs outline 17 interconnected goals for global peace, prosperity, and environmental protection.'
    };
  }

  // Handle specific responseType modifications
  if (responseType === 'Quiz') {
    answer = `Here is a quick practice quiz on ${discipline} to test your understanding of "${question}":`;
  } else if (responseType === 'Key Takeaways') {
    answer = `Here are the key study takeaways for "${question}" (${level} level):`;
  }
  }

  res.json({
    question,
    discipline,
    level,
    responseType,
    provider: activeProvider,
    model: modelUsed,
    answer,
    keyTakeaways,
    followUpQuestions,
    quiz,
    tutorName: 'Mawaba AI Master Tutor',
    timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
  });
}

export default app;
