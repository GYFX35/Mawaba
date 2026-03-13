import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock database for educational content
const content = {
  podcasts: [
    { id: 1, title: "Quantum Physics for Beginners", discipline: "Sciences" },
    { id: 2, title: "The Art of Business Strategy", discipline: "Business" }
  ],
  videos: [
    { id: 1, title: "Advanced Mathematics: Calculus III", discipline: "Sciences" }
  ],
  shorts: [
    { id: 1, title: "Coding Hack: Fast Array Methods", discipline: "Technology" }
  ]
};

app.get('/api/content', (req, res) => {
  res.json(content);
});

app.get('/api/content/:discipline', (req, res) => {
  const { discipline } = req.params;
  const filtered = {
    podcasts: content.podcasts.filter(p => p.discipline.toLowerCase() === discipline.toLowerCase()),
    videos: content.videos.filter(v => v.discipline.toLowerCase() === discipline.toLowerCase()),
    shorts: content.shorts.filter(s => s.discipline.toLowerCase() === discipline.toLowerCase()),
  };
  res.json(filtered);
});

app.listen(port, () => {
  console.log(`Mawaba Backend listening at http://localhost:${port}`);
});
