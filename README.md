# 🧠 AI Research Assistant Chrome Extension

A Chrome extension that helps you summarize text using AI (Ollama backend) and take research notes while browsing the web.

## ✨ Features

### 🎯 Smart Text Summarization
- **Select any text** on any webpage
- **AI-powered summarization** using Ollama backend
- **Real-time processing** with loading indicators
- **Copy summaries** to clipboard with one click

### 📝 Research Notes
- **Built-in notepad** for collecting insights
- **Auto-save functionality** - notes saved as you type
- **Persistent storage** across browser sessions

### 🎨 Modern Design
- **Glassmorphism UI** with gradient backgrounds
- **Smooth animations** and hover effects
- **Responsive design** that works on all screen sizes
- **Status indicators** showing backend connectivity

## 🚀 Quick Start

### Prerequisites
- Chrome browser
- Spring Boot backend running locally (for AI summarization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Surendra1341/Research_Assistant_Extension.git
   cd Research_Assistant_Extension
   ```

2. **Set up your Spring Boot backend**
   - Ensure your Spring Boot backend is running
   - Backend should be accessible at `http://localhost:8080`
   - Make sure Ollama is integrated with your Spring Boot application

3. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the cloned repository folder

4. **Start using the extension**
   - Click the extension icon in your Chrome toolbar
   - The side panel will open
   - Select text on any webpage and click "Summarize Selection"

## 🛠️ Backend Setup

The extension expects a Spring Boot backend with the following endpoint:

### Required Endpoint
```
POST http://localhost:8080/api/research/process
Content-Type: application/json

{
  "content": "text to summarize",
  "operation": "summarize"
}
```

## 📁 Project Structure

```
Research_Assistant_Extension/
├── manifest.json          # Extension configuration
├── background.js           # Service worker for background tasks
├── side_panel.html        # Main UI structure
├── side_panel.css         # Modern styling with glassmorphism
├── side_panel.js          # Core functionality and API calls
└── README.md              # This file
```

## 🔧 Configuration

### Changing Backend URL
Edit `side_panel.js` and `background.js` to change the backend URL:

```javascript
const API_ENDPOINT = 'http://your-backend-url:port/api/research/process';
```

### Customizing Appearance
Modify `side_panel.css` to change colors, fonts, or layout:

```css
/* Primary gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Success color */
.btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
```

## 🐛 Troubleshooting

### Common Issues

**Extension not loading:**
- Check Developer mode is enabled
- Ensure all files are in the correct location
- Look for errors in `chrome://extensions/`

**Backend connection failed:**
- Verify Spring Boot backend is running on the correct port
- Check for CORS issues in browser console
- Ensure the API endpoint URL is correct
- Make sure Ollama is properly integrated with your Spring Boot backend

**Summarization not working:**
- Select text before clicking summarize
- Check if text selection is too long (5000 char limit)
- Verify backend is responding to requests

**Notes not saving:**
- Check browser storage permissions
- Look for JavaScript errors in console
- Try clearing extension storage and reloading

### Debug Mode
Open Chrome DevTools while the extension is active:
1. Right-click on the extension panel
2. Select "Inspect"
3. Check console for error messages

## 🚀 Development

### Making Changes
1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test your changes

### Adding Features
The codebase is modular and well-documented. Key areas:
- **UI changes**: Modify `side_panel.html` and `side_panel.css`
- **Functionality**: Add to `side_panel.js`
- **Background tasks**: Extend `background.js`
- **Permissions**: Update `manifest.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Extension developed by our team and friends**
