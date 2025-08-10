// JSON Formatter Application
class JSONFormatter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.jsonInput = document.getElementById('jsonInput');
        this.jsonOutput = document.getElementById('jsonOutput');
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        this.validationStatus = document.getElementById('validationStatus');
        
        this.formatBtn = document.getElementById('formatBtn');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.validateBtn = document.getElementById('validateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
    }

    bindEvents() {
        this.formatBtn.addEventListener('click', () => this.formatJSON());
        this.minifyBtn.addEventListener('click', () => this.minifyJSON());
        this.validateBtn.addEventListener('click', () => this.validateJSON());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        
        // Real-time validation while typing
        this.jsonInput.addEventListener('input', () => this.debounce(this.validateJSON.bind(this), 500));
    }

    // Format JSON with proper indentation
    formatJSON() {
        const inputText = this.jsonInput.value.trim();
        
        if (!inputText) {
            this.showError('Please enter some JSON data to format.');
            return;
        }

        try {
            const parsed = JSON.parse(inputText);
            const formatted = JSON.stringify(parsed, null, 2);
            
            this.jsonOutput.value = formatted;
            this.clearMessages();
            this.showSuccess('JSON formatted successfully!');
            this.updateValidationStatus(true, 'Valid JSON - Formatted');
            
        } catch (error) {
            this.handleJSONError(error, 'formatting');
        }
    }

    // Minify JSON by removing whitespace
    minifyJSON() {
        const inputText = this.jsonInput.value.trim();
        
        if (!inputText) {
            this.showError('Please enter some JSON data to minify.');
            return;
        }

        try {
            const parsed = JSON.parse(inputText);
            const minified = JSON.stringify(parsed);
            
            this.jsonOutput.value = minified;
            this.clearMessages();
            this.showSuccess('JSON minified successfully!');
            this.updateValidationStatus(true, 'Valid JSON - Minified');
            
        } catch (error) {
            this.handleJSONError(error, 'minifying');
        }
    }

    // Validate JSON and show detailed error information
    validateJSON() {
        const inputText = this.jsonInput.value.trim();
        
        if (!inputText) {
            this.updateValidationStatus(false, 'No JSON data to validate');
            this.clearMessages();
            return;
        }

        try {
            JSON.parse(inputText);
            this.updateValidationStatus(true, 'Valid JSON');
            this.clearMessages();
            
        } catch (error) {
            this.updateValidationStatus(false, this.getDetailedErrorMessage(error));
            this.showError(this.getDetailedErrorMessage(error));
        }
    }

    // Copy formatted/minified JSON to clipboard
    async copyToClipboard() {
        const outputText = this.jsonOutput.value.trim();
        
        if (!outputText) {
            this.showError('Nothing to copy. Please format or minify JSON first.');
            return;
        }

        try {
            await navigator.clipboard.writeText(outputText);
            this.showSuccess('JSON copied to clipboard!');
            
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(outputText);
        }
    }

    // Fallback copy method for older browsers
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showSuccess('JSON copied to clipboard!');
        } catch (error) {
            this.showError('Failed to copy to clipboard. Please copy manually.');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // Clear all inputs and outputs
    clearAll() {
        this.jsonInput.value = '';
        this.jsonOutput.value = '';
        this.clearMessages();
        this.validationStatus.style.display = 'none';
        this.jsonInput.focus();
    }

    // Handle JSON parsing errors with detailed messages
    handleJSONError(error, action) {
        const detailedError = this.getDetailedErrorMessage(error);
        this.showError(`Error ${action} JSON: ${detailedError}`);
        this.updateValidationStatus(false, detailedError);
        this.jsonOutput.value = '';
    }

    // Get detailed error message with position information
    getDetailedErrorMessage(error) {
        const message = error.message;
        
        // Extract position information if available
        const positionMatch = message.match(/at position (\d+)/);
        const unexpectedMatch = message.match(/Unexpected token (.+) in JSON/);
        
        if (positionMatch) {
            const position = parseInt(positionMatch[1]);
            const inputText = this.jsonInput.value;
            const lineInfo = this.getLineAndColumn(inputText, position);
            
            return `${message} (Line ${lineInfo.line}, Column ${lineInfo.column})`;
        }
        
        if (unexpectedMatch) {
            return `Unexpected token: ${unexpectedMatch[1]}. Check for missing quotes, commas, or brackets.`;
        }
        
        // Common error patterns
        if (message.includes('Unexpected end of JSON input')) {
            return 'Incomplete JSON - missing closing brackets, braces, or quotes.';
        }
        
        if (message.includes('Unexpected token')) {
            return 'Invalid JSON syntax - check for extra commas, missing quotes, or malformed structure.';
        }
        
        return message;
    }

    // Calculate line and column from character position
    getLineAndColumn(text, position) {
        const lines = text.substring(0, position).split('\n');
        return {
            line: lines.length,
            column: lines[lines.length - 1].length + 1
        };
    }

    // Show error message
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        this.successMessage.classList.remove('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.errorMessage.classList.remove('show');
        }, 5000);
    }

    // Show success message
    showSuccess(message) {
        this.successMessage.textContent = message;
        this.successMessage.classList.add('show');
        this.errorMessage.classList.remove('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.successMessage.classList.remove('show');
        }, 3000);
    }

    // Clear all messages
    clearMessages() {
        this.errorMessage.classList.remove('show');
        this.successMessage.classList.remove('show');
    }

    // Update validation status indicator
    updateValidationStatus(isValid, message) {
        this.validationStatus.textContent = message;
        this.validationStatus.className = `status-indicator ${isValid ? 'valid' : 'invalid'}`;
        this.validationStatus.style.display = 'block';
    }

    // Debounce function to limit API calls
    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }
}

// Utility functions for additional features
class JSONUtils {
    // Check if string is valid JSON
    static isValidJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }

    // Get JSON statistics
    static getJSONStats(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            return {
                size: jsonString.length,
                minifiedSize: JSON.stringify(parsed).length,
                type: Array.isArray(parsed) ? 'Array' : typeof parsed,
                keys: this.countKeys(parsed),
                depth: this.getDepth(parsed)
            };
        } catch {
            return null;
        }
    }

    // Count total keys in JSON object
    static countKeys(obj, count = 0) {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach(item => {
                    count = this.countKeys(item, count);
                });
            } else {
                count += Object.keys(obj).length;
                Object.values(obj).forEach(value => {
                    count = this.countKeys(value, count);
                });
            }
        }
        return count;
    }

    // Get maximum depth of nested structure
    static getDepth(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return 0;
        }
        
        let maxDepth = 0;
        if (Array.isArray(obj)) {
            obj.forEach(item => {
                maxDepth = Math.max(maxDepth, this.getDepth(item));
            });
        } else {
            Object.values(obj).forEach(value => {
                maxDepth = Math.max(maxDepth, this.getDepth(value));
            });
        }
        
        return maxDepth + 1;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JSONFormatter();
    
    // Add sample JSON for demonstration
    const sampleJSON = {
        "name": "John Doe",
        "age": 30,
        "city": "New York",
        "hobbies": ["reading", "swimming", "coding"],
        "address": {
            "street": "123 Main St",
            "zipcode": "10001"
        },
        "active": true
    };
    
    // Optional: Add sample data button
    const jsonInput = document.getElementById('jsonInput');
    jsonInput.placeholder = `Paste your JSON here or try this sample:\n${JSON.stringify(sampleJSON, null, 2)}`;
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JSONFormatter, JSONUtils };
}