import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const dbInstance = getFirestore(admin.app(), firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", firebase: "connected" });
  });

  // Run Flow Execution Engine (Simplified)
  app.post("/api/flows/:id/run", async (req, res) => {
    const { id } = req.params;
    const { input } = req.body;

    try {
      const flowDoc = await dbInstance.collection('flows').doc(id).get();
      if (!flowDoc.exists) {
        return res.status(404).json({ error: "Flow not found" });
      }

      const flow = flowDoc.data();
      const instanceId = `inst-${Date.now()}`;
      
      // Create execution instance
      const instanceRef = dbInstance.collection('instances').doc(instanceId);
      await instanceRef.set({
        id: instanceId,
        flowId: id,
        flowName: flow?.name,
        status: 'RUNNING',
        progress: 0,
        startTime: new Date().toISOString(),
        logs: []
      });

      // Simulation of execution (in a real app, this would be a worker or more complex logic)
      // We'll return the instance ID and let the frontend monitor it
      res.json({ instanceId, message: "Execution started" });

      // Background execution simulation
      (async () => {
        const nodes = flow?.nodes || [];
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const progress = Math.round(((i + 1) / nodes.length) * 100);
          
          await instanceRef.update({
            progress,
            currentNode: node.data?.label || node.id,
            logs: admin.firestore.FieldValue.arrayUnion({
              timestamp: new Date().toISOString(),
              node: node.data?.label || node.id,
              status: 'success',
              message: `Executed node ${node.id}`
            })
          });
          
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        await instanceRef.update({
          status: 'COMPLETED',
          progress: 100
        });
      })();

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Execution failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
