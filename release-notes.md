# Ganache v7.0.0-alpha.0

{some clever on-brand intro goes here}

## Highlights

- I broke Ganache. On purpose. This is a breaking change release, so you’ll want to pay close attention to these
  changes! ([skip to the changes](#breaking-changes))

- It's much faster and more memory efficient. We've seen `truffle test`
  execution times for real world repositories decrease by more than 250%. CLI
  initialization is ~300% faster.

- The `ganache-core` and `ganache-cli` packages you know and love have been
  (almost¹) completely rewritten from the ground up in TypeScript

- The `ganache-core` and `ganache-cli` npm packages have been merged into a
  single `ganache` package. We’ll continue to publish to the old core and cli npm packages for the time being, but you’ll want to switch over to the new [`ganache` npm package](https://www.npmjs.com/package/ganache) soon, or you’ll start seeing a deprecation notice upon installation.

- The `ganache-core` and `ganache-cli` GitHub repositories have been merged
  together and moved to [`ganache`](https://github.com/trufflesuite/ganache).
  Head over to the new repo and show it some love by smashing that ⭐ button!

- For the last year ganache has been maintained by one person
  ([me](https://github.com/davidmurdoch)). But no more! We welcomed [Micaiah Reid](https://github.com/MicaiahReid), formerly of Lockheed Martin, to the team in May! Go give him a follow!

- Speaking of new team members… we’re hiring](https://consensys.net/open-roles/?discipline=32535/)!
  We’ve got tons of exciting work planned for the future of Ethereum developer tools. Come work with us on making Ethereum more accessible to more developers! Don’t know which positions to apply to? Feel free to reach out to anyone from our [team](https://www.trufflesuite.com/staff) to inquire more about working here at Truffle!

## Breaking Changes

### The big ones

- Transactions hashes are now returned _before_ the transaction is “mined”.

Previously ganache would allow this:

```javascript
const txHash = await provider.send("eth_sendTransaction", [transaction]);
const receipt = await provider.send("eth_getTransactionReceipt", [txHash]);
assert.notStrictEqual(receipt, null);
```

But this behavior is just not how Ethereum nodes behave in the real world, as
transactions take time to be mined after being accepted by the node. If you use
Ethereum libraries like [web3.js](https://github.com/ChainSafe/web3.js) and
[ethers](https://github.com/ethers-io/ethers.js/) you shouldn't have to worry
about this change, as these libraries already handle the receipt fetching for
you. But you have test code that behaves like the above you'll need to make some
changes.

The easy, but not recommended way is to enable `legacyInstamine` mode in
your options:

```console
> $ ganache --miner.legacyInstamine true
```

or

```javascript
const provider = Ganache.provider({ miner: { legacyInstamine: true } });
```

The `legacyInstamine` mode restores the old behavior, causing transaction hashes
to be returned _after_ the transaction results are persisted in the database.

- VM Errors on RPC Response (`noVMErrorsOnRPCResponse`/`vMErrorsOnRPCResponse` options) are no longer returned by default
  This

- Ganache's `provider` and `server` internals are no longer exposed via its properties. This means you can’t manipulate the `vm` directly anymore. We’re already planning on exposing many of the vm events that other tools rely on (like `”step”`), but we need further feedback on other internals that will be missed. [Open a new issue]() if you relied on internals and need us to build public methods
- remove support for Node v8.x

  - The underlying state trie is now computed properly; hashes and stateRoots will differ (fixes #664)

- `Runtime Error:` errors are now "Runtime error:`

- `web3_clientVersion` now returns `Ganache/v{number/number/number}`
- remove support for Node v8.x
- change `signer account is locked` error to `authentication needed: password or unlock`
- change `Exceeds block gas limit` error to `exceeds block gas limit`
- `vmErrorsOnRPCResponse` option defaults to `false`
- `chainId` option defaults to `1337`
- `server.listen` isn't pre-bound to the `server` instance (`server.listen.bind(server)`)
- `provider.send` isn't pre-bound to the `provider` instance (`provider.listen.bind(provider)`)
- rename provider.`removeAllListeners` to provider.clearListeners
- remove `options.keepAliveTimeout`
- remove support for BN in provider RPC methods
- skipping nonces no longer results in an error ("too high" nonces aren't a thing anymore)
- `provider.close` is now `provider.disconnect` and returns promise (no callback argument)
- return `Cannot wrap a "[a-zA-Z]+" as a json-rpc type` on `evm_revert` error instead of `invalid type` or `false` for invalid snapshot ids
- require transaction `data` to be valid json-rpc hex-encoded DATA (must start with `0x`)
- blocks are now filled based on actual transaction gas usage, not by the transactions stated `gas`/`gasLimit`
- invalid transaction `v` values are no longer allowed
- change `invalid block number` error to `cannot convert string value "" into type `Quantity`; strings must be hex-encoded and prefixed with "0x".`
- change `Method {method} not supported` error to `The method {method} does not exist/is not available`
- return error "header not found" for requests to non-existent blocks
- `provider.connection.close` is no longer a thing on the web3 provider (NEEDS MORE INFO!)
- previous versions utf-8 instead of binary over websockets when the request was binary encoded, the encoding is now echoed by default. new flag/option to revert behavior: `wsBinary`
- change error when subscription requested over http from -32000 to -32004
- require transaction `value` string to be valid JSON-RPC encoded QUANTITY ("1000" is no longer valid!)
- replace `provider.options` with `provider.getOptions()`
- Ganache no longer returns both an `error` and `result` via the provider when using old provider.send via `callback`.
- (`legacyInstamine` mode only): error messages are returned on the result's `data` field now. Previously they were contained within a combination of the 'results: {[hash: string]: unknown}' and 'hashes: string[]' properties. Also, only `evm_mine` and `miner_start` return an array for the 'data' field, as these are the only places where multiple transactions may be executed (this isn't _entirely_ true when a nonce is skipped and then the skipped nonce is executed, but this behavior wasn't supported in v2 anyway!).
- a result is no longer present when an error is returned. fixes #558 (for ganache v3 release only).
- default `coinbase` (`eth_coinbase` RPC call) is now the `0x0` address (fixes #201)
- transaction ordering from multiple accounts is now ordered by `gasPrice`
- old databases from v2 are not compatible with v3
- `options` now always treat strings that represent numbers as hex strings, not numbers
- default `gasLimit` is now 12M
- `sender doesn't have enough funds to send tx` errors are now prefixed with `VM Exception while processing transaction`'`
- `logs` subscription events are emitted before `newHeads` events
- the default amount of Ether for created dev accounts has been increased to 1000

- [Nick Paterno](https://twitter.com/NJPaterno), now at [Staked](https://github.com/Stakedllc/), built our excellent [gas estimation algorithm](https://github.com/trufflesuite/ganache/blob/88822501912ef14c88e4ff1957def79b4845223d/src/chains/ethereum/ethereum/src/helpers/gas-estimator.ts) which required no changes

# Future plans:
