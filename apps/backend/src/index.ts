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

// 4. Notion Publishing Integration API
app.post('/api/notion/publish', async (req: Request, res: Response) => {
  const { notionToken, parentPageId, title, category = 'General', author = 'Anonymous', content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Missing required fields: title, content' });
  }

  // If notionToken or parentPageId is provided, attempt call to Notion API if node-fetch/https available
  if (notionToken && parentPageId) {
    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          parent: { page_id: parentPageId },
          properties: {
            title: {
              title: [{ text: { content: title } }]
            }
          },
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [{ text: { content: `[Category: ${category} | Author: ${author}]\n\n${content}` } }]
              }
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json() as { id?: string; url?: string };
        return res.status(201).json({
          success: true,
          message: 'Successfully published to Notion workspace page',
          notionPageId: data.id || 'notion_page_created',
          notionUrl: data.url || `https://notion.so/${parentPageId}`
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          success: false,
          error: 'Notion API returned error',
          details: errorData
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: 'Failed to contact Notion API',
        details: err.message
      });
    }
  }

  // Simulated fallback publishing response when running without live Notion secret
  const simulatedId = generateId() + generateId();
  return res.status(201).json({
    success: true,
    message: 'Successfully published item to Notion hub (simulated response)',
    notionPageId: simulatedId,
    notionUrl: `https://notion.so/${simulatedId}`
  });
});

// 5. POS Integrations APIs
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
  const { question, discipline, level = 'Intermediate', responseType = 'Explanation' } = req.body;
  if (!question || !discipline) {
    return res.status(400).json({ error: 'Missing question or discipline' });
  }

  const lowerQ = question.toLowerCase();
  let answer = '';
  let followUpQuestions: string[] = [];
  let keyTakeaways: string[] = [];
  let quiz: { question: string; options: string[]; answer: string; explanation: string } | null = null;

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

  res.json({
    question,
    discipline,
    level,
    responseType,
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
