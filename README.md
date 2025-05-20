# EUR/USD Market Analysis Platform

![EUR/USD Analysis Platform](public/dashboard-preview.png)

## 🚀 Overview

This Next.js application provides comprehensive market analysis tools for EUR/USD currency pair trading. Built with modern web technologies, it offers real-time data visualization, technical indicators, and machine learning-based price predictions to help traders make informed decisions.

## ✨ Features

- **Real-time Market Data**: Access up-to-date EUR/USD market information including price, volume, and market statistics
- **Interactive Charts**: Visualize price movements with customizable TradingView-style charts
- **Technical Indicators**: Analyze market trends with popular technical indicators
- **ML Price Predictions**: Leverage LSTM-based machine learning models for price forecasting
- **Responsive Design**: Optimized user experience across desktop and mobile devices
- **Multi-language Support**: Available in English and Spanish

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: Shadcn UI (Tailwind CSS + Radix UI)
- **State Management**: React Hooks
- **Data Visualization**: Lightweight Charts
- **API Integration**: Axios
- **Notifications**: Sonner Toast
- **Package Manager**: Bun

## 📊 Dashboard & Analysis Tools

The platform offers several key sections:

- **Dashboard**: Overview of market assets and latest news
- **EUR/USD Analysis**: Comprehensive price analysis with multiple data points:
  - Current price and 24h change
  - Opening price and price range
  - Volume statistics
  - Bid/Ask spread
  - Weighted average price
  - Previous close comparison
- **Technical Indicators**: Various technical analysis tools
- **Price Prediction**: Machine learning forecasts using LSTM models

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/rony171998/nextjs-shadcn-lstm.git
cd nextjs-shadcn-lstm

# Install dependencies
bun install

# Start development server
bun run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
# Create optimized production build
bun run build

# Start production server
bun run start
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop monitors
- Tablets
- Mobile phones

Layout and components automatically adjust to provide the best user experience on any device.

## 🌐 Deployment

The application is configured for easy deployment on Vercel:

```bash
# Deploy to Vercel
vercel
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created by [Rony Pacheco](https://github.com/rony171998)

---

Made with ❤️ using Next.js and Shadcn UI
