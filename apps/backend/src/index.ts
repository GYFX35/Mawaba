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
  category: 'Health' | 'Education' | 'Business' | 'Development' | 'Climate';
  description: string;
  author: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

interface ClimateSolution {
  id: string;
  title: string;
  category: 'Renewable Energy' | 'Carbon Capture' | 'Sustainable Agriculture' | 'Circular Economy' | 'Ocean & Forest' | 'Smart Mobility';
  description: string;
  impactScore: number; // 1-100
  reductionPotentialGt: number; // Gigatons CO2 equivalent per year globally
  implementationCost: 'Low' | 'Medium' | 'High' | 'Capital Intensive';
  scalability: 'Local' | 'Regional' | 'Global';
  keyTechnologies: string[];
  sdgGoals: number[];
  caseStudy: string;
}

interface ClimateInitiative {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  organizer: string;
  targetImpact: string;
  supporters: number;
  status: 'Proposed' | 'Active' | 'Completed';
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

interface ChatMessageItem {
  id: string;
  username: string;
  message: string;
  room: string;
  image?: string;
  video?: string;
  avatar?: string;
  timestamp: string;
}

interface ForumReplyItem {
  id: string;
  author: string;
  text: string;
  image?: string;
  video?: string;
  createdAt: string;
}

interface ForumTopicItem {
  id: string;
  title: string;
  category: 'General' | 'STEM & AI' | 'Climate & Earth' | 'Business & Trade' | 'Literature & Culture';
  content: string;
  author: string;
  image?: string;
  video?: string;
  likes: number;
  replies: ForumReplyItem[];
  createdAt: string;
}

interface CultureComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface CultureItem {
  id: string;
  title: string;
  country: string;
  region: 'Africa' | 'Asia-Pacific' | 'Europe' | 'Americas' | 'Middle East' | 'Oceania';
  category: 'Tradition' | 'Festival' | 'Music & Dance' | 'Culinary Heritage' | 'Clothing & Crafts' | 'History & Folklore';
  description: string;
  author: string;
  image?: string;
  video?: string;
  likes: number;
  comments: CultureComment[];
  createdAt: string;
}

interface DtcProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image?: string;
  rating: number;
  createdAt: string;
}

interface DtcOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface DtcOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: DtcOrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  createdAt: string;
}

interface GameItem {
  id: string;
  title: string;
  developer: string;
  developerEmail: string;
  genre: 'Action & Arcade' | 'Puzzle & Logic' | 'Strategy & Simulation' | 'Educational & Sci-Fi' | 'Eco & Climate';
  description: string;
  thumbnailUrl: string;
  gameUrl: string; // Embeddable HTML5 URL or game engine canvas code
  monetizationModel: 'Free' | 'Ad-Supported' | 'Premium Purchase' | 'In-Game Pass / Subscription';
  price: number; // $0 if Free or Ad-Supported, otherwise purchase price
  playCount: number;
  rating: number;
  totalEarnings: number; // Revenue accumulated from purchases/ads/tips
  devRevenueShare: number; // e.g. 85 for 85% developer payout
  status: 'Approved' | 'Pending Review' | 'Rejected';
  createdAt: string;
}

interface GameTransaction {
  id: string;
  gameId: string;
  gameTitle: string;
  userEmail: string;
  amount: number;
  devPayoutAmount: number;
  platformFeeAmount: number;
  type: 'Purchase' | 'In-Game Microtransaction' | 'Developer Tip' | 'Ad View Revenue';
  paymentMethod: string;
  timestamp: string;
}

