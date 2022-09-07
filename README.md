# Binance Take Home Assessment - Amman Pasha

## Task:

```
Prerequisites:
- It must run on node.js (latest LTS version)
- No external http libraries allowed
- No binance/crypto related libraries allowed
- A maximum of 2 external libraries are allowed (the less the better) (Sub-dependencies do not count here)
- Execute below tasks on testnet
- Unit tests/any form of testing for the below tasks is completely optional
- SPOT testnet available at https://testnet.binance.vision
- SPOT documentation available at https://binance-docs.github.io/apidocs/spot/en/

Task:
1. Implement a simple HTTP wrapper to perform signed request
2. Log to console current non 0 asset balances available on the SPOT account
3. Place an LIMIT order on the order book
4. Query the created orders and log its state to console
5. Cancel the order
6. Perform step 2 again
```

---

## How to run

1. Install dependencies:

   `npm i`

2. Create `.env` file - see `.env.example` for reference.

3. To run the script

   `npm start`

4. To run tests

   `npm test`

---

## Assumptions:

- This solution is using two external libraries (Jest and dotenv).
- I have assumed that the statement `"No binance/crypto related libraries allowed"` means that we are not allowed to use Binance's NodeJs connector or any other third-party Binance connector. I have used nodeJS's native `crypto` module to generate a `sha256` hash that is used to sign the API requests. Since it is a native module and not a third-part/external one.
