# Analytics Market AI

## Description

Analytics Market AI is an advanced web platform designed for the analysis and prediction of currency pairs, specifically EUR/USD and USD/COP, using cutting-edge artificial intelligence and deep learning models. The platform provides interactive charts, real-time market data, and AI-powered predictions to help traders and analysts make informed decisions. It aims to democratize access to sophisticated financial analysis tools, regardless of user experience.

## Features

*   **Real-time Market Overview:** Displays current prices, 24-hour changes, highs, and lows for key currency pairs (EUR/USD, USD/COP).
*   **Interactive Charts:** Visualize historical and predicted price movements with customizable chart types (line, candlestick, bar, area) and timeframes (daily, weekly, monthly, yearly).
*   **AI-Powered Predictions:** Utilizes advanced deep learning models like LSTM, GRU, Bidirectional LSTM, and Attention Mechanisms to generate accurate future price predictions.
*   **Model Selection:** Allows users to select different AI model architectures to tailor predictions to their specific strategies.
*   **Technical Indicators:** Provides access to various technical indicators for comprehensive market analysis.
*   **Comprehensive Model Documentation:** Dedicated pages explaining the architecture, strengths, weaknesses, use cases, and performance metrics of each prediction model.
*   **Multilingual Support:** Supports English and Spanish for a broader user base.
*   **AI Chat Assistant:** An integrated chatbot provides context-aware assistance and answers questions about the platform, market analysis, and AI predictions.
*   **Responsive Design:** Optimized for seamless experience across various devices, from desktops to mobile phones.

## Installation

To set up and run the Analytics Market AI project locally, follow these steps:

### Prerequisites

*   Node.js (v18.x or higher)
*   npm, yarn, or pnpm (npm is recommended)
*   A PostgreSQL-compatible database (e.g., [Neon](https://neon.tech/)) with your market data.

### Steps

1.  **Clone the repository:**
    \`\`\`bash
    git clone https://github.com/rony171998/nextjs-shadcn-lstm.git
    cd nextjs-shadcn-lstm
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or yarn install
    # or pnpm install
    \`\`\`

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of your project and add the following environment variables. Replace the placeholder values with your actual database connection string and application URL.

    \`\`\`env
    DATABASE_URL="YOUR_NEON_DATABASE_CONNECTION_STRING"
    NEXT_PUBLIC_BASE_URL="http://localhost:3000" # Or your Vercel deployment URL
    PORT=3000 # Optional, default is 3000
    \`\`\`
    *   `DATABASE_URL`: Your connection string for the PostgreSQL database (e.g., from Neon). Ensure your database contains tables named `eur_usd` and `usd_cop` with `fecha`, `último`, `apertura`, `máximo`, `mínimo`, and `volumen` columns.
    *   `NEXT_PUBLIC_BASE_URL`: The public URL where your application will be accessible. For local development, `http://localhost:3000` is typical. For Vercel deployments, this will be automatically set.

4.  **Run the development server:**
    \`\`\`bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    \`\`\`

5.  **Open in your browser:**
    The application will be accessible at `http://localhost:3000` (or the port you specified).

## Usage

Once the application is running, you can:

*   **Navigate the Landing Page:** Explore the project's features, about us, blogs, and FAQ sections.
*   **Access the Dashboard:** Click "Get started" or navigate to `/dashboard` to see an overview of EUR/USD and USD/COP market data.
*   **View Detailed Charts:** Click on a currency pair card (e.g., EUR/USD) to view its historical data and AI predictions on an interactive chart. You can change the timeframe, chart type, and prediction model.
*   **Explore Prediction Models:** Visit the `/models` section (accessible via the sidebar) to learn about the different AI models used, their architectures, performance metrics, and training processes.
*   **Interact with the AI Assistant:** Use the chat bubble at the bottom right corner to ask questions about the platform, market data, or AI models. The assistant provides context-aware responses and suggestions.
*   **Switch Language:** Use the language switcher in the navigation bar to toggle between English and Spanish.

## Contributing

We welcome contributions to the Analytics Market AI project! If you'd like to contribute, please follow these guidelines:

1.  **Fork the repository.**
2.  **Clone your forked repository** to your local machine.
3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
4.  **Make your changes** and ensure the code adheres to the existing style and conventions.
5.  **Write clear, concise commit messages.**
6.  **Push your branch** to your forked repository.
7.  **Open a Pull Request** to the `main` branch of the original repository. Provide a detailed description of your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact

For any inquiries or support, please feel free to reach out:

*   **GitHub:** [rony171998](https://github.com/rony171998)
*   **Email:** [rony171998@gmail.com](mailto:rony171998@gmail.com) (Replace with your actual email)

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **UI Library:** [React](https://react.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Charting Library:** [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (with [Neon](https://neon.tech/) for serverless deployment)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Icons:** [Lucide React](https://lucide.dev/icons/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Screenshots/Demo

(Optional: Add screenshots of your application here or a link to a live demo.)

![Analytics Market AI Dashboard](public/images/dashboard.png)
_Placeholder image for the dashboard. Replace with actual screenshots._
