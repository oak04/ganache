# Ganache v7.0.0-alpha.0

{some clever on-brand intro goes here}

## Highlights

- I broke Ganache. On purpose. This is a breaking change release, so you’ll want
  to pay close attention to these changes!
  ([skip to the changes](#breaking-changes))

- It's much faster and more memory efficient. We've seen `truffle test`
  execution times for real world repositories decrease by more than 250%. CLI
  initialization is ~300% faster.

- The `ganache-core` and `ganache-cli` packages you know and love have been
  (almost¹) completely rewritten from the ground up in TypeScript.

- The `ganache-core` and `ganache-cli` npm packages have been merged into a
  single `ganache` package. We’ll continue to publish to the old core and cli
  npm packages for the time being, but you’ll want to switch over to the new
  [`ganache` npm package](https://www.npmjs.com/package/ganache) soon, or
  you’ll start seeing a deprecation notice upon installation.

- The docker container will be moving to
  https://hub.docker.com/r/trufflesuite/ganache

- Ganache now works in the browser and we are working on building interactive
  browser-based documentation. We've built a
  [prototype implementation](https://trufflesuite.github.io/ganache/) and are
  working on optimizing and polishing the experience.

- The `ganache-core` and `ganache-cli` GitHub repositories have been merged
  together and moved to [`ganache`](https://github.com/trufflesuite/ganache).
  Head over to the new repo and show it some love by smashing that ⭐ button!

- For the last year Ganache has been maintained by one person
  ([me](https://github.com/davidmurdoch)). But no more! We welcomed
  [Micaiah Reid](https://github.com/MicaiahReid), formerly of Lockheed Martin,
  to the team in May! Go give him a follow!

- Speaking of new team members…
  [we’re hiring](https://consensys.net/open-roles/?discipline=32535/)! We’ve got
  tons of exciting work planned for the future of Ethereum developer tools. Come
  work with us on making Ethereum more accessible to more developers! Don’t know
  which positions to apply to? Feel free to reach out to anyone from our
  [team](https://www.trufflesuite.com/staff) to inquire more about working here
  at Truffle!

## Breaking Changes

{something about how the important big changes are first}

### The big ones

#### We've renamed our NPM packages

We've renamed `ganache-cli` and `ganache-core` to `ganache`. You'll need to
uninstall the old version before installing the new.

For a global installation uninstall `ganache-cli` before installing
`ganache`:

```console
$ npm uninstall ganache-cli --global
$ npm install ganache@alpha --global
```

For a local installation of `ganache-cli` and/or `ganache-core`:

```console
$ npm uninstall ganache-core ganache-cli
$ npm install ganache@alpha
```

You can now use the new `ganache` (without the `-cli` suffix):

```console
$ ganache
```

in your `package.json` scripts:

```json
{
  "scripts": {
    "start-ganache": "ganache"
  }
}
```

_Note :we've aliased `ganache-cli` to `ganache`, so you can continue using the
`ganache-cli` command in your npm scripts and in your terminal._

#### Transaction hashes are now returned _before_ the transaction receipt is available.

Previously, Ganache would allow this:

```javascript
const txHash = await provider.send("eth_sendTransaction", [transaction]);
const receipt = await provider.send("eth_getTransactionReceipt", [txHash]);
assert.notStrictEqual(receipt, null);
```

The problem is that this behavior is not representative of how Ethereum nodes
behave in the real world; transactions take time to be mined after being
accepted by the node. If you're already using Ethereum libraries like
[web3.js](https://github.com/ChainSafe/web3.js) or
[ethers.js](https://github.com/ethers-io/ethers.js/) you shouldn't have to worry
about this change, as these libraries already handle the transaction lifecycle
for you.

If you have test code similar to the above you'll need to make some changes.

The easy, _but not recommended way_ is to enable `legacyInstamine` mode in
your start up options:

```console
$ ganache --miner.legacyInstamine true
```

or

```javascript
const provider = Ganache.provider({ miner: { legacyInstamine: true } });
```

Enabling `legacyInstamine` mode restores the old behavior, causing transaction
hashes to be returned _after_ the transaction results are persisted in the
database.

The problem with this fix is that you will be unable to reliably run your code
against real Ethereum nodes if the need arises. We've seen this issue arise
over and over once developers switch from testing with Ganache to a testnet or
Mainnet.

A better way is to update your code so that it will behave no matter how long it
takes for your transaction receipt to be available. To do that you'll either
need to use Ethereum subscriptions or HTTP polling.

Here's a somewhat robust example of how to wait for a transaction receipt in
JavaScript with an [EIP-1193 provider](https://eips.ethereum.org/EIPS/eip-1193)
(like your browser wallet's `window.ethereum`) connected via WebSockets:

```javascript
const send = (method, params) => provider.request({ method, params });

const sendRawTransaction = async (provider, rawTransaction) => {
  // first we need to subscribe to all new blocks
  const subId = await send("eth_subscribe", ["newHeads"]);
  try {
    // send the raw transaction
    const txHash = await send("eth_sendRawTransaction", [rawTransaction]);
    // wait for the receipt
    const receipt = await new Promise(resolve => {
      // wait for new messages
      provider.on("message", async ({ type, data }) => {
        // wait for our specific subscription
        if (type !== "eth_subscription" || data.subscription !== subId) return;

        // return our receipt if it is available
        const receipt = await send("eth_getTransactionReceipt", [txHash]);
        if (receipt === null) return;

        resolve(receipt);
      });
    });
  } finally {
    // make sure we always unsubscribe
    await send("eth_unsubscribe", [subId]);
  }
  return receipt;
};
```

I know... this is a lot of code for something that used to be so simple! Which
is why we've added a small helper for the simplest cases:

```javascript
// setup
const provider = Ganache.provider();
const send = (method, params) => provider.request({ method, params });
// subscribe ONCE when starting ganache
await send("eth_subscribe", ["newHeads"]);

// ...

const txHash = await send("eth_sendRawTransaction", [transaction]);
// wait for a single block then continue
await provider.once("message");
const receipt = await send("eth_getTransactionReceipt", [txHash]);
```

`provider.once` is currently non-standard, but can be used in controlled
environments where you are the only one interacting with the node and are doing
so sequentially.

It is important to note thath in `legacyInstamine` mode error messages are
returned on the result's `data` field now. Previously, they were contained
within a combination of the `results: {[hash: string]: unknown}` and
`hashes: string[]` properties. Also, only `evm_mine` and `miner_start` return an
array for the `data` field, as these are the only places where multiple
transactions may be executed (this isn't _entirely_ true when a nonce is skipped
and then the skipped nonce is executed, but this behavior wasn't supported in
previous versions anyway).

#### VM Errors on RPC Response now defaults to disabled

Ganache used to return error messages along side the result for
`eth_sendTransaction` and `eth_sendRawTransaction` RPC calls by default.
This is invalid behavior for a node and caused problems with some libraries.

You can still enable this feature, but to do so you'll need to also enable
`legacyInstamine` mode, as described above:

```console
$ ganache --miner.legacyInstamine true --miner.vmErrorsOnRPCResponse true
```

or

```javascript
const provider = Ganache.provider({
  miner: {
    legacyInstamine: true,
    vmErrorsOnRPCResponse: true
  }
});
```

#### Default startup ether is now 1000 instead of 100

We polled 50 developers about Ganache's startup Ether amount. 44% had no
opinion, 33% didn't need more, and 22% said they change the default amount to
1000 or more. While the 22% is a minority, we felt that it was a large enough
userbase to warrant the change. Feel free to reach out to let us know if you
like/dislike this change.

#### Ganache's `provider` and `server` interface has changed

Ganache's `provider` and `server` internals are no longer leaking. This means
you can’t manipulate the `vm` directly anymore. We’re already planning on
exposing many of the vm events that other tools rely on (like `”step”`) before
launching to stable, but we need further feedback on other internals that will
be missed.
[Open a new issue](https://github.com/trufflesuite/ganache/issues/new) if you
relied on these removed internals and need us to build in public and stable
access to them.

#### Non-consecutive transaction nonces no longer throw error

We now support the `pendingTransactions` event and will soon support actual
`pending` blocks.

Previously, if you sent a transaction with a nonce that did not match the
account's transaction count that transaction would be immediately rejected. In
v7 that transaction will be placed in the node's transaction queue.

You can replace these queued transactions the same way you'd replace the
transaction on Mainnet or tests, by sending another transaction with the same
nonce but a hire gas price.

Currently the eviction mechanism is not tunable, but we plan on exposing options
to change the behavior in the near future.

Note: currently, the number of queued transactions do not have an upper bound
and you can continue adding new transactions until your process runs of memory.
We consider this a memory leak and a bug. Expect this unbounded behavior to
change in a patch-level release in the future.

Note 2: if you use the persisted DB option: we have never stored unexecuted
transactions to disk and do not plan to do so. The same is true of these queued
transactions.

#### Dropping support for Node v8.x

Hopefully this won't affect any one, as it's been unsupported by Node.js
for over a year now.

We plan on dropping support for Node v10 within the next few months. Please
[file an issue](https://github.com/trufflesuite/ganache/issues) if you think you
or your team will be unable to upgrade to Node v12 or later by October.

#### Old databases from v2 are not compatible with v3

### Breaking changes but you probably won't notice:

- `web3_clientVersion` now returns `Ganache/v{number/number/number}`
- `Runtime Error:` errors are now `Runtime error:`
- change `signer account is locked` error to
  `authentication needed: password or unlock`
- change `Exceeds block gas limit` error to `exceeds block gas limit`
- `server.listen` isn't pre-bound to the `server` instance
  (`server.listen.bind(server)`)
- `provider.send` isn't pre-bound to the `provider` instance
  (`provider.listen.bind(provider)`)
- remove `options.keepAliveTimeout`
- rename provider.`removeAllListeners` to provider.clearListeners
- `provider.close` is now `provider.disconnect` and returns promise (no callback
  argument)
- return `Cannot wrap a "[a-zA-Z]+" as a json-rpc type` on `evm_revert` error
  instead of `invalid type` or `false` for invalid snapshot ids
- change invalid string are now error with `cannot convert string value ${value} into type Quantity; strings must be hex-encoded and prefixed with "0x".`
- change `Method {method} not supported` error to
  `The method {method} does not exist/is not available`
- return error `header not found` for requests to non-existent blocks
- replace mutable `provider.options` with `provider.getOptions()`; `getOptions`
  now returns a deep clone of the options object
- default `coinbase` (`eth_coinbase` RPC call) is now the `0x0` address (fixes
  #201)
- `sender doesn't have enough funds to send tx` errors are now prefixed with
  `VM Exception while processing transaction`
- `logs` subscription events are emitted before `newHeads` events

### Technically bug fixes, but these might break your tests:

- The underlying state trie is now computed properly; hashes and stateRoots will
  differ (fixes #664)
- `chainId` option defaults to `1337` everywhere
- remove support for BN in provider RPC methods
- require transaction `data` to be valid json-rpc hex-encoded DATA (must start
  with `0x`)
- blocks are now filled based on actual transaction gas usage, not by the
  transactions stated `gas`/`gasLimit`
- invalid transaction `v` values are no longer allowed
- `provider.connection.close` is no longer a thing on the web3 provider (TODO:
  not sure what's going on here.. need more info)
- previous versions utf-8 instead of binary over websockets when the request was
  binary encoded, the encoding is now echoed by default. new flag/option to
  revert behavior: `wsBinary`
- change error when subscription requested over http from -32000 to -32004
- require transaction `value` string to be valid JSON-RPC encoded QUANTITY,
  e.g., "1000" is no longer valid!
- a result is no longer present when an error is returned (fixes #558)
- transaction ordering from multiple accounts is now ordered by `gasPrice`
- `options` now always treat strings that represent numbers as hex strings, not
  numbers

# Fixes

- An actual block size is now return in `eth_getBlock*` calls
- `eth_sign` returns correct signatures (fixes #556)
- The underlying state trie is now computed properly (fixes #664)

# New features

- Default `gasLimit` is now 12M
  - note: we've never considered changing the default gasLimit as a semver
    breaking change, but welcome civil discourse if you disagree.
- More forking auth options and configuration. See `ganache --help` for details
- Namespaces for options arguments. See `ganache --help` for the new option
  names. Note:
  - you can still use the "legacy" options
  - let us know if you love or hate the namespaced options
- `provider.once(message: string) => Promise<unknown>`
- New option, `miner.defaultTransactionGasLimit` can be set to `"estimate"` to
  automatically use a gas estimate instead of the default when gas/gasLimit has
  been omitted from the transaction.
- `evm_mine` accepts a new param:
  `options: {timestamp?: number, blocks: number?}`.
  - If `options.blocks` is given it mines that number of blocks before
    returning.
- add `miner.coinbase` option (closed #201)
- add `evm_setAccountNonce` (closes #589)
- add `getOptions()` to provider instance
- add `getInitialAccounts()` to provider instance
- `evm_increaseTime` now takes either a number or a JSON-RPC hex-encoded
  QUANTITY value (closes #118)
- add new flag `wsBinary` (`true`, `false` "auto", defaults to "auto")
- add support for non-executable pending transactions (skipped nonces)
- add support for replacement transactions (closes #244 #484)

# Known issues:

- No London support yet. We apologize for being behind on this one. This is our
  top priority and expect a follow up alpha release within 1 week to add in
  london and EIP-1559 transaction (type 2) support.
- Forking is so very slow.
- Forking's `chainId` shouldn't match the remote chain. We really should use a
  different `chainId` than the remote, but still be able to contexualize past
  transactions with their original `chainId`.
- Our TypeScript types aren't properly exported yet.
- Our docker container isn't published yet.
- We don't return a proper pending block yet.
- Uncles aren't fully supported when forking.
- Forking may fail in weird and unexpected ways. We need to "error better".

# Future plans:

- Support for enabling eligible draft EIPs before they are finalized or
  considered for inclusion in a hardfork.
- New hardfork support well in advance of the hardfork launch.
- Add an `eth_createAccessList` method
- Add in VM events so tools like `solcoverage` will work.
- Document how to use ganache in the browser, and what limits it has.
- `evm_mine` will return the new blocks instead of just `0x0`.
- We've laid the ground work for additional performance improvements. We expect
  to see an additional 2-5x speed up for typical testing work loads in the near
  future.
- New `evm_setCode` and `evm_setStorageAt` RPC methods
- `evm_snapshot` ids will be globally unique (unpredictable instead of a
  counter)
- Support `eth_getRawTransactionByHash` RPC method
- Support `debug_accountAt` RPC method
- Allow "mining" to be disabled on start up
- Set CLI options via JSON, package.json, or ENV vars
- "Flavor" Plugins: We're building support for Layer 2 plugins into ganache so
  we can start up and manage other chains. e.g., The `ganache filecoin`
  command will look for the `@ganache/filecoin` package and start up a Filecoin
  and IPFS server.
- Multi-chain configurations: you'll be able to start up your project's entire
  blockchain "ecosystem" form a single ganache command: e.g.,
  `ganache --flavor ethereum --flavor filecoin --flavor optimism`
  - this is where defining your CLI options via JSON config will come in very
    handy!
- Infura integration: e.g., `ganache --fork mainnet` to fork off mainnet by
  authorization against infura to automatically fetch your Infura credentials?

<small>
1. [Nick Paterno](https://twitter.com/NJPaterno), now at
[Staked](https://github.com/Stakedllc/), built our excellent [gas estimation
algorithm](https://github.com/trufflesuite/ganache/blob/88822501912ef14c88e4ff1957def79b4845223d/src/chains/ethereum/ethereum/src/helpers/gas-estimator.ts)
which required no changes
</small>