// Pre-populated Climate Data
let climateSolutions: ClimateSolution[] = [
  {
    id: 'cs1',
    title: 'Utility-Scale Microgrid Solar & Battery Storage',
    category: 'Renewable Energy',
    description: 'Deploying modular solar photovoltaic arrays coupled with lithium-iron-phosphate (LFP) battery energy storage systems (BESS) for off-grid communities and resilient urban grids.',
    impactScore: 95,
    reductionPotentialGt: 7.2,
    implementationCost: 'Medium',
    scalability: 'Global',
    keyTechnologies: ['Borehole Thermal Storage', 'Perovskite Solar Cells', 'Smart Inverters'],
    sdgGoals: [7, 11, 13],
    caseStudy: 'Implemented across rural electrification projects in East Africa and island networks in the South Pacific.'
  },
  {
    id: 'cs2',
    title: 'Direct Air Capture (DAC) & Mineralization',
    category: 'Carbon Capture',
    description: 'Extracting ambient CO2 directly from atmosphere using solid-sorbent technology and permanently locking it into basaltic rock Formations as carbonate minerals.',
    impactScore: 88,
    reductionPotentialGt: 5.5,
    implementationCost: 'Capital Intensive',
    scalability: 'Global',
    keyTechnologies: ['Solid Sorbent Filters', 'Geothermal Energy Extraction', 'Carbonation Pumps'],
    sdgGoals: [9, 12, 13],
    caseStudy: 'Mammoth plant operations in Iceland capturing and mineralizing 36,000 tons of CO2 annually.'
  },
  {
    id: 'cs3',
    title: 'Regenerative Agriculture & Biochar Soil Enhancement',
    category: 'Sustainable Agriculture',
    description: 'Combining minimal tillage, cover cropping, and pyrolyzed agricultural biomass (biochar) to restore topsoil fertility while sequestering carbon for centuries.',
    impactScore: 91,
    reductionPotentialGt: 4.8,
    implementationCost: 'Low',
    scalability: 'Global',
    keyTechnologies: ['Biomass Pyrolysis Reactors', 'Soil Carbon Remote Sensing', 'No-Till Seeders'],
    sdgGoals: [2, 13, 15],
    caseStudy: 'Smallholder farming collectives in Latin America improving yield by 25% while building persistent soil carbon.'
  },
  {
    id: 'cs4',
    title: 'Closed-Loop Plastic Recycling & Bio-Polymers',
    category: 'Circular Economy',
    description: 'Replacing fossil-based plastics with enzymatic depolymerization recycling and algae-derived bio-degradable polymer alternatives.',
    impactScore: 84,
    reductionPotentialGt: 3.2,
    implementationCost: 'Medium',
    scalability: 'Regional',
    keyTechnologies: ['Enzymatic Recycling', 'Microalgae Cultivation', 'Near-Infrared Sorting'],
    sdgGoals: [9, 12, 14],
    caseStudy: 'Automated municipal sorting plants converting mixed waste plastics back into virgin-grade resin.'
  },
  {
    id: 'cs5',
    title: 'Blue Carbon & Coastal Mangrove Restoration',
    category: 'Ocean & Forest',
    description: 'Protecting and restoring mangrove, seagrass, and salt marsh ecosystems which sequester up to 10x more carbon per hectare than terrestrial tropical rainforests.',
    impactScore: 96,
    reductionPotentialGt: 3.9,
    implementationCost: 'Low',
    scalability: 'Global',
    keyTechnologies: ['Drone Aerial Seeding', 'Satellite Bathymetry', 'Hydrodynamic Sensors'],
    sdgGoals: [13, 14, 15],
    caseStudy: 'Sundarbans mangrove restoration project safeguarding coastal defense for over 2 million residents.'
  },
  {
    id: 'cs6',
    title: 'Fleet Electrification & AI Route Optimization',
    category: 'Smart Mobility',
    description: 'Replacing diesel municipal transit and last-mile commercial delivery fleets with zero-emission electric vehicles guided by real-time AI grid load balancing.',
    impactScore: 89,
    reductionPotentialGt: 4.1,
    implementationCost: 'High',
    scalability: 'Global',
    keyTechnologies: ['V2G (Vehicle-to-Grid)', 'Ultra-Fast DC Charging', 'Predictive AI Routing'],
    sdgGoals: [7, 11, 13],
    caseStudy: 'Shenzhen municipal bus fleet transition fully converting 16,000+ public transit vehicles to clean electric power.'
  }
];

