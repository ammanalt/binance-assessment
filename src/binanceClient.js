const crypto = require('crypto');
const { createHttpsRequest, get } = require('./httpUtil');
const { generateQueryString } = require('./utils');

class BinanceClient {
  constructor(_apiKey, _apiSecret) {
    this.apiKey = _apiKey;
    this.apiSecret = _apiSecret;
    this.baseUrl = 'https://testnet.binance.vision'; // hardcoding because we'll only be using this for spot testnet
  }

  /**
   * Fetches the server time from Binance API.
   *
   * @return {Promise<Number>} The server time.
   */
  async getServerTime() {
    const { serverTime } = await createHttpsRequest('https://api.binance.com/api/v3/time', {});
    return serverTime;
  }

  /**
   * Creates a new spot order
   *
   * @param {string} symbol
   * @param {string} side
   * @param {string} type
   * @param {object} params
   * @param {string} [params.timeInForce]
   * @param {number} [params.quantity]
   * @param {number} [params.quoteOrderQty]
   * @param {number} [params.price]
   * @param {string} [params.newClientOrderId]
   * @param {number} [params.strategyId]
   * @param {number} [params.strategytype]
   * @param {number} [params.stopPrice]
   * @param {number} [params.trailingDelta]
   * @param {number} [params.icebergQty]
   * @param {string} [params.newOrderRespType]
   * @param {number} [params.recvWindow]
   */
  createOrder(symbol, side, type, params) {
    // very simple param validation
    // just for the purpose of this assessment/demo - not prod ready by any means
    if (!['BUY', 'SELL'].includes(side)) {
      throw new Error('Invalid order side');
    }

    if (!['MARKET', 'LIMIT'].includes(type)) {
      throw new Error('Invalid order type');
    }

    return this.createSignedRequest(
      Object.assign(params, {
        symbol: symbol.toUpperCase(),
        side: side.toUpperCase(),
        type: type.toUpperCase()
      }),
      '/api/v3/order',
      { method: 'POST' }
    );
  }

  /**
   * Cancels an existing spot order
   *
   * @param {string} symbol
   * @param {number} orderId
   */
  cancelOrder(symbol, orderId) {
    return this.createSignedRequest(
      {
        symbol: symbol.toUpperCase(),
        orderId
      },
      '/api/v3/order',
      { method: 'DELETE' }
    );
  }

  /**
   * Fetches Account Information (USER_DATA)
   *
   * @param {number} [recvWindow]   Defaults to 5000
   */
  getUserData(recvWindow = 5000) {
    return this.createSignedRequest({ recvWindow }, '/api/v3/account', { method: 'GET' });
  }

  /**
   * Fetches Current Open Orders (USER_DATA)
   *
   * @param {string} [symbol]  If the symbol is not sent, orders for all symbols will be returned.
   */
  getOpenOrders(symbol = null) {
    const params = {};
    if (symbol) {
      params.symbol = symbol;
    }

    return this.createSignedRequest(params, '/api/v3/openOrders', { method: 'GET' });
  }

  async createSignedRequest(params, path, headers) {
    const timestamp = await this.getServerTime();
    const queryString = generateQueryString({ ...params, timestamp });
    const signature = crypto.createHmac('sha256', this.apiSecret).update(queryString).digest('hex');

    return createHttpsRequest(`${this.baseUrl}${path}?${queryString}&signature=${signature}`, {
      'X-MBX-APIKEY': this.apiKey,
      ...headers
    });
  }
}

module.exports = { BinanceClient };
