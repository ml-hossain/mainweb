#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class DataImporter {
    constructor() {
        this.supportedFormats = ['json', 'csv', 'tsv', 'txt'];
    }

    // Main entry point
    async run() {
        console.log('🚀 Table Data Importer');
        console.log('======================');
        console.log('Supported formats: JSON, CSV, TSV, TXT (tab/comma separated)');
        console.log('');

        const choice = await this.getInputChoice();
        
        switch (choice) {
            case '1':
                await this.handleFileInput();
                break;
            case '2':
                await this.handleDirectInput();
                break;
            case '3':
                await this.handlePasteInput();
                break;
            default:
                console.log('Invalid choice. Exiting...');
                process.exit(1);
        }
    }

    async getInputChoice() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            console.log('Choose input method:');
            console.log('1. Import from file (JSON, CSV, TSV, etc.)');
            console.log('2. Enter data directly (JSON format)');
            console.log('3. Paste data (any format)');
            console.log('');
            
            rl.question('Enter your choice (1-3): ', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }

    async handleFileInput() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const filePath = await new Promise((resolve) => {
            rl.question('Enter file path: ', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });

        try {
            if (!fs.existsSync(filePath)) {
                throw new Error('File not found');
            }

            const ext = path.extname(filePath).toLowerCase().slice(1);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const data = this.parseData(content, ext);
            await this.processData(data, `Imported from ${filePath}`);
            
        } catch (error) {
            console.error('❌ Error reading file:', error.message);
        }
    }

    async handleDirectInput() {
        console.log('Enter your JSON data (press Ctrl+D when finished):');
        console.log('Example format:');
        console.log('[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]');
        console.log('');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let jsonInput = '';
        
        rl.on('line', (line) => {
            jsonInput += line + '\n';
        });

        rl.on('close', () => {
            try {
                const data = JSON.parse(jsonInput.trim());
                this.processData(data, 'Direct JSON input');
            } catch (error) {
                console.error('❌ Invalid JSON format:', error.message);
            }
        });
    }

    async handlePasteInput() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('Paste your data below (press Ctrl+D when finished):');
        console.log('Supports: JSON, CSV, TSV, or tab/comma separated data');
        console.log('');

        let pastedData = '';
        
        rl.on('line', (line) => {
            pastedData += line + '\n';
        });

        rl.on('close', () => {
            const format = this.detectFormat(pastedData);
            console.log(`🔍 Detected format: ${format.toUpperCase()}`);
            
            try {
                const data = this.parseData(pastedData, format);
                this.processData(data, 'Pasted data');
            } catch (error) {
                console.error('❌ Error parsing data:', error.message);
            }
        });
    }

    detectFormat(data) {
        const trimmed = data.trim();
        
        // Check if it's JSON
        if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || 
            (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
            try {
                JSON.parse(trimmed);
                return 'json';
            } catch (e) {
                // Not valid JSON, continue checking
            }
        }

        // Check for CSV/TSV patterns
        const lines = trimmed.split('\n');
        if (lines.length > 1) {
            const firstLine = lines[0];
            
            // Count tabs vs commas
            const tabCount = (firstLine.match(/\t/g) || []).length;
            const commaCount = (firstLine.match(/,/g) || []).length;
            
            if (tabCount > commaCount) {
                return 'tsv';
            } else if (commaCount > 0) {
                return 'csv';
            }
        }

        return 'txt'; // Default fallback
    }

    parseData(content, format) {
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.parse(content);
                
            case 'csv':
                return this.parseCSV(content);
                
            case 'tsv':
                return this.parseTSV(content);
                
            case 'txt':
                // Try to auto-detect separator
                return this.parseDelimited(content);
                
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    parseCSV(content) {
        const lines = content.trim().split('\n');
        if (lines.length === 0) return [];

        const headers = this.parseCSVLine(lines[0]);
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            result.push(row);
        }

        return result;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    parseTSV(content) {
        const lines = content.trim().split('\n');
        if (lines.length === 0) return [];

        const headers = lines[0].split('\t');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split('\t');
            const row = {};
            
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            result.push(row);
        }

        return result;
    }

    parseDelimited(content) {
        // Try to detect the most likely delimiter
        const sample = content.split('\n')[0];
        const delimiters = ['\t', ',', ';', '|'];
        
        let bestDelimiter = ',';
        let maxCount = 0;
        
        delimiters.forEach(delimiter => {
            const count = (sample.match(new RegExp(delimiter, 'g')) || []).length;
            if (count > maxCount) {
                maxCount = count;
                bestDelimiter = delimiter;
            }
        });

        // Use the detected delimiter
        if (bestDelimiter === '\t') {
            return this.parseTSV(content);
        } else {
            return this.parseCustomDelimited(content, bestDelimiter);
        }
    }

    parseCustomDelimited(content, delimiter) {
        const lines = content.trim().split('\n');
        if (lines.length === 0) return [];

        const headers = lines[0].split(delimiter);
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(delimiter);
            const row = {};
            
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            result.push(row);
        }

        return result;
    }

    async processData(data, source) {
        console.log('\n✅ Data parsed successfully!');
        console.log(`📊 Source: ${source}`);
        console.log(`📈 Records: ${Array.isArray(data) ? data.length : 1}`);
        
        if (Array.isArray(data) && data.length > 0) {
            console.log(`🔑 Fields: ${Object.keys(data[0]).join(', ')}`);
            
            // Show preview
            console.log('\n📋 Preview (first 3 rows):');
            console.table(data.slice(0, 3));
        }

        // Save options
        await this.saveDataOptions(data);
    }

    async saveDataOptions(data) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('\nSave options:');
        console.log('1. Save as JSON file');
        console.log('2. Save as CSV file');
        console.log('3. Display raw JSON');
        console.log('4. Exit without saving');

        const choice = await new Promise((resolve) => {
            rl.question('Choose an option (1-4): ', (answer) => {
                resolve(answer.trim());
            });
        });

        switch (choice) {
            case '1':
                await this.saveAsJSON(data, rl);
                break;
            case '2':
                await this.saveAsCSV(data, rl);
                break;
            case '3':
                console.log('\n📄 Raw JSON:');
                console.log(JSON.stringify(data, null, 2));
                break;
            case '4':
                console.log('👋 Exiting...');
                break;
            default:
                console.log('Invalid choice.');
        }

        rl.close();
    }

    async saveAsJSON(data, rl) {
        const filename = await new Promise((resolve) => {
            rl.question('Enter filename (without extension): ', (answer) => {
                resolve(answer.trim() || 'data');
            });
        });

        const filepath = path.join(process.cwd(), `${filename}.json`);
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        console.log(`💾 Saved as: ${filepath}`);
    }

    async saveAsCSV(data, rl) {
        if (!Array.isArray(data) || data.length === 0) {
            console.log('❌ Cannot save as CSV: Data is not a valid array');
            return;
        }

        const filename = await new Promise((resolve) => {
            rl.question('Enter filename (without extension): ', (answer) => {
                resolve(answer.trim() || 'data');
            });
        });

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');

        const filepath = path.join(process.cwd(), `${filename}.csv`);
        fs.writeFileSync(filepath, csvContent);
        console.log(`💾 Saved as: ${filepath}`);
    }
}

// Run the importer
if (require.main === module) {
    const importer = new DataImporter();
    importer.run().catch(console.error);
}

module.exports = DataImporter;