let climateInitiatives: ClimateInitiative[] = [
  {
    id: 'ci1',
    title: 'Community Urban Forest Canopy expansion',
    location: 'Nairobi, Kenya',
    category: 'Ocean & Forest',
    description: 'Planting 50,000 native tree saplings across urban school grounds and riverbanks to mitigate urban heat islands.',
    organizer: 'Green Canopy Initiative',
    targetImpact: '500 Tons CO2/yr & 3°C Local Cooling',
    supporters: 342,
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    id: 'ci2',
    title: 'Solar Power Co-op for Smallholder Farmers',
    location: 'Oaxaca, Mexico',
    category: 'Renewable Energy',
    description: 'Installing solar-powered water irrigation pumps to replace diesel engines for 120 agricultural families.',
    organizer: 'Sol de la Tierra',
    targetImpact: '180 Tons CO2/yr',
    supporters: 215,
    status: 'Proposed',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  }
];

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
  },
  {
    id: '4',
    title: 'Floating Solar Arrays on Water Reservoirs',
    category: 'Climate',
    description: 'Deploying dual-purpose floating photovoltaic panels on hydroelectric and municipal reservoirs to prevent water evaporation while generating clean power.',
    author: 'Dr. Katherine Hayhoe',
    likes: 31,
    comments: [
      { id: '102', author: 'Renewable Fan', text: 'Reduces algae growth while boosting panel efficiency due to water cooling!', createdAt: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
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

let games: GameItem[] = [
  {
    id: 'game-1',
    title: 'EcoGrid: Renewable Energy Tycoon',
    developer: 'AeroGames Studio',
    developerEmail: 'dev@aerogames.io',
    genre: 'Eco & Climate',
    description: 'Build and optimize clean solar, wind, and hydroelectric power grids across global cities while balancing carbon targets and community budgets.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    gameUrl: 'https://cdn.html5games.com/ecogrid',
    monetizationModel: 'Ad-Supported',
    price: 0,
    playCount: 1420,
    rating: 4.9,
    totalEarnings: 345.50,
    devRevenueShare: 85,
    status: 'Approved',
    createdAt: new Date(Date.now() - 3600000 * 24 * 15).toISOString()
  },
  {
    id: 'game-2',
    title: 'Quantum Code Odyssey',
    developer: 'Cygnus Interactive',
    developerEmail: 'contact@cygnus.dev',
    genre: 'Educational & Sci-Fi',
    description: 'Navigate quantum sub-atomic mazes using real quantum logic gates (Hadamard, CNOT, Pauli-X) to solve puzzles and unlock advanced computing levels.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    gameUrl: 'https://cdn.html5games.com/quantumcode',
    monetizationModel: 'Premium Purchase',
    price: 4.99,
    playCount: 890,
    rating: 4.8,
    totalEarnings: 820.00,
    devRevenueShare: 85,
    status: 'Approved',
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  },
  {
    id: 'game-3',
    title: 'Space Frontier: Orbital Logistics',
    developer: 'Starbound Indie',
    developerEmail: 'lunar@starbound.org',
    genre: 'Action & Arcade',
    description: 'Action-packed retro arcade simulator managing satellite orbits, space debris removal, and interplanetary cargo drop-offs.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    gameUrl: 'https://cdn.html5games.com/orbital',
    monetizationModel: 'In-Game Pass / Subscription',
    price: 2.99,
    playCount: 2310,
    rating: 4.7,
    totalEarnings: 1120.80,
    devRevenueShare: 85,
    status: 'Approved',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  }
];

let gameTransactions: GameTransaction[] = [
  {
    id: 'gtx-101',
    gameId: 'game-2',
    gameTitle: 'Quantum Code Odyssey',
    userEmail: 'marie@curie.org',
    amount: 4.99,
    devPayoutAmount: 4.24,
    platformFeeAmount: 0.75,
    type: 'Purchase',
    paymentMethod: 'Credit Card',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'gtx-102',
    gameId: 'game-3',
    gameTitle: 'Space Frontier: Orbital Logistics',
    userEmail: 'isaac@gravity.org',
    amount: 2.99,
    devPayoutAmount: 2.54,
    platformFeeAmount: 0.45,
    type: 'In-Game Microtransaction',
    paymentMethod: 'Mawaba Pay',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

let cultureItems: CultureItem[] = [
  {
    id: 'cult-1',
    title: 'Maasai Adumu Warrior Dance & Heritage',
    country: 'Kenya & Tanzania',
    region: 'Africa',
    category: 'Music & Dance',
    description: 'The iconic Adumu jumping dance performed during Eunoto coming-of-age ceremonies. Maasai warriors gather in circles singing rhythmic chants while jumping gracefully to exhibit endurance and strength.',
    author: 'Joseph Ole Kipeno',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    likes: 64,
    comments: [
      { id: 'cc-1', author: 'Amina Diallo', text: 'Preserving African oral traditions and ceremonial dances is essential for global heritage!', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'cult-2',
    title: 'Gion Matsuri Ancient Float Procession',
    country: 'Japan',
    region: 'Asia-Pacific',
    category: 'Festival',
    description: 'Celebrated since 869 AD in Kyoto, Gion Matsuri features massive Yamaboko floats meticulously crafted without a single nail, adorned with centuries-old tapestries and traditional Gion-bayashi music.',
    author: 'Kenji Takahashi',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    likes: 82,
    comments: [
      { id: 'cc-2', author: 'Yuki Tanaka', text: 'The woodwork craftsmanship and float decorations are unmatched.', createdAt: new Date(Date.now() - 3600000 * 12).toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'cult-3',
    title: 'Inti Raymi Sun Festival Ceremony',
    country: 'Peru',
    region: 'Americas',
    category: 'Tradition',
    description: 'An ancient Inca solstice ceremony held at Sacsayhuamán in Cusco. Re-enactors honor Inti (the Sun God) with traditional Quechua music, golden costumes, and ancestral offerings.',
    author: 'Camila Quispe',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    likes: 57,
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString()
  },
  {
    id: 'cult-4',
    title: 'Dabke Folk Dance & Levantine Rhythms',
    country: 'Lebanon & Palestine',
    region: 'Middle East',
    category: 'Music & Dance',
    description: 'Dabke is a traditional Levantine line dance uniting communities during weddings, harvests, and celebrations. Dancers stamp synchronization guided by the Lawweeh leader and rhythmic Mijwiz flutes.',
    author: 'Tariq Mansour',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnTheLakeside.mp4',
    likes: 71,
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
  },
  {
    id: 'cult-5',
    title: 'Venetian Carnival Mask Handcrafting',
    country: 'Italy',
    region: 'Europe',
    category: 'Clothing & Crafts',
    description: 'Master artisans in Venice craft intricate papier-mâché masks decorated with gold leaf, feathers, and hand-painted Baroque designs, continuing a tradition that dates back to the 12th century.',
    author: 'Matteo Rossi',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    likes: 49,
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

let ecoPledges: EcoPledge[] = [
  { id: 'p-1', name: 'Sophia Chen', country: 'Singapore', pledgeType: 'Switching to 100% Renewable Home Power', co2ReductionEst: 2400, createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
  { id: 'p-2', name: 'Amina Diallo', country: 'Senegal', pledgeType: 'Zero Single-Use Plastics & Active Composting', co2ReductionEst: 650, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'p-3', name: 'Lucas Rossi', country: 'Brazil', pledgeType: 'Planting 10 Native Trees Annually', co2ReductionEst: 1200, createdAt: new Date(Date.now() - 3600000 * 10).toISOString() }
];

let globalChatMessages: ChatMessageItem[] = [
  {
    id: 'c1',
    username: 'AminaDiallo',
    message: 'Hello everyone! Sharing a snapshot from our local community clean-up drive.',
    room: 'Climate & Earth',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'c2',
    username: 'DevGuru',
    message: 'Has anyone tested the latest Next.js camera snapshot API in production?',
    room: 'STEM & AI',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'c3',
    username: 'GlobalTrader',
    message: 'Micro-loans for sustainable energy in West Africa are up 35% this quarter!',
    room: 'Global Trade',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  }
];

let dtcProducts: DtcProduct[] = [
  {
    id: 'dtc-p1',
    name: 'Eco-Friendly Bamboo Hydration Flask',
    category: 'Sustainable Living',
    price: 28.99,
    stock: 145,
    description: 'Double-walled insulated bamboo tumbler that keeps beverages cold for 24 hours while reducing plastic footprint.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  },
  {
    id: 'dtc-p2',
    name: 'Solar-Powered Portable Charger 20000mAh',
    category: 'Clean Tech & Electronics',
    price: 49.50,
    stock: 82,
    description: 'High-efficiency monocrystalline solar power bank equipped with fast dual USB-C charging ports for off-grid power.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
  },
  {
    id: 'dtc-p3',
    name: 'Artisanal Organic Fair-Trade Coffee Beans',
    category: 'Food & Gourmet',
    price: 19.99,
    stock: 210,
    description: 'Directly sourced shade-grown arabica coffee beans roasted locally by smallholder cooperatives in Ethiopia.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString()
  }
];

let dtcOrders: DtcOrder[] = [
  {
    id: 'dtc-ord-1001',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@example.com',
    shippingAddress: '42 Greenway Blvd, Seattle, WA',
    items: [
      { productId: 'dtc-p1', productName: 'Eco-Friendly Bamboo Hydration Flask', quantity: 2, price: 28.99 },
      { productId: 'dtc-p3', productName: 'Artisanal Organic Fair-Trade Coffee Beans', quantity: 1, price: 19.99 }
    ],
    totalAmount: 77.97,
    status: 'Shipped',
    paymentMethod: 'Credit Card / Direct Pay',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'dtc-ord-1002',
    customerName: 'Kofi Mensah',
    customerEmail: 'kofi@example.com',
    shippingAddress: '15 Harvest Way, Austin, TX',
    items: [
      { productId: 'dtc-p2', productName: 'Solar-Powered Portable Charger 20000mAh', quantity: 1, price: 49.50 }
    ],
    totalAmount: 49.50,
    status: 'Processing',
    paymentMethod: 'Mawaba Pay Express',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

let forumTopics: ForumTopicItem[] = [
  {
    id: 'ft-1',
    title: 'Integrating Real-time AI Vision Sensors in Remote Education',
    category: 'STEM & AI',
    content: 'Using device cameras to process real-time gestures and physical experiment setups can transform distance learning for physics and chemistry labs.',
    author: 'Dr. Sarah Connor',
    likes: 18,
    replies: [
      {
        id: 'fr-1',
        author: 'Prof. Alan',
        text: 'Agreed! WebRTC plus canvas frame extraction makes camera access smooth in standard web browsers.',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'ft-2',
    title: 'Community Solar and Circular Economy in Emerging Markets',
    category: 'Climate & Earth',
    content: 'How can small towns convert agricultural waste into biochar while utilizing off-grid solar microgrids? Share snapshots of your regional projects here!',
    author: 'Kwame Osei',
    likes: 27,
    replies: [],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
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

// --- CLIMATE CHANGE SOLUTIONS APIS ---

app.get('/api/climate/solutions', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = [...climateSolutions];

  if (category) {
    results = results.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.keyTechnologies.some(tech => tech.toLowerCase().includes(q))
    );
  }

  res.json({
    total: results.length,
    solutions: results
  });
});

app.post('/api/climate/calculator', (req: Request, res: Response) => {
  const { renewablePercentage = 0, solarCapacityKw = 0, treeCount = 0, evKmPerYear = 0, wasteRecycledKg = 0 } = req.body;

  const solarCo2Saved = (Number(solarCapacityKw) || 0) * 1200 * 0.85; // ~1200 kWh/kW/yr * 0.85 kg CO2/kWh
  const treeCo2Saved = (Number(treeCount) || 0) * 22; // ~22 kg CO2 per mature tree per yr
  const evCo2Saved = ((Number(evKmPerYear) || 0) / 100) * 12; // ~12 kg CO2 saved per 100km over ICE vehicle
  const wasteCo2Saved = (Number(wasteRecycledKg) || 0) * 1.5; // ~1.5 kg CO2 saved per kg recycled
  const gridCo2Saved = ((Number(renewablePercentage) || 0) / 100) * 3500; // Average household 3500 kg CO2/yr offset

  const totalCo2SavedKg = Math.round(gridCo2Saved + solarCo2Saved + treeCo2Saved + evCo2Saved + wasteCo2Saved);
  const totalCo2SavedTons = +(totalCo2SavedKg / 1000).toFixed(2);

  const equivalentTreesPlanted = Math.round(totalCo2SavedKg / 22);
  const equivalentCarsOffRoad = +(totalCo2SavedKg / 4600).toFixed(1); // Avg passenger vehicle = 4,600 kg CO2/yr

  let impactGrade = 'C';
  if (totalCo2SavedKg > 10000) impactGrade = 'A+';
  else if (totalCo2SavedKg > 5000) impactGrade = 'A';
  else if (totalCo2SavedKg > 2000) impactGrade = 'B+';
  else if (totalCo2SavedKg > 800) impactGrade = 'B';

  res.json({
    inputs: { renewablePercentage, solarCapacityKw, treeCount, evKmPerYear, wasteRecycledKg },
    results: {
      totalCo2SavedKg,
      totalCo2SavedTons,
      equivalentTreesPlanted,
      equivalentCarsOffRoad,
      impactGrade,
      breakdown: {
        gridCo2SavedKg: Math.round(gridCo2Saved),
        solarCo2SavedKg: Math.round(solarCo2Saved),
        treeCo2SavedKg: Math.round(treeCo2Saved),
        evCo2SavedKg: Math.round(evCo2Saved),
        wasteCo2SavedKg: Math.round(wasteCo2Saved)
      }
    }
  });
});

app.get('/api/climate/initiatives', (req: Request, res: Response) => {
  res.json(climateInitiatives);
});

app.post('/api/climate/initiatives', (req: Request, res: Response) => {
  const { title, location, category, description, organizer, targetImpact } = req.body;
  if (!title || !location || !category || !description || !organizer) {
    return res.status(400).json({ error: 'Missing required initiative fields: title, location, category, description, organizer' });
  }

  const newInitiative: ClimateInitiative = {
    id: generateId(),
    title,
    location,
    category,
    description,
    organizer,
    targetImpact: targetImpact || 'Under Assessment',
    supporters: 1,
    status: 'Proposed',
    createdAt: new Date().toISOString()
  };

  climateInitiatives.unshift(newInitiative);
  res.status(201).json(newInitiative);
});

app.post('/api/climate/initiatives/:id/support', (req: Request, res: Response) => {
  const { id } = req.params;
  const initiative = climateInitiatives.find(i => i.id === id);
  if (!initiative) {
    return res.status(404).json({ error: 'Initiative not found' });
  }

  initiative.supporters += 1;
  res.json({ success: true, supporters: initiative.supporters });
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

// Location and Automatic Language Detection Endpoint
app.get('/api/location/detect', (req: Request, res: Response) => {
  const acceptLang = (req.headers['accept-language'] || '').toLowerCase();
  const reqTimezone = ((req.headers['x-timezone'] || req.query.timezone || '') as string).toLowerCase();
  const reqLang = ((req.query.lang || '') as string).toLowerCase();

  const supportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
    { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳', dir: 'ltr' },
    { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵', dir: 'ltr' },
    { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦', dir: 'rtl' },
    { code: 'pt', name: 'Português', flag: '🇵🇹', dir: 'ltr' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳', dir: 'ltr' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' }
  ];

  let detectedCode = 'en';
  let countryCode = 'US';
  let countryName = 'United States';

  if (reqLang) {
    const matched = supportedLanguages.find(l => l.code.toLowerCase().startsWith(reqLang));
    if (matched) detectedCode = matched.code;
  } else if (reqTimezone.includes('paris') || reqTimezone.includes('france') || acceptLang.includes('fr')) {
    detectedCode = 'fr';
    countryCode = 'FR';
    countryName = 'France';
  } else if (reqTimezone.includes('madrid') || reqTimezone.includes('mexico') || reqTimezone.includes('buenos_aires') || acceptLang.includes('es')) {
    detectedCode = 'es';
    countryCode = 'ES';
    countryName = 'Spain';
  } else if (reqTimezone.includes('berlin') || reqTimezone.includes('vienna') || acceptLang.includes('de')) {
    detectedCode = 'de';
    countryCode = 'DE';
    countryName = 'Germany';
  } else if (reqTimezone.includes('shanghai') || reqTimezone.includes('beijing') || acceptLang.includes('zh')) {
    detectedCode = 'zh-CN';
    countryCode = 'CN';
    countryName = 'China';
  } else if (reqTimezone.includes('tokyo') || acceptLang.includes('ja')) {
    detectedCode = 'ja';
    countryCode = 'JP';
    countryName = 'Japan';
  } else if (reqTimezone.includes('cairo') || reqTimezone.includes('riyadh') || reqTimezone.includes('dubai') || acceptLang.includes('ar')) {
    detectedCode = 'ar';
    countryCode = 'SA';
    countryName = 'Saudi Arabia';
  } else if (reqTimezone.includes('sao_paulo') || reqTimezone.includes('lisbon') || acceptLang.includes('pt')) {
    detectedCode = 'pt';
    countryCode = 'BR';
    countryName = 'Brazil';
  } else if (reqTimezone.includes('nairobi') || reqTimezone.includes('daressalaam') || acceptLang.includes('sw')) {
    detectedCode = 'sw';
    countryCode = 'KE';
    countryName = 'Kenya';
  } else if (reqTimezone.includes('kolkata') || reqTimezone.includes('delhi') || acceptLang.includes('hi')) {
    detectedCode = 'hi';
    countryCode = 'IN';
    countryName = 'India';
  } else if (reqTimezone.includes('moscow') || acceptLang.includes('ru')) {
    detectedCode = 'ru';
    countryCode = 'RU';
    countryName = 'Russia';
  }

  const langMeta = supportedLanguages.find(l => l.code === detectedCode) || supportedLanguages[0];

  res.json({
    detectedLocation: {
      ip: req.ip || '127.0.0.1',
      countryCode,
      countryName,
      timezone: reqTimezone || 'UTC'
    },
    language: langMeta,
    supportedLanguages,
    autoTranslated: true,
    timestamp: new Date().toISOString()
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

// 7. Global Chat Endpoints
app.get('/api/chat/messages', (req: Request, res: Response) => {
  const { room } = req.query;
  if (room) {
    const filtered = globalChatMessages.filter(
      m => m.room.toLowerCase() === String(room).toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(globalChatMessages);
});

app.post('/api/chat/messages', (req: Request, res: Response) => {
  const { username, message, room, image, video, avatar } = req.body;
  if (!username || (!message && !image && !video)) {
    return res.status(400).json({ error: 'Username and message or media attachment are required' });
  }

  const newMessage: ChatMessageItem = {
    id: 'c-' + generateId(),
    username: username.trim(),
    message: message ? message.trim() : '',
    room: room ? room.trim() : 'General',
    image: image || undefined,
    video: video || undefined,
    avatar: avatar || undefined,
    timestamp: new Date().toISOString()
  };

  globalChatMessages.push(newMessage);
  res.status(201).json(newMessage);
});

// 8. Forum Topic Endpoints
app.get('/api/forum/topics', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = [...forumTopics];

  if (category && category !== 'All') {
    results = results.filter(
      t => t.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

app.post('/api/forum/topics', (req: Request, res: Response) => {
  const { title, category, content, author, image, video } = req.body;
  if (!title || !category || !content || !author) {
    return res.status(400).json({ error: 'Missing required fields: title, category, content, author' });
  }

  const newTopic: ForumTopicItem = {
    id: 'ft-' + generateId(),
    title: title.trim(),
    category,
    content: content.trim(),
    author: author.trim(),
    image: image || undefined,
    video: video || undefined,
    likes: 0,
    replies: [],
    createdAt: new Date().toISOString()
  };

  forumTopics.unshift(newTopic);
  res.status(201).json(newTopic);
});

app.post('/api/forum/topics/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const topic = forumTopics.find(t => t.id === id);
  if (!topic) {
    return res.status(404).json({ error: 'Forum topic not found' });
  }

  topic.likes += 1;
  res.json({ success: true, likes: topic.likes, topic });
});

app.post('/api/forum/topics/:id/replies', (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, text, image, video } = req.body;
  if (!author || (!text && !image && !video)) {
    return res.status(400).json({ error: 'Author and text or media attachment are required for replies' });
  }

  const topic = forumTopics.find(t => t.id === id);
  if (!topic) {
    return res.status(404).json({ error: 'Forum topic not found' });
  }

  const newReply: ForumReplyItem = {
    id: 'fr-' + generateId(),
    author: author.trim(),
    text: text ? text.trim() : '',
    image: image || undefined,
    video: video || undefined,
    createdAt: new Date().toISOString()
  };

  topic.replies.push(newReply);
  res.status(201).json({ success: true, reply: newReply, topic });
});

// 9b. DTC (Direct-to-Consumer) Tools & E-Commerce APIs
app.get('/api/dtc/products', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = [...dtcProducts];

  if (category && category !== 'All') {
    results = results.filter(
      p => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

app.post('/api/dtc/products', (req: Request, res: Response) => {
  const { name, category, price, stock, description, image } = req.body;
  if (!name || !category || price === undefined || stock === undefined || !description) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price, stock, description' });
  }

  const newProduct: DtcProduct = {
    id: 'dtc-p' + generateId(),
    name: name.trim(),
    category: category.trim(),
    price: Number(price),
    stock: Number(stock),
    description: description.trim(),
    image: image || undefined,
    rating: 5.0,
    createdAt: new Date().toISOString()
  };

  dtcProducts.unshift(newProduct);
  res.status(201).json(newProduct);
});

app.get('/api/dtc/orders', (req: Request, res: Response) => {
  const { status, email } = req.query;
  let results = [...dtcOrders];

  if (status && status !== 'All') {
    results = results.filter(
      o => o.status.toLowerCase() === String(status).toLowerCase()
    );
  }

  if (email) {
    results = results.filter(
      o => o.customerEmail.toLowerCase() === String(email).toLowerCase()
    );
  }

  res.json(results);
});

app.post('/api/dtc/orders', (req: Request, res: Response) => {
  const { customerName, customerEmail, shippingAddress, items, paymentMethod } = req.body;
  if (!customerName || !customerEmail || !shippingAddress || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required order details or empty items list' });
  }

  let calculatedTotal = 0;
  const processedItems: DtcOrderItem[] = [];

  for (const item of items) {
    const product = dtcProducts.find(p => p.id === item.productId);
    const itemPrice = product ? product.price : (item.price || 0);
    const itemName = product ? product.name : (item.productName || 'DTC Product');
    const qty = Number(item.quantity) || 1;

    calculatedTotal += itemPrice * qty;
    processedItems.push({
      productId: item.productId || 'custom',
      productName: itemName,
      quantity: qty,
      price: itemPrice
    });

    if (product && product.stock >= qty) {
      product.stock -= qty;
    }
  }

  const newOrder: DtcOrder = {
    id: 'dtc-ord-' + generateId(),
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    shippingAddress: shippingAddress.trim(),
    items: processedItems,
    totalAmount: +calculatedTotal.toFixed(2),
    status: 'Processing',
    paymentMethod: paymentMethod ? paymentMethod.trim() : 'Direct Digital Wallet',
    createdAt: new Date().toISOString()
  };

  dtcOrders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.get('/api/dtc/analytics', (req: Request, res: Response) => {
  const totalRevenue = dtcOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrders = dtcOrders.length;
  const averageOrderValue = totalOrders > 0 ? +(totalRevenue / totalOrders).toFixed(2) : 0;
  const totalProductsSold = dtcOrders.reduce(
    (acc, o) => acc + o.items.reduce((sum, i) => sum + i.quantity, 0),
    0
  );

  res.json({
    metrics: {
      totalRevenue: +totalRevenue.toFixed(2),
      totalOrders,
      averageOrderValue,
      totalProductsSold,
      conversionRate: '3.42%',
      repeatCustomerRate: '28.5%'
    },
    topProducts: dtcProducts.slice(0, 5),
    recentOrders: dtcOrders.slice(0, 5)
  });
});

// 10. Gaming Feature & Developer Monetization APIs
app.get('/api/games', (req: Request, res: Response) => {
  const { genre, monetization, search, developerEmail } = req.query;
  let results = [...games];

  if (genre && genre !== 'All') {
    results = results.filter(
      g => g.genre.toLowerCase() === String(genre).toLowerCase()
    );
  }

  if (monetization && monetization !== 'All') {
    results = results.filter(
      g => g.monetizationModel.toLowerCase() === String(monetization).toLowerCase()
    );
  }

  if (developerEmail) {
    results = results.filter(
      g => g.developerEmail.toLowerCase() === String(developerEmail).toLowerCase()
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.developer.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

app.get('/api/games/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const game = games.find(g => g.id === id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

app.post('/api/games/submit', (req: Request, res: Response) => {
  const { title, developer, developerEmail, genre, description, thumbnailUrl, gameUrl, monetizationModel, price } = req.body;

  if (!title || !developer || !developerEmail || !genre || !description || !monetizationModel) {
    return res.status(400).json({ error: 'Missing required game submission fields: title, developer, developerEmail, genre, description, monetizationModel' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(developerEmail)) {
    return res.status(400).json({ error: 'Invalid developer email format' });
  }

  const numericPrice = Number(price) || 0;
  if (monetizationModel === 'Premium Purchase' && numericPrice <= 0) {
    return res.status(400).json({ error: 'Premium games require a price greater than $0' });
  }

  const newGame: GameItem = {
    id: 'game-' + generateId(),
    title: title.trim(),
    developer: developer.trim(),
    developerEmail: developerEmail.trim().toLowerCase(),
    genre,
    description: description.trim(),
    thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    gameUrl: gameUrl || 'https://cdn.html5games.com/demo',
    monetizationModel,
    price: numericPrice,
    playCount: 1,
    rating: 5.0,
    totalEarnings: 0,
    devRevenueShare: 85, // 85% revenue share to game developer
    status: 'Approved', // Auto-approved for immediate sandbox play
    createdAt: new Date().toISOString()
  };

  games.unshift(newGame);
  res.status(201).json({
    message: 'Game submitted and published successfully! You are earning 85% revenue share.',
    game: newGame
  });
});

app.post('/api/games/:id/play', (req: Request, res: Response) => {
  const { id } = req.params;
  const game = games.find(g => g.id === id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  game.playCount += 1;

  // If ad-supported, simulate ad revenue per play ($0.05 per session)
  if (game.monetizationModel === 'Ad-Supported') {
    const adEarnings = 0.05;
    game.totalEarnings = +(game.totalEarnings + adEarnings).toFixed(2);
  }

  res.json({ success: true, playCount: game.playCount, totalEarnings: game.totalEarnings });
});

app.post('/api/games/:id/purchase', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userEmail, amount, type = 'Purchase', paymentMethod = 'Mawaba Express Pay' } = req.body;

  const game = games.find(g => g.id === id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const transactionAmount = Number(amount) || game.price || 1.99;
  if (transactionAmount <= 0) {
    return res.status(400).json({ error: 'Invalid transaction amount' });
  }

  const devSharePercent = game.devRevenueShare || 85;
  const devPayout = +(transactionAmount * (devSharePercent / 100)).toFixed(2);
  const platformFee = +(transactionAmount - devPayout).toFixed(2);

  game.totalEarnings = +(game.totalEarnings + transactionAmount).toFixed(2);

  const transaction: GameTransaction = {
    id: 'gtx-' + generateId(),
    gameId: game.id,
    gameTitle: game.title,
    userEmail: userEmail ? String(userEmail).trim() : 'gamer@mawaba.org',
    amount: transactionAmount,
    devPayoutAmount: devPayout,
    platformFeeAmount: platformFee,
    type,
    paymentMethod: String(paymentMethod),
    timestamp: new Date().toISOString()
  };

  gameTransactions.unshift(transaction);

  res.status(201).json({
    message: 'Monetization transaction executed successfully!',
    transaction,
    gameTotalEarnings: game.totalEarnings
  });
});

app.get('/api/games/monetization/analytics', (req: Request, res: Response) => {
  const { developerEmail } = req.query;

  let filteredGames = [...games];
  let filteredTx = [...gameTransactions];

  if (developerEmail) {
    const devEmailLower = String(developerEmail).toLowerCase();
    filteredGames = filteredGames.filter(g => g.developerEmail === devEmailLower);
    const devGameIds = new Set(filteredGames.map(g => g.id));
    filteredTx = filteredTx.filter(tx => devGameIds.has(tx.gameId));
  }

  const grossRevenue = filteredGames.reduce((sum, g) => sum + g.totalEarnings, 0);
  const developerPayoutTotal = +(grossRevenue * 0.85).toFixed(2);
  const platformFeeTotal = +(grossRevenue * 0.15).toFixed(2);
  const totalPlays = filteredGames.reduce((sum, g) => sum + g.playCount, 0);

  res.json({
    developerEmail: developerEmail || 'All Developers',
    summary: {
      totalGames: filteredGames.length,
      totalPlays,
      grossRevenue: +grossRevenue.toFixed(2),
      developerPayoutTotal,
      platformFeeTotal,
      devShareRate: '85%'
    },
    topEarningGames: [...filteredGames].sort((a, b) => b.totalEarnings - a.totalEarnings).slice(0, 5),
    recentTransactions: filteredTx.slice(0, 10)
  });
});

// 9. Global Culture Endpoints
app.get('/api/culture/items', (req: Request, res: Response) => {
  const { region, category, search } = req.query;
  let results = [...cultureItems];

  if (region && region !== 'All') {
    results = results.filter(
      item => item.region.toLowerCase() === String(region).toLowerCase()
    );
  }

  if (category && category !== 'All') {
    results = results.filter(
      item => item.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

app.post('/api/culture/items', (req: Request, res: Response) => {
  const { title, country, region, category, description, author, image, video } = req.body;
  if (!title || !country || !region || !category || !description || !author) {
    return res.status(400).json({ error: 'Missing required fields: title, country, region, category, description, author' });
  }

  const newItem: CultureItem = {
    id: 'cult-' + generateId(),
    title: title.trim(),
    country: country.trim(),
    region,
    category,
    description: description.trim(),
    author: author.trim(),
    image: image || undefined,
    video: video || undefined,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString()
  };

  cultureItems.unshift(newItem);
  res.status(201).json(newItem);
});

app.post('/api/culture/items/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = cultureItems.find(c => c.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Culture item not found' });
  }

  item.likes += 1;
  res.json({ success: true, likes: item.likes, item });
});

app.post('/api/culture/items/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ error: 'Author and comment text are required' });
  }

  const item = cultureItems.find(c => c.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Culture item not found' });
  }

  const newComment: CultureComment = {
    id: 'cc-' + generateId(),
    author: author.trim(),
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  item.comments.push(newComment);
  res.status(201).json({ success: true, comment: newComment, item });
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
