# Table Data Importer

A flexible Node.js tool for importing table data from various sources including AI-generated content, JSON files, CSV files, and more.

## Features

- **Multiple Input Methods:**
  - Import from files (JSON, CSV, TSV, TXT)
  - Direct JSON input (copy/paste from AI or manual entry)
  - Smart paste detection (auto-detects format)

- **Supported Formats:**
  - JSON (arrays of objects)
  - CSV (comma-separated values)
  - TSV (tab-separated values)
  - Custom delimited text (auto-detects separators)

- **Output Options:**
  - Save as JSON file
  - Save as CSV file
  - Display raw JSON
  - Preview data in table format

## Usage

### Method 1: Run the interactive tool
```bash
node data-importer.js
```

### Method 2: Make it executable and run directly
```bash
chmod +x data-importer.js
./data-importer.js
```

## Input Options

### 1. File Import
- Choose option 1
- Enter the path to your file
- Supports: `.json`, `.csv`, `.tsv`, `.txt`

### 2. Direct JSON Input
- Choose option 2
- Type or paste JSON data
- Press Ctrl+D when finished
- Example format:
  ```json
  [
    {"name": "John", "age": 30, "city": "NYC"},
    {"name": "Jane", "age": 25, "city": "LA"}
  ]
  ```

### 3. Smart Paste
- Choose option 3
- Paste any supported format
- The tool auto-detects the format
- Press Ctrl+D when finished

## Example Files

Try with the included sample files:
- `sample-data.csv` - CSV format example
- `sample-data.json` - JSON format example

## Common Use Cases

### AI-Generated Data
1. Generate table data with ChatGPT/Claude/etc.
2. Copy the output
3. Run the importer and choose "Smart Paste" (option 3)
4. Paste the data and let it auto-detect the format

### Excel/Google Sheets Export
1. Export your spreadsheet as CSV
2. Use file import (option 1)
3. Enter the CSV file path

### API Response Processing
1. Copy JSON response from API tools
2. Use direct JSON input (option 2)
3. Process and save in desired format

## Format Examples

### CSV Format
```
name,age,email,city
John Doe,30,john@example.com,New York
Jane Smith,25,jane@example.com,Los Angeles
```

### TSV Format (Tab-separated)
```
name	age	email	city
John Doe	30	john@example.com	New York
Jane Smith	25	jane@example.com	Los Angeles
```

### JSON Format
```json
[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "city": "New York"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com",
    "city": "Los Angeles"
  }
]
```

## Tips

1. **For AI-generated data**: Use the "Smart Paste" option - it automatically detects the format
2. **For large files**: Use the file import option for better performance
3. **For quick testing**: Use direct JSON input for small datasets
4. **Mixed delimiters**: The tool can handle various separators (commas, tabs, semicolons, pipes)

## Error Handling

- Invalid JSON will show helpful error messages
- Missing files are detected with clear feedback
- Malformed CSV/TSV data is handled gracefully
- Preview shows first 3 rows to verify data before saving
