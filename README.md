# 🎨 CSS Theme Generator

A real-time CSS theme generator with live preview, built with Next.js 14 and React.

## Features

✨ **Real-time Theme Generation**
- Randomly generate beautiful color schemes
- Instant live preview of all changes
- See generated CSS code in real-time

🎯 **Comprehensive Controls**
- **Colors:** Primary, Secondary, Background, Text
- **Typography:** Font size and family selection
- **Effects:** Border radius, shadow intensity, spacing unit

🌐 **Live Website Preview** (NEW!)
- Enter any website URL to test your theme
- CSS is injected directly into the website preview
- Real-time updates as you adjust your theme
- Perfect for testing themes on actual websites

📱 **Responsive Layout**
- Left panel: Slider controls + live preview input
- Right panel: Live preview + CSS code display
- Split view with perfect proportions

## Tech Stack

- **Next.js 14** - React framework
- **React Hooks** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Zero external dependencies** - Lightweight and fast

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Adjust Sliders** - Change colors, fonts, effects in the left panel
2. **See Changes Live** - Right panel updates in real-time
3. **Generate New Theme** - Click "✨ Generate New Theme" for random themes
4. **Test on Real Websites** - Enter a website URL and click "Load Website" to inject your theme in real-time
5. **Copy CSS** - Select and copy the generated CSS code

## Project Structure

```
css-theme-generator/
├── app/
│   ├── components/
│   │   ├── ThemeGenerator.tsx  # Main component
│   │   ├── Controls.tsx         # Control sliders
│   │   └── Preview.tsx          # Live preview
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── package.json
├── tailwind.config.js
├── next.config.js
└── postcss.config.js
```

## Features Explained

### Random Theme Generation
Click "Generate New Theme" to create random combinations of:
- Colors from a curated palette
- Font families (serif, monospace, sans-serif, etc.)
- Border radius (4px-30px)
- Shadow intensity (0-20)
- Spacing units (4px-24px)

### Real-time Preview
The preview shows:
- Styled cards with current theme
- Color palette showcase
- Typography examples
- Current theme settings

### CSS Code Export
Automatically generated CSS includes:
- CSS variables (custom properties)
- Ready-to-use color and spacing values
- Shadow definitions
- Font configurations

## Tips

💡 Try different combinations of high shadow intensity + large border radius for smooth, modern designs.

💡 Adjust font size and spacing together for harmonious layouts.

💡 Use the color picker to fine-tune automatically generated themes.

## Performance

- Lightweight with no external dependencies
- Instant updates using React hooks
- CSS variables for efficient styling
- Optimized re-renders

## Live Preview Guide

### Using Live Website Preview

1. **Enter Website URL** - Type `https://example.com` in the "Live Preview" section
2. **Click "Load Website"** - The website loads in an iframe
3. **Adjust Your Theme** - As you change sliders, the CSS is injected in real-time
4. **See Live Results** - Watch how your theme transforms the website

### Important Notes

⚠️ **CORS & Security:**
- Some websites block iframe embedding (X-Frame-Options header)
- This is a security feature - we respect website restrictions
- Works best with sites that allow iframe embedding
- Local development sites and many test servers work great!

## Future Enhancements

- Export theme as JSON/CSS file
- Save favorite themes to local storage
- Theme presets (Material, Glassmorphism, Neumorphism)
- Dark mode generator
- Animation speed controls
- Proxy service for CORS bypass (optional)

---

## 🚀 Deployment

✅ **Live Demo:** https://css-theme-generator-six.vercel.app

📦 **GitHub Repository:** https://github.com/seojoonkim/css-theme-generator

### Deploy Your Own

Click the button below to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seojoonkim/css-theme-generator)

---

Built with ☀️ by Raon
