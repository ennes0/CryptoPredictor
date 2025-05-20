from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
import uvicorn
import logging
import traceback
from prediction_utils import predict_crypto, get_direct_crypto_data, generate_synthetic_data_for_prediction
import yfinance as yf
import requests
import json
from datetime import datetime, timedelta
import pandas as pd
import asyncio
import random
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Crypto Prediction API",
    description="API for cryptocurrency price predictions using LSTM and Monte Carlo Dropout",
    version="1.0.0"
)

# Configure CORS - Allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    coin_symbol: str = Field(..., min_length=2, max_length=10)
    lookback: Optional[int] = Field(default=60, ge=30, le=365)
    future_days: Optional[int] = Field(default=7, ge=1, le=30)
    mc_samples: Optional[int] = Field(default=100, ge=10, le=1000)
    train_new_model: Optional[bool] = Field(default=False)

    @validator('coin_symbol')
    def validate_coin_symbol(cls, v):
        # Remove any spaces and convert to uppercase
        v = v.strip().upper()
        # Remove -USD if present (we'll add it back in the endpoint)
        v = v.replace('-USD', '')
        return v

class PredictionResponse(BaseModel):
    success: bool
    coin: Optional[str] = None
    last_close: Optional[float] = None
    predictions: Optional[List[Dict[str, Any]]] = None
    recent_prices: Optional[List[Dict[str, Any]]] = None
    signals: Optional[List[Dict[str, Any]]] = None
    prediction_plot_base64: Optional[str] = None
    change_plot_base64: Optional[str] = None
    training_plot_base64: Optional[str] = None
    date_generated: Optional[str] = None
    error: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "coin": "BTC-USD",
                "last_close": 50000.0,
                "predictions": [
                    {
                        "Date": "2024-05-09",
                        "Predicted_Price": 51000.0,
                        "Lower_Bound": 49000.0,
                        "Upper_Bound": 53000.0,
                        "Daily_Change": 2.0
                    }
                ],
                "recent_prices": [
                    {
                        "Date": "2024-05-08",
                        "Actual_Price": 50000.0
                    }
                ],
                "signals": [
                    {
                        "type": "BUY",
                        "strength": "MODERATE",
                        "reason": "Moderate upward price movement predicted"
                    }
                ],
                "prediction_plot_base64": "base64_encoded_string",
                "change_plot_base64": "base64_encoded_string",
                "training_plot_base64": None,
                "date_generated": "2024-05-08 18:40:17"
            }
        }

