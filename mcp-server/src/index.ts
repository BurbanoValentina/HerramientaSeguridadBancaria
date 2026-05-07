import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { scanFileTool } from "./tools/scanFile.js";
import { maskDataTool } from "./tools/maskData.js";
import { getRiskReportTool } from "./tools/getRiskReport.js";

const server = new Server(
  { name: "bankguard-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list" as any, async () => ({
  tools: [
    {
      name: "scan_file",
      description: "Escanea contenido de archivo en busca de datos bancarios sensibles",
      inputSchema: {
        type: "object",
        properties: {
          content: { type: "string", description: "File content to scan" },
          filepath: { type: "string", description: "Optional file path for context" }
        },
        required: ["content"]
      }
    },
    {
      name: "mask_sensitive_data",
      description: "Enmascara datos sensibles en un texto dado",
      inputSchema: {
        type: "object",
        properties: {
          content: { type: "string" },
          categories: { type: "array", items: { type: "string" } }
        },
        required: ["content"]
      }
    },
    {
      name: "get_risk_report",
      description: "Genera reporte de riesgo para contenido dado",
      inputSchema: {
        type: "object",
        properties: {
          content: { type: "string" },
          filepath: { type: "string" }
        },
        required: ["content"]
      }
    }
  ]
}));

server.setRequestHandler("tools/call" as any, async (request: any) => {
  const { name, arguments: args } = request.params;
  if (name === "scan_file") {
    const result = await scanFileTool(args.content, args.filepath);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
  if (name === "mask_sensitive_data") {
    const masked = await maskDataTool(args.content, args.categories);
    return { content: [{ type: "text", text: masked }] };
  }
  if (name === "get_risk_report") {
    const report = await getRiskReportTool(args.content, args.filepath);
    return { content: [{ type: "text", text: JSON.stringify(report, null, 2) }] };
  }
  throw new Error(`Tool not found: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
