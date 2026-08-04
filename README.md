# @pipeworx/opencages

[OpenCage](https://opencagedata.com) MCP — forward + reverse geocoding aggregator (OSM, GeoNames, Who's On First, etc). Free tier 2500 req/day. Key required.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_OPENCAGE_KEY`. BYO: `?_apiKey=…`.

## Tools

- `geocode(query, language?, limit?, countrycode?, bounds?, no_annotations?, abbrv?)` — forward geocode
- `reverse(lat, lon, language?, no_annotations?, abbrv?)` — reverse geocode

## Data source

`https://api.opencagedata.com/geocode/v1/json`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "opencages": {
      "url": "https://gateway.pipeworx.io/opencages/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Opencages data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
