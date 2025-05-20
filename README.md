# Crypto Prediction Platform

A full-stack application for cryptocurrency price predictions using LSTM and Monte Carlo Dropout.

## Features

- Real-time cryptocurrency price predictions
- Monte Carlo Dropout for uncertainty estimation
- Interactive charts and visualizations
- Trading signals and recommendations
- Dark/Light mode support
- Responsive design

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

## Project Structure

```
.
├── backend/               # FastAPI backend
│   ├── main.py           # FastAPI application
│   ├── prediction_utils.py # Prediction functions
│   └── requirements.txt   # Python dependencies
└── prediction/           # React frontend
    ├── src/             # Source code
    ├── public/          # Static files
    └── package.json     # Node.js dependencies
```

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd prediction
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### GET /
- Root endpoint showing API information

### GET /health
- Health check endpoint

### POST /predict
- Main prediction endpoint
- Parameters:
  - `coin_symbol`: Cryptocurrency symbol (e.g., "BTC-USD")
  - `lookback`: Number of days to look back (default: 60)
  - `future_days`: Number of days to predict (default: 7)
  - `mc_samples`: Number of Monte Carlo samples (default: 100)
  - `train_new_model`: Whether to train a new model (default: false)

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a cryptocurrency symbol (e.g., "BTC", "ETH", "SOL")
3. View the prediction results, including:
   - Price predictions with confidence intervals
   - Daily price changes
   - Trading signals
   - Historical data visualization

## Development

### Backend Development
- The backend uses FastAPI for high performance and automatic API documentation
- Prediction models are implemented in `prediction_utils.py`
- API endpoints are defined in `main.py`

### Frontend Development
- Built with React and Material-UI
- Uses Chart.js for data visualization
- Implements responsive design with Tailwind CSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 