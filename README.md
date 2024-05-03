# @airent/api

Airent API Plugin - Generate your API backend and API client with ease

## Why do you need this?

- It can automatically generate your API backend which includes data service classes and API actions (controllers);
- It includes a built-in API middleware that can validate and execute your API requests to backend;
- It can automatically generate your API client that supports field selection on API responses;
- It extends Airent entities to support field-level access control.

## Getting Started

### Installation

First, install with npm:

```bash
npm install @airent/api
```

Then, update the configuration file `airent.config.js` with the following command:

```bash
npx airent-api
```

### Configure your entity APIs in YAML schemas

Add the following settings to your entity schema files to generate API backend:

```yaml
api:
  request:
    import: "@/types/user" # required, to import the request body Zods
  service:
    import: "@/services/user" # required, to import the data service implementation for API actions
  cursors:
    - createdAt: asc # optional, if you would like to support getMany cursors
  methods: # key is the API action name and value is an optional JSON string for authentication options
    getMany: "{ requireAdmin: true }"
    getOne: "{ requireLogin: false }"
    createOne: "{ requireLogin: false }"
    updateOne: "{ requireLogin: true }"
    deleteOne: "{ requireLogin: true }"
policies:
  Private:
    - email
    - phone
    - lastName
```

This is it. Have fun!
