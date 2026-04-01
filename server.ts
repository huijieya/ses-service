import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // --- Mock Database ---
  let flows = [
    {
      id: "flow-1",
      name: "正向分拣主流程",
      nodes: [
        { id: "start", type: "start", data: { label: "开始" }, position: { x: 100, y: 100 } },
        { id: "wave_create", type: "wave_create", data: { label: "创建波次" }, position: { x: 300, y: 100 } },
        { id: "order_parse", type: "order_parse", data: { label: "解析订单" }, position: { x: 500, y: 100 } },
        { id: "end", type: "end", data: { label: "结束" }, position: { x: 700, y: 100 } },
      ],
      edges: [
        { id: "e1", source: "start", target: "wave_create" },
        { id: "e2", source: "wave_create", target: "order_parse" },
        { id: "e3", source: "order_parse", target: "end" },
      ],
    },
  ];

  let instances: any[] = [];

  // --- API Routes ---

  // Get all flows
  app.get("/api/flows", (req, res) => {
    res.json(flows);
  });

  // Save/Update flow
  app.post("/api/flows", (req, res) => {
    const flow = req.body;
    const index = flows.findIndex((f) => f.id === flow.id);
    if (index > -1) {
      flows[index] = flow;
    } else {
      flows.push(flow);
    }
    res.json({ success: true });
  });

  // Execute a flow
  app.post("/api/flows/:id/run", async (req, res) => {
    const flowId = req.params.id;
    const flow = flows.find((f) => f.id === flowId);
    if (!flow) return res.status(404).json({ error: "Flow not found" });

    const instanceId = `inst-${Date.now()}`;
    const logs: any[] = [];
    
    // Simple sequential execution simulation
    logs.push({ node: "start", status: "success", timestamp: new Date() });
    
    for (const node of flow.nodes) {
      if (node.type === "start" || node.type === "end") continue;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      logs.push({ 
        node: node.id, 
        type: node.type,
        status: "success", 
        output: { result: "ok", data: req.body.input || {} },
        timestamp: new Date() 
      });
    }

    logs.push({ node: "end", status: "success", timestamp: new Date() });

    const instance = { id: instanceId, flowId, logs, status: "completed" };
    instances.push(instance);
    res.json(instance);
  });

  // Get execution history
  app.get("/api/instances", (req, res) => {
    res.json(instances);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SES Server running on http://localhost:${PORT}`);
  });
}

startServer();
