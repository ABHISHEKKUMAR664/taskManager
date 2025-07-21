# Data Directory

This directory contains the application's data storage files. The JSON files store user data, projects, and tasks.

## Files

- `users.json` - User authentication data
- `projects.json` - User projects data  
- `tasks.json` - Task data organized by user

## Security

⚠️ **Important**: The actual JSON files are excluded from git for security reasons. Only template files are tracked.

## Setup

The application will automatically create these files when first run. If you need to reset the data, you can delete the JSON files and they will be recreated from the templates.

## Data Structure

### users.json
```json
{
  "username": {
    "username": "string",
    "password": "string",
    "createdAt": "ISO date string"
  }
}
```

### projects.json
```json
{
  "username": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

### tasks.json
```json
{
  "username": [
    {
      "id": "string",
      "projectId": "string",
      "title": "string",
      "completed": boolean,
      "status": "todo" | "inprogress" | "done",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ]
}
```
