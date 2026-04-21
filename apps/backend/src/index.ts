import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Mock endpoints for business integrations
const integrations = [
  'NCR', 'Revel', 'Lightspeed', 'Square', 'Toast', 'Shopline', 'Clover'
];

app.get('/api/integrations', (req: Request, res: Response) => {
  res.json(integrations);
});

app.post('/api/integrations/:name/connect', (req: Request, res: Response) => {
  const { name } = req.params;
  if (integrations.includes(name)) {
    res.json({ success: true, message: `Connected to ${name} successfully` });
  } else {
    res.status(404).json({ success: false, message: 'Integration not found' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
