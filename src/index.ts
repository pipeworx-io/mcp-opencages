interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * OpenCage MCP.
 */


const BASE = 'https://api.opencagedata.com/geocode/v1/json';
const UA = 'pipeworx-mcp-opencages/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'geocode',
    description: 'Forward geocode.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        language: { type: 'string' },
        limit: { type: 'number' },
        countrycode: { type: 'string', description: 'Comma-sep ISO-3166-1 alpha-2 codes.' },
        bounds: { type: 'string', description: 'sw_lon,sw_lat,ne_lon,ne_lat' },
        no_annotations: { type: 'boolean' },
        abbrv: { type: 'boolean' },
      },
      required: ['query'],
    },
  },
  {
    name: 'reverse',
    description: 'Reverse geocode.',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
        language: { type: 'string' },
        no_annotations: { type: 'boolean' },
        abbrv: { type: 'boolean' },
      },
      required: ['lat', 'lon'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('OpenCage requires an API key. Set PLATFORM_OPENCAGE_KEY or pass ?_apiKey=… (free at https://opencagedata.com/users/sign_up).');
  const p = new URLSearchParams({ key: apiKey });
  switch (name) {
    case 'geocode':
      p.set('q', reqStr(args, 'query', '"Paris, France"'));
      break;
    case 'reverse':
      p.set('q', `${args.lat},${args.lon}`);
      break;
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
  if (args.language) p.set('language', String(args.language));
  if (args.limit) p.set('limit', String(args.limit));
  if (args.countrycode) p.set('countrycode', String(args.countrycode));
  if (args.bounds) p.set('bounds', String(args.bounds));
  if (args.no_annotations) p.set('no_annotations', '1');
  if (args.abbrv) p.set('abbrv', '1');
  const res = await fetch(`${BASE}?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 401 || res.status === 403) throw new Error('OpenCage: invalid API key.');
  if (res.status === 429) throw new Error('OpenCage: 429 rate-limit (2500/day free tier).');
  if (!res.ok) throw new Error(`OpenCage: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