@app.get("/")
async def root():
    return {
        "message": "Crypto Prediction API is running",
        "endpoints": {
            "/": "This help message",
            "/health": "Health check endpoint",
            "/predict": "Prediction endpoint (POST)"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
async def make_prediction(request: PredictionRequest):
    try:
        logger.info(f"Received prediction request for {request.coin_symbol}")
        
        # Format coin symbol
        coin_symbol = request.coin_symbol
        if not coin_symbol.endswith('-USD'):
            coin_symbol = f"{coin_symbol}-USD"
        
        logger.info(f"Formatted coin symbol: {coin_symbol}")
        logger.info(f"Request parameters: lookback={request.lookback}, future_days={request.future_days}, mc_samples={request.mc_samples}")

        # Get prediction
        try:
            result = predict_crypto(
                coin_symbol=coin_symbol,
                lookback=request.lookback,
                future_days=request.future_days,
                mc_samples=request.mc_samples,
                train_new_model=request.train_new_model
            )
        except Exception as pred_error:
            logger.error(f"Error in predict_crypto: {str(pred_error)}")
            logger.error(traceback.format_exc())
            return PredictionResponse(
                success=False,
                error=f"Prediction failed: {str(pred_error)}"
            )

        if not result['success']:
            logger.error(f"Prediction returned unsuccessful result: {result.get('error', 'Unknown error')}")
            return PredictionResponse(
                success=False,
                error=result.get('error', 'Prediction failed')
            )

        logger.info(f"Successfully generated prediction for {coin_symbol}")
        return result

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return PredictionResponse(
            success=False,
            error=f"Internal server error: {str(e)}"
        )

class CryptoDetailsRequest(BaseModel):
    coin_symbol: str = Field(..., min_length=2, max_length=20)

# Expanded coin ID mapping for CoinGecko - much more comprehensive
coin_id_map = {
    # Major cryptocurrencies
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'sol': 'solana',
    'ada': 'cardano',
    'dot': 'polkadot',
    'doge': 'dogecoin',
    'avax': 'avalanche-2',     # Note the "-2" suffix for Avalanche
    'avalanche': 'avalanche-2',
    'xrp': 'ripple',
    'bnb': 'binancecoin',
    'matic': 'matic-network',
    'polygon': 'matic-network',
    'link': 'chainlink',
    'xlm': 'stellar',
    'uni': 'uniswap',
    'ltc': 'litecoin',
    'atom': 'cosmos',
    'aave': 'aave',
    'algo': 'algorand',
    'near': 'near',
    'ftm': 'fantom',
    'sand': 'the-sandbox',
    'mana': 'decentraland',
    'grt': 'the-graph',
    'snx': 'synthetix-network-token',
    'comp': 'compound-governance-token',
    'mkr': 'maker',
    
    # Additional cryptocurrencies
    'shib': 'shiba-inu',
    'luna': 'terra-luna-2',
    'cake': 'pancakeswap-token',
    'crv': 'curve-dao-token',
    'vet': 'vechain',
    'icp': 'internet-computer',
    'fil': 'filecoin',
    'theta': 'theta-token',
    'axs': 'axie-infinity',
    'eos': 'eos',
    'etc': 'ethereum-classic',
    'trx': 'tron',
    'xtz': 'tezos',
    'xmr': 'monero',
    'hbar': 'hedera-hashgraph',
    'enj': 'enjincoin',
    'chz': 'chiliz',
    'bat': 'basic-attention-token',
    'dash': 'dash',
    'neo': 'neo',
    'waves': 'waves',
    'zec': 'zcash',
    
    # Stablecoins
    'usdt': 'tether',
    'usdc': 'usd-coin',
    'busd': 'binance-usd',
    'dai': 'dai',
    
    # Wrapped tokens
    'wbtc': 'wrapped-bitcoin',
    'weth': 'weth',
    
    # DeFi tokens
    'sushi': 'sushi',
    'yfi': 'yearn-finance',
    'inch': '1inch',
    '1inch': '1inch',
    'one': 'harmony',
    'harmony': 'harmony',
    'ren': 'republic-protocol',
    'bnt': 'bancor',
    'bal': 'balancer',
    
    # Gaming & Metaverse
    'gala': 'gala',
    'ilv': 'illuvium',
    'flow': 'flow',
    'enjin': 'enjincoin',
    'imx': 'immutable-x',
    
    # Layer 1 blockchains
    'algo': 'algorand',
    'egld': 'elrond-erd-2',
    'elrond': 'elrond-erd-2',
    'one': 'harmony',
    'kda': 'kadena',
    'xdc': 'xdce-crowd-sale',
    'fuse': 'fuse-network-token',
    
    # Layer 2 solutions
    'lrc': 'loopring',
    'op': 'optimism',
    'arbitrum': 'arbitrum',
    'arb': 'arbitrum',
    'zksync': 'zksync',
    'starknet': 'starknet',
    
    # Special cases with version numbers
    'luna': 'terra-luna-2',      # LUNA 2.0
    'luna1': 'terra-luna',       # Original LUNA
    'luna2': 'terra-luna-2',
    'terra': 'terra-luna-2',
    'lunc': 'terra-luna',        # Luna Classic
    'luna-classic': 'terra-luna',
    'avax': 'avalanche-2',
    'avax2': 'avalanche-2',
    'avalanche2': 'avalanche-2'
}

# Common misspellings and aliases
coin_aliases = {
    'bitcoin cash': 'bitcoin-cash',
    'bch': 'bitcoin-cash',
    'ethereum classic': 'ethereum-classic',
    'eth classic': 'ethereum-classic',
    'etc': 'ethereum-classic',
    'binance coin': 'binancecoin',
    'bnb coin': 'binancecoin',
    'xrp ripple': 'ripple',
    'ripple xrp': 'ripple',
    'matic polygon': 'matic-network',
    'polygon matic': 'matic-network',
    'litecoin ltc': 'litecoin',
    'ltc litecoin': 'litecoin',
    'cardano ada': 'cardano',
    'ada cardano': 'cardano',
    'solana sol': 'solana',
    'sol solana': 'solana',
    'polkadot dot': 'polkadot',
    'dot polkadot': 'polkadot',
    'dogecoin doge': 'dogecoin',
    'doge dogecoin': 'dogecoin',
    'avalanche avax': 'avalanche-2',
    'avax avalanche': 'avalanche-2'
}

@app.post("/crypto-details")
async def get_crypto_details(request: CryptoDetailsRequest):
    try:
        logger.info(f"Received request for crypto details: {request.coin_symbol}")
        
        # Format coin symbol
        coin_symbol = request.coin_symbol.strip().lower()
        
        # Check if the coin symbol is in the alias map
        if coin_symbol in coin_aliases:
            coin_symbol = coin_aliases[coin_symbol]
            logger.info(f"Resolved coin symbol to: {coin_symbol}")
        else:
            logger.warning(f"Coin symbol not found in aliases: {request.coin_symbol}")
        
        # Attempt to get the coin ID from the expanded map first
        coin_id = coin_id_map.get(coin_symbol)
        
        if not coin_id:
            logger.warning(f"Coin ID not found in expanded map, trying direct lookup: {coin_symbol}")
            coin_id = coin_symbol  # Fallback to the symbol itself for direct lookup
        
        logger.info(f"Using coin ID: {coin_id}")
        
        # Enhanced CoinGecko implementation with retry logic
        max_retries = 3
        retry_delay = 1
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9'
        }
        
        # Try to get the data from CoinGecko with retries
        success = False
        for attempt in range(max_retries):
            try:
                # Direct API call to CoinGecko
                url = f"https://api.coingecko.com/api/v3/coins/{coin_id}"
                params = {
                    'localization': 'false',
                    'tickers': 'false',
                    'market_data': 'true',
                    'community_data': 'false',
                    'developer_data': 'false',
                    'sparkline': 'false'
                }
                
                logger.info(f"Requesting crypto details from CoinGecko, attempt {attempt+1}/{max_retries}")
                response = requests.get(url, headers=headers, params=params, timeout=10)
                
                if response.status_code == 429:
                    logger.warning(f"Rate limit hit for CoinGecko API, attempt {attempt+1}/{max_retries}")
                    retry_after = int(response.headers.get('Retry-After', retry_delay * (attempt + 1)))
                    await asyncio.sleep(retry_after)
                    continue
                    
                if response.status_code != 200:
                    logger.error(f"CoinGecko API error: {response.status_code} for {coin_id}, attempt {attempt+1}/{max_retries}")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (attempt + 1))
                        continue
                    else:
                        # Try a search instead as last resort
                        break
                
                # Process successful response
                coin_data = response.json()
                
                # Get additional market chart data for price history with retry
                price_url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
                price_params = {
                    'vs_currency': 'usd',
                    'days': '30',
                    'interval': 'daily'
                }
                
                price_response = requests.get(price_url, params=price_params, headers=headers, timeout=10)
                
                if price_response.status_code != 200:
                    logger.warning(f"Failed to get price history for {coin_id}, using empty history")
                    price_data = {"prices": []}
                else:
                    price_data = price_response.json()
                
                # Format price history
                price_history = []
                for timestamp, price in price_data.get('prices', []):
                    date = datetime.fromtimestamp(timestamp/1000).strftime('%Y-%m-%d')
                    price_history.append({
                        'date': date,
                        'price': float(price)  # Ensure price is float
                    })
                
                # Build the response object with comprehensive error handling
                market_data = coin_data.get('market_data', {})
                
                # Handle missing price values with proper fallbacks
                try:
                    current_price = float(market_data.get('current_price', {}).get('usd', 0))
                except (TypeError, ValueError):
                    current_price = 0.0
                    
                # Safely extract other market data with proper type handling
                def safe_float(data, *keys, default=None):
                    value = data
                    for key in keys:
                        if not isinstance(value, dict):
                            return default
                        value = value.get(key)
                        if value is None:
                            return default
                    try:
                        return float(value)
                    except (TypeError, ValueError):
                        return default
                
                details = {
                    "success": True,
                    "id": coin_data.get('id', coin_id),
                    "name": coin_data.get('name', coin_id.capitalize()),
                    "symbol": coin_data.get('symbol', '').upper(),
                    "image": coin_data.get('image', {}).get('large'),
                    "current_price": current_price,
                    "market_cap": safe_float(market_data, 'market_cap', 'usd', default=0),
                    "market_cap_rank": coin_data.get('market_cap_rank'),
                    "fully_diluted_valuation": safe_float(market_data, 'fully_diluted_valuation', 'usd'),
                    "total_volume": safe_float(market_data, 'total_volume', 'usd', default=0),
                    "high_24h": safe_float(market_data, 'high_24h', 'usd'),
                    "low_24h": safe_float(market_data, 'low_24h', 'usd'),
                    "price_change_24h": safe_float(market_data, 'price_change_24h'),
                    "price_change_percentage_24h": safe_float(market_data, 'price_change_percentage_24h'),
                    "price_change_percentage_7d": safe_float(market_data, 'price_change_percentage_7d'),
                    "price_change_percentage_30d": safe_float(market_data, 'price_change_percentage_30d'),
                    "market_cap_change_24h": safe_float(market_data, 'market_cap_change_24h'),
                    "market_cap_change_percentage_24h": safe_float(market_data, 'market_cap_change_percentage_24h'),
                    "circulating_supply": safe_float(market_data, 'circulating_supply'),
                    "total_supply": safe_float(market_data, 'total_supply'),
                    "max_supply": safe_float(market_data, 'max_supply'),
                    "ath": safe_float(market_data, 'ath', 'usd'),
                    "ath_change_percentage": safe_float(market_data, 'ath_change_percentage', 'usd'),
                    "ath_date": market_data.get('ath_date', {}).get('usd'),
                    "atl": safe_float(market_data, 'atl', 'usd'),
                    "atl_change_percentage": safe_float(market_data, 'atl_change_percentage', 'usd'),
                    "atl_date": market_data.get('atl_date', {}).get('usd'),
                    "last_updated": market_data.get('last_updated', datetime.now().isoformat()),
                    "description": coin_data.get('description', {}).get('en', f"No description available for {coin_id}"),
                    "price_history": price_history,
                    "genesis_date": coin_data.get('genesis_date'),
                    "sentiment_votes_up_percentage": coin_data.get('sentiment_votes_up_percentage'),
                    "sentiment_votes_down_percentage": coin_data.get('sentiment_votes_down_percentage'),
                    "coingecko_rank": coin_data.get('coingecko_rank'),
                    "coingecko_score": coin_data.get('coingecko_score'),
                    "community_score": coin_data.get('community_score'),
                    "developer_score": coin_data.get('developer_score'),
                    "liquidity_score": coin_data.get('liquidity_score'),
                    "public_interest_score": coin_data.get('public_interest_score')
                }
                
                logger.info(f"Successfully fetched crypto details for {coin_id}")
                success = True
                return details
                
            except requests.exceptions.RequestException as req_ex:
                logger.error(f"Request error for {coin_id}, attempt {attempt+1}/{max_retries}: {str(req_ex)}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))
                
            except (KeyError, TypeError, ValueError) as ex:
                logger.error(f"Data parsing error for {coin_id}, attempt {attempt+1}/{max_retries}: {str(ex)}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))
                    
            except Exception as ex:
                logger.error(f"Unexpected error for {coin_id}, attempt {attempt+1}/{max_retries}: {str(ex)}")
                logger.error(traceback.format_exc())
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))
        
        # If we reach this point, all CoinGecko attempts have failed
        # Try a search endpoint as a last resort
        if not success:
            logger.warning(f"All direct attempts failed for {coin_id}, trying search endpoint")
            try:
                search_url = "https://api.coingecko.com/api/v3/search"
                search_params = {'query': coin_symbol}
                search_response = requests.get(search_url, headers=headers, params=search_params, timeout=10)
                
                if search_response.status_code == 200:
                    search_data = search_response.json()
                    coins = search_data.get('coins', [])
                    
                    if coins:
                        # Take the first match
                        first_match = coins[0]
                        new_coin_id = first_match.get('id')
                        logger.info(f"Found alternate coin ID via search: {new_coin_id}")
                        
                        # Get data for this coin id
                        alt_url = f"https://api.coingecko.com/api/v3/coins/{new_coin_id}"
                        alt_response = requests.get(alt_url, headers=headers, params=params, timeout=10)
                        
                        if alt_response.status_code == 200:
                            coin_data = alt_response.json()
                            market_data = coin_data.get('market_data', {})
                            
                            # Build the response with the same structure as above
                            details = {
                                "success": True,
                                "id": coin_data.get('id', new_coin_id),
                                "name": coin_data.get('name', new_coin_id.capitalize()),
                                "symbol": coin_data.get('symbol', '').upper(),
                                "image": coin_data.get('image', {}).get('large'),
                                "current_price": safe_float(market_data, 'current_price', 'usd', default=0),
                                "market_cap": safe_float(market_data, 'market_cap', 'usd', default=0),
                                "market_cap_rank": coin_data.get('market_cap_rank'),
                                # ...include the rest of the fields as before
                                "last_updated": market_data.get('last_updated', datetime.now().isoformat()),
                                "price_history": []  # Empty history if we can't fetch it
                            }
                            
                            logger.info(f"Successfully fetched crypto details for {new_coin_id} via search")
                            return details
            except Exception as search_ex:
                logger.error(f"Search endpoint error: {str(search_ex)}")

        # If we've reached here, all CoinGecko attempts failed
        # Return an error response
        return {
            "success": False,
            "error": f"Could not retrieve data for {request.coin_symbol} from CoinGecko API. Please check the symbol and try again.",
            "details": {
                "symbol": request.coin_symbol,
                "attempted_id": coin_id
            }
        }

    except Exception as e:
        logger.error(f"Unexpected error in get_crypto_details: {str(e)}")
        logger.error(traceback.format_exc())
        return {"success": False, "error": f"Internal server error: {str(e)}"}

