# lendroid-js
A library to wrapper the lendroid Server and Lendroid Contract API's

## On the Lendroid UI
  1. Sends a HTTP POST request with a Loan Offer object to `/offers` endpoint of Lendroid API server API service whenever Lender creates the loan offer.
  2. On the API server, this Loan Offer object is saved.
  3. Method Signature: `lendroidJS.createOffer(loanTerms).sender(lender)`
    * `POST /offers`
## On the Relayer UI
  1. Retrieves loan offers via HTTP GET from the API service
  2. Method Signature: `lendroidJS.getOffers()`
    * `GET /offers`
  2. Sends the picked pair of (0x order, loan offer) to Lendroid’s Smart Contracts via Web3.js to open a position. (Calls [PositionManager.openPosition](https://github.com/gedanziger/lendroid-protcol-private/blob/AddDockerSupport/src/PositionManager.sol))
    * Calls `PositionManager.openPosition(orderValues[], orderAddresses[], orderV, orderRS[], offerValues[], offerAddresses[]).sender(marginTrader)`

      ```
      lendroidJS.openPosition(orderValues[],
                              orderAddresses[],
                              offerValues[],
                              orderV,
                              orderRS[],
                              offerValues[],
                              offerAddresses[])
      ```
