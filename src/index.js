require('dotenv').config();
const { BinanceClient } = require('./binanceClient');

main = async () => {
  if (!(process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET_KEY)) {
    throw new Error('Please provide API Key and Secret Key!');
  }

  const client = new BinanceClient(process.env.BINANCE_API_KEY, process.env.BINANCE_SECRET_KEY);
  let userData = await client.getUserData();

  // by default the user data endpoint returns all non zero assets only
  // so, we don't need to filter out based on locked+free > 0
  console.log('1. All non zero assets:');
  userData.balances.forEach((asset) => {
    console.log(`\t${asset.asset}: ${asset.free}(free) ${asset.locked}(locked)`);
  });

  console.log('\n2. Place an order');
  const newOrderResp = await client.createOrder('BTCUSDT', 'SELL', 'LIMIT', {
    price: '25000',
    quantity: '0.01',
    timeInForce: 'GTC'
  });
  console.log(`Created new order: ${JSON.stringify(newOrderResp, null, 2)}`);

  console.log('\nAssets after creating order:');
  userData = await client.getUserData();
  userData.balances.forEach((asset) => {
    console.log(`\t${asset.asset}: ${asset.free}(free) ${asset.locked}(locked)`);
  });

  console.log(`\n3. All open orders:`);
  const openOrders = await client.getOpenOrders();
  console.log(openOrders);
  console.log(`Number of open orders: ${openOrders.length}`);

  console.log(`\n4. Cancel order:`);
  const cancelResp = await client.cancelOrder(openOrders[0].symbol, openOrders[0].orderId);
  console.log(cancelResp);

  console.log('\nAssets after order cancellation:');
  userData = await client.getUserData();
  userData.balances.forEach((asset) => {
    console.log(`\t${asset.asset}: ${asset.free}(free) ${asset.locked}(locked)`);
  });
};

main();
