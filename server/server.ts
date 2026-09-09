import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory data copy for server instance
let serverInitialized = false;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'NAKSHA V2.0 Spatial API Server',
    studyArea: 'Pune (Hinjawadi) - PMRDA Special Planning Area, Maharashtra',
    timestamp: new Date().toISOString()
  });
});

// Start listening if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[NAKSHA V2 Spatial API Server] running on http://localhost:${PORT}`);
  });
}

export default app;
