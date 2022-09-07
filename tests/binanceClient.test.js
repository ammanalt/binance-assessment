require('dotenv').config();
const { BinanceClient } = require('../src/binanceClient');

let client;
beforeAll(() => {
  client = new BinanceClient(process.env.BINANCE_API_KEY, process.env.BINANCE_SECRET_KEY);
});

describe('BinanceClient', () => {
  describe('Server time', () => {
    it('should return server timestamp', async () => {
      const serverTime = await client.getServerTime();
      expect(serverTime).toBeTruthy();
    });
  });

  describe('Order Creation', () => {
    it('should create an order', async () => {
      const newOrderResp = await client.createOrder('BTCUSDT', 'SELL', 'LIMIT', {
        price: '25000',
        quantity: '0.01',
        timeInForce: 'GTC'
      });
      expect(newOrderResp.symbol).toEqual('BTCUSDT');
      expect(newOrderResp.price).toEqual('25000.00000000');
      expect(newOrderResp.origQty).toEqual('0.01000000');
      expect(newOrderResp.timeInForce).toEqual('GTC');
      expect(newOrderResp.type).toEqual('LIMIT');
      expect(newOrderResp.side).toEqual('SELL');
    });

    it('should throw exception when order side is invalid', async () => {
      try {
        await client.createOrder('BTCUSDT', 'INVALID_SIDE', 'MARKET', {
          price: '25000',
          quantity: '0.01',
          timeInForce: 'GTC'
        });
      } catch (error) {
        expect(error.message).toBe('Invalid order side');
      }
    });

    it('should throw exception when order type is invalid', async () => {
      try {
        await client.createOrder('BTCUSDT', 'SELL', 'INVALID_TYPE', {
          price: '25000',
          quantity: '0.01',
          timeInForce: 'GTC'
        });
      } catch (error) {
        expect(error.message).toBe('Invalid order type');
      }
    });
  });

  describe('Order Cancellation', () => {
    it('should cancel an order', async () => {
      const { symbol, orderId } = await client.createOrder('BTCUSDT', 'SELL', 'LIMIT', {
        price: '25000',
        quantity: '0.01',
        timeInForce: 'GTC'
      });

      const cancelResp = await client.cancelOrder(symbol, orderId);
      expect(cancelResp.symbol).toEqual(symbol);
      expect(cancelResp.orderId).toEqual(orderId);
      expect(cancelResp.status).toEqual('CANCELED');
    });
  });

  describe('User Data', () => {
    it('should return account information', async () => {
      const accInfo = await client.getUserData();
      expect(accInfo).toHaveProperty('makerCommission');
      expect(accInfo).toHaveProperty('takerCommission');
      expect(accInfo).toHaveProperty('buyerCommission');
      expect(accInfo).toHaveProperty('sellerCommission');
      expect(accInfo).toHaveProperty('canTrade');
      expect(accInfo).toHaveProperty('canWithdraw');
      expect(accInfo).toHaveProperty('canDeposit');
      expect(accInfo).toHaveProperty('brokered');
      expect(accInfo).toHaveProperty('updateTime');
      expect(accInfo).toHaveProperty('accountType');
      expect(accInfo).toHaveProperty('balances');
      expect(accInfo).toHaveProperty('permissions');
    });
  });

  describe('Open Orders', () => {
    it('should return all open orders', async () => {
      await client.createOrder('BTCUSDT', 'SELL', 'LIMIT', {
        price: '25000',
        quantity: '0.01',
        timeInForce: 'GTC'
      });

      const openOrders = await client.getOpenOrders('BTCUSDT');
      expect(openOrders.length).toBeGreaterThan(0);
    });
  });
});
