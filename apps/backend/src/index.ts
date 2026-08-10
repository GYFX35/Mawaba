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

// Pre-populated Data
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

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- ENDPOINTS ---

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

// 5. Simulated AI Tutor Support API
app.post('/api/ai/tutor', (req: Request, res: Response) => {
  const { question, discipline } = req.body;
  if (!question || !discipline) {
    return res.status(400).json({ error: 'Missing question or discipline' });
  }

  // Simulated professional response from AI Tutor based on the discipline and question
  let answer = `That's an excellent question about ${discipline}! `;
  const lowerQ = question.toLowerCase();

  if (discipline === 'STEM & Sciences') {
    if (lowerQ.includes('quantum') || lowerQ.includes('physics')) {
      answer += "In Quantum Physics, superposition is a fundamental principle. It describes a system's ability to exist in multiple states simultaneously until it is measured. From a developer/platform perspective, we model this using probabilistic distributions or state vectors represented via 3D canvas libraries.";
    } else if (lowerQ.includes('biology') || lowerQ.includes('chemistry')) {
      answer += "Mawaba's science pillar targets biological modeling and green chemistry. Understanding chemical reactions and catalyst pathways is vital for eco-sustainable manufacturing, which our AI service can optimize through deep chemical embedding models.";
    } else {
      answer += "Our STEM curriculum targets critical thinking and experimental methods. The best way to proceed is by setting up a model where students can adjust parameters of simulation models dynamically and see real-time graphical feedback.";
    }
  } else if (discipline === 'Literature & Languages') {
    answer += "Global communication is highly aided by multilingual Large Language Models (LLMs). When publishing content, our API provides automated context-sensitive translations, preserving cultural nuance and idiomatic meaning for readers worldwide.";
  } else if (discipline === 'Business & Economics') {
    answer += "To build a sustainable business model under Mawaba's guidance, you must align your value proposition with the UN Sustainable Development Goals (SDGs). This involves pricing carbon footprints, establishing fair-trade micro-transactions, and leveraging our point-of-sale integrations (like Square or Clover) to track local economic impact.";
  } else {
    answer += "Under the World Development pillar, we prioritize climate tech, green energy infrastructure, and public well-being. By integrating your API with national sensors, developers can track and publish local air/water quality indexes onto Mawaba's decentralized feed.";
  }

  res.json({
    question,
    discipline,
    answer,
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
