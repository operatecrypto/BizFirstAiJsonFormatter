# BizFirstAiJsonFormatter

A JSON formatter tool that can be integrated into an AI chat window

## Features

- **Format JSON**: Pretty-print JSON with proper indentation
- **Minify JSON**: Remove whitespace to compress JSON
- **Beautify JSON**: Same as format, alias for compatibility
- **Validate JSON**: Check JSON syntax and show detailed error messages
- **URL Parameter Support**: Automatically process JSON from URL parameters

## URL Parameter Usage

The application now supports automatic JSON processing via URL parameters:

### Parameters:
- `inputJson`: URL-encoded JSON string to process
- `actionType`: Action to perform (optional, defaults to "format")
  - `format`: Pretty-print the JSON (default)
  - `beautify`: Same as format
  - `minify`: Remove whitespace
  - `validate`: Validate JSON syntax

### Example URLs:
```
# Format JSON automatically
index.html?inputJson=%7B%22name%22%3A%22John%22%2C%22age%22%3A30%7D&actionType=format

# Minify JSON automatically  
index.html?inputJson=%7B%22name%22%3A%22John%22%2C%22age%22%3A30%7D&actionType=minify

# Validate JSON automatically
index.html?inputJson=%7B%22name%22%3A%22John%22%2C%22age%22%3A30%7D&actionType=validate
```

### Backwards Compatibility:
If no `inputJson` parameter is provided, the application works exactly as before with manual input.