@app.get("/coins")
async def get_coins():
    """Return a list of popular cryptocurrencies from CoinGecko"""
    try:
        # Enhanced CoinGecko implementation with retry logic
        max_retries = 3
        retry_delay = 1
        
        for attempt in range(max_retries):
            try:
                url = "https://api.coingecko.com/api/v3/coins/markets"
                params = {
                    'vs_currency': 'usd',
                    'order': 'market_cap_desc',
                    'per_page': 250,  # Get more coins for better coverage
                    'page': 1,
                    'sparkline': False,
                    'price_change_percentage': '24h'
                }
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
                
                logger.info(f"Requesting coin list from CoinGecko, attempt {attempt+1}/{max_retries}")
                response = requests.get(url, params=params, headers=headers, timeout=10)
                
                if response.status_code == 429:
                    logger.warning(f"Rate limit hit for CoinGecko API, attempt {attempt+1}/{max_retries}")
                    retry_after = int(response.headers.get('Retry-After', retry_delay * (attempt + 1)))
                    await asyncio.sleep(retry_after)
                    continue
                    
                if response.status_code != 200:
                    logger.error(f"CoinGecko API error: {response.status_code}, attempt {attempt+1}/{max_retries}")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (attempt + 1))
                        continue
                    else:
                        # Return the popular coins list as fallback
                        # (We're removing the fallback logic for this PR)
                        return {"success": False, "error": f"CoinGecko API error: {response.status_code}", "coins": []}
                
                coins_data = response.json()
                processed_coins = []
                
                for coin in coins_data:
                    try:
                        coin_info = {
                            "id": coin.get('id', ''),
                            "name": coin.get('name', ''),
                            "symbol": coin.get('symbol', '').upper(),
                            "image": coin.get('image'),
                            "price": coin.get('current_price'),
                            "market_cap": coin.get('market_cap'),
                            "market_cap_rank": coin.get('market_cap_rank'),
                            "change_24h": coin.get('price_change_percentage_24h'),
                            "isPositive": coin.get('price_change_percentage_24h', 0) > 0,
                            "volume_24h": coin.get('total_volume'),
                            "circulating_supply": coin.get('circulating_supply'),
                            "total_supply": coin.get('total_supply'),
                            "max_supply": coin.get('max_supply'),
                            "ath": coin.get('ath'),
                            "ath_change_percentage": coin.get('ath_change_percentage')
                        }
                        processed_coins.append(coin_info)
                    except Exception as coin_error:
                        logger.warning(f"Error processing coin data: {str(coin_error)}")
                        continue
                
                logger.info(f"Successfully retrieved {len(processed_coins)} coins from CoinGecko")
                return {"success": True, "coins": processed_coins}
                
            except requests.exceptions.RequestException as req_ex:
                logger.error(f"Request error for coin list, attempt {attempt+1}/{max_retries}: {str(req_ex)}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))
                
            except Exception as ex:
                logger.error(f"Unexpected error for coin list, attempt {attempt+1}/{max_retries}: {str(ex)}")
                logger.error(traceback.format_exc())
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))
        
        # If all attempts failed, return error
        return {"success": False, "error": "Failed to retrieve coin list after multiple attempts", "coins": []}
        
    except Exception as e:
        logger.error(f"Error in /coins endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        return {"success": False, "error": "Failed to retrieve coin list", "coins": []}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
