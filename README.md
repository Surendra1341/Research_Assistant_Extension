# 🧠 AI Research Assistant Chrome Extension

A beautiful, modern Chrome extension that helps you summarize text using AI (Ollama backend) and take research notes while browsing the web.

![Extension Preview](https://img.shields.io/badge/Chrome-Extension-brightgreen)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

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
- **Clear and manage** notes easily

### 🎨 Modern Design
- **Glassmorphism UI** with gradient backgrounds
- **Smooth animations** and hover effects
- **Professional iconography** using SVG icons
- **Responsive design** that works on all screen sizes
- **Status indicators** showing backend connectivity

### 🔧 Smart Features
- **Backend connectivity monitoring** - shows online/offline status
- **Current page tracking** - displays active tab information
- **Error handling** with user-friendly notifications
- **Toast notifications** for all actions
- **Loading states** for better user experience

## 🚀 Quick Start

### Prerequisites
- Chrome browser
- Spring Boot backend running locally (for AI summarization)
- Basic knowledge of Chrome extensions

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

## 🎨 Screenshots

### Main Interface
The extension opens as a side panel with a modern, glassmorphism design:
- Gradient background
- Real-time status indicators
- Clean, intuitive layout

### Summarization in Action
1. Select text on any webpage
2. Click "Summarize Selection"
3. Get AI-powered summaries instantly
4. Copy results to clipboard or notes

### Notes Management
- Auto-saving research notes
- Clear and organized interface
- Persistent storage

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
- Check Spring Boot application logs for errors

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

### Code Style
- Use ES6+ features
- Follow async/await patterns
- Add error handling for all API calls
- Keep functions modular and documented

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution
- [ ] Multiple AI model support
- [ ] Export notes to different formats
- [ ] Search within notes
- [ ] Tags and categories for notes
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Open an issue** on GitHub with:
   - Description of the problem
   - Steps to reproduce
   - Chrome version
   - Error messages (if any)

## 🌟 Acknowledgments

- Built with modern web technologies
- Uses Spring Boot for robust backend architecture
- Integrates Ollama for AI capabilities
- Inspired by the need for better research tools
- Thanks to the open-source community

## 📈 Roadmap

### v1.1 (Planned)
- [ ] Multiple AI model selection
- [ ] Export notes functionality
- [ ] Search within notes
- [ ] Performance improvements

### v1.2 (Future)
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Note categories and tags
- [ ] Cloud sync for notes

---

**Made with ❤️ by [Surendra](https://github.com/Surendra1341)**

**⭐ Star this repository if you find it helpful!**

---

## 📞 Connect

- **GitHub**: [@Surendra1341](https://github.com/Surendra1341)
- **Issues**: [Report bugs or request features](https://github.com/Surendra1341/Research_Assistant_Extension/issues)

---

*Happy researching! 🔍📚*
