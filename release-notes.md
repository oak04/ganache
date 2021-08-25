<a id="user-content-v7.0.0-alpha.0-top"></a>

<h4>
  <p align="center">
		<code>&nbsp;<a href="#user-content-v7.0.0-alpha.0-highlights">Highlights</a>&nbsp;</code>&nbsp;
		<img height="36" width="0" src="https://raw.githubusercontent.com/davidmurdoch/px/master/1px.gif">
		<code>&nbsp;<a href="#user-content-v7.0.0-alpha.0-breaking-changes">Breaking&nbsp;Changes</a>&nbsp;</code>&nbsp;
		<img height="36" width="0" src="https://raw.githubusercontent.com/davidmurdoch/px/master/1px.gif">
		<code>&nbsp;<a href="#user-content-v7.0.0-alpha.0-fixes">Fixes</a>&nbsp;</code>&nbsp;
		<img height="36" width="0" src="https://raw.githubusercontent.com/davidmurdoch/px/master/1px.gif">
		<code>&nbsp;<a href="#user-content-v7.0.0-alpha.0-new-features">New&nbsp;Features</a>&nbsp;</code>
		<img height="36" width="0" src="https://raw.githubusercontent.com/davidmurdoch/px/master/1px.gif">
		<code>&nbsp;<a href="#user-content-v7.0.0-alpha.0-known-issues">Known&nbsp;Issues</a>&nbsp;</code>
		<img height="36" width="0" src="https://raw.githubusercontent.com/davidmurdoch/px/master/1px.gif">
		<code>&nbsp;<a href="#user-content-v7.0.0-alpha.0-future-plans">Future&nbsp;Plans</a>&nbsp;</code>
		<img height="36" width="0" src="https://raw.githubusercontent.com/davidmurdoch/px/master/1px.gif">
  </p>
</h4>

---

**This release is the first _alpha_ release of the new and improved Ganache v7.0.0. We've got a lot in store for you in this breaking-change release, so you'll definitely want to read on!**

But first, this _is_ an alpha release; even these 7.0.0 release notes are "alpha" and the information here is likely incomplete. There will be bugs and kinks to work out before we ship things off to `beta`, `rc`, then finally to `latest`. You absolutely _should_ use this alpha release, but only to try it out and let us know where it breaks for you!

In other words: 🔥🐉 Here be dragons 🔥🐉️

<a id="user-content-v7.0.0-alpha.0-highlights"></a>

---

# <p align="center"><a href="#user-content-v7.0.0-alpha.0-highlights"><img alt="Highlights" width="auto" src="https://raw.githubusercontent.com/trufflesuite/ganache/release-notes-assets/title-images/highlights.svg"></a></p>

- We broke Ganache… on purpose. 😅 This is a breaking change release, so you’ll want to pay close attention to these changes! ([skip to the broken-stuff](#user-content-v7.0.0-alpha.0-breaking-changes))

- It's much faster and more memory efficient. We've seen `truffle test` execution times for real world repositories run in 1/3 the time. CLI initialization is ~300% faster. You can now run Ganache indefinitely without ever-increasing memory usage (with a few _very rare_ exceptions¹ we consider to be bugs that will be fixed in a later release).

- The `ganache-core` and `ganache-cli` packages you know and love have been (almost²) completely rewritten from the ground up in TypeScript.

- The `ganache-core` and `ganache-cli` npm packages have been merged into a single `ganache` package. We’ll continue to publish to the old core and cli npm packages for the time being, but you’ll want to switch over to the new [`ganache` npm package](https://www.npmjs.com/package/ganache) soon, or you’ll start seeing a deprecation notice upon installation.

- The `ganache-core` and `ganache-cli` GitHub repositories have been merged together and moved to [`ganache`](https://github.com/trufflesuite/ganache). Head over to the new repo and show it some love by smashing that ⭐ button!

- The docker container will be moving to https://hub.docker.com/r/trufflesuite/ganache

- Ganache now works in the browser and we are working on building interactive browser-based documentation. We've built a [prototype implementation](https://trufflesuite.github.io/ganache/) and are working on optimizing and polishing the experience.

- For the last year Ganache has been mostly maintained by one person ([me](https://github.com/davidmurdoch)). But now there are a whole two of us! We welcomed [Micaiah Reid](https://github.com/MicaiahReid), formerly of Lockheed Martin, to the team in May! Go give him a follow!

- Speaking of new team members… [we're hiring](https://consensys.net/open-roles/?discipline=32535/)! We’ve got tons of exciting work planned for the future of Ethereum developer tools. Come work with us on making Ethereum more accessible to more developers! Don’t know which positions to apply to? Feel free to reach out to anyone from our [team](https://www.trufflesuite.com/staff) to inquire more about working here at Truffle!

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-top">back to top</a></sup></p>

## <a id="user-content-v7.0.0-alpha.0-breaking-changes" ></a>

# <p align="center"><a href="#user-content-v7.0.0-alpha.0-breaking-changes"><img alt="Breaking Changes" width="auto" src="https://raw.githubusercontent.com/trufflesuite/ganache/release-notes-assets/title-images/breaking-changes.svg"></a></p>

Many changes are "breaking", some more than others. We've organized the breaking changes into three categories:

- [The big ones](#user-content-v7.0.0-alpha.0-the-big-ones)
- [Other breaking changes, but you probably won't notice or care](#user-content-v7.0.0-alpha.0-other-breaking-changes-but-you-probably-wont-notice-or-care)
- [Technically bug fixes, but these might break your tests](#user-content-v7.0.0-alpha.0-technically-bug-fixes-but-these-might-break-your-tests)

## <a id="user-content-v7.0.0-alpha.0-the-big-ones"></a>The big ones

These changes are likely to cause you some trouble if you upgrade blindly. We've ordered them from most-likely to least-likely to cause problems:

- [We've renamed our packages](#user-content-v7.0.0-alpha.0-weve-renamed-our-packages)
- [Transaction hashes are now returned before the transaction receipt is available.
  ](#user-content-v7.0.0-alpha.0-transaction-hashes-are-now-returned-before-the-transaction-receipt-is-available)
- [VM Errors on RPC Response now defaults to disabled](#user-content-v7.0.0-alpha.0-vm-errors-on-rpc-response-now-defaults-to-disabled)
- [Default startup ether is now 1000 instead of 100](#user-content-v7.0.0-alpha.0-default-startup-ether-is-now-1000-instead-of-100)
- [Ganache's `provider` and `server` interfaces have changed](#user-content-v7.0.0-alpha.0-ganaches-provider-and-server-interface-have-changed)
- [Non-consecutive transaction nonces no longer throw an error](#user-content-v7.0.0-alpha.0-non-consecutive-transaction-nonces-no-longer-throw-an-error)
- [We've dropped support for Node v8.x](#user-content-v7.0.0-alpha.0-weve-dropped-support-for-node-v8x)
- [Old databases from previous versions are not compatible with v7.0.0](#user-content-v7.0.0-alpha.0-old-databases-from-previous-versions-are-not-compatible-with-v700)

<p align="center"><sub>🟀</sub></p>

### <a id="user-content-v7.0.0-alpha.0-weve-renamed-our-packages"></a>We've renamed our packages

We've renamed `ganache-cli` and `ganache-core` to `ganache`. You'll need to uninstall the old version before installing the new.

For a global installation uninstall `ganache-cli` before installing `ganache`:

```console
$ npm uninstall ganache-cli --global
$ npm install ganache@alpha --global
```

For a local installation of `ganache-cli` and/or `ganache-core`:

```console
$ npm uninstall ganache-core ganache-cli
$ npm install ganache@alpha
```

You can now use the new `ganache` (without the `-cli` suffix) on the command line:

```console
$ ganache # use `npx ganache` if you installed locally
```

and via global or local install in your `package.json` scripts:

```json
{
  "scripts": {
    "start-ganache": "ganache"
  }
}
```

_Note: we've aliased `ganache-cli` to `ganache`, so you can continue using the `ganache-cli` command in your npm scripts and in your terminal._

The docker container will be moving soon -- from https://hub.docker.com/r/trufflesuite/ganache-cli to https://hub.docker.com/r/trufflesuite/ganache.

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-the-big-ones">back to list</a></sup></p>

### <a id="user-content-v7.0.0-alpha.0-transaction-hashes-are-now-returned-before-the-transaction-receipt-is-available"></a>Transaction hashes are now returned _before_ the transaction receipt is available.

Previously, Ganache would allow this:

```javascript
// BAD CODE THAT USED TO WORK
const provider = Ganache.provider();
const txHash = await provider.send("eth_sendTransaction", [transaction]);
const receipt = await provider.send("eth_getTransactionReceipt", [txHash]);
assert.notStrictEqual(receipt, null);
```

The problem is that this behavior is not representative of how Ethereum nodes behave in the real world; transactions take time to be mined after being accepted by the node. If you're already using Ethereum libraries like [web3.js](https://github.com/ChainSafe/web3.js) or [ethers.js](https://github.com/ethers-io/ethers.js/) and connecting over WebSockets, you shouldn't have to worry about this change, as these libraries already handle the transaction lifecycle for you.

If you are using Truffle to run your tests you'll want to enable the `websockets` flag in your Truffle config:

```javascript
// truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      websockets: true // ← add this
    },
    /* … */
```

_However, even with WebSockets enabled, some versions of these libraries, including `truffle`, do not always set up their subscription events fast enough. When this happens the client will miss the notification from Ganache and fall back to polling for changes (slow). We're working with libraries to fix this behavior, but in the meantime you might want to go against our advice and enable `legacyInstamine` mode, as described below, when starting Ganache._

If you have test code similar to the `BAD CODE THAT USED TO WORK` above you'll need to make some changes.

The easy, _but not recommended way_ is to enable `legacyInstamine` mode in your start up options:

```console
$ ganache --miner.legacyInstamine true
```

or

```javascript
const provider = Ganache.provider({ miner: { legacyInstamine: true } });
```

Enabling `legacyInstamine` mode restores the old behavior, causing transaction hashes to be returned _after_ the transaction results are persisted in the database.

The problem with this fix is that you will be unable to reliably run your code against real Ethereum nodes later. We've seen this issue arise over and over once developers attempt their tests against a testnet or on Mainnet.

A better way is to update your code so that it will behave no matter how long it takes for your transaction receipt to be available. To do that you'll either need to use Ethereum subscriptions or HTTP polling.

Here's a somewhat robust example of how to wait for a transaction receipt in JavaScript with an [EIP-1193 provider](https://eips.ethereum.org/EIPS/eip-1193) (like your browser wallet's `window.ethereum`) connected via WebSockets:

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

I know… this is a lot of code for something that used to be so simple! This is why we've added a small helper for the simplest cases:

```javascript
// setup
const provider = Ganache.provider();
const send = (method, params) => provider.request({ method, params });
// subscribe ONCE when starting ganache
await send("eth_subscribe", ["newHeads"]); // ← add this

// …

const txHash = await send("eth_sendRawTransaction", [transaction]);
// wait for a single block then continue
await provider.once("message"); // ← add this
const receipt = await send("eth_getTransactionReceipt", [txHash]);
```

`provider.once` is currently non-standard and should only be used in controlled environments where you are the only one interacting with the node and are sending transactions sequentially.

Note that `legacyInstamine` + `vmErrorsOnRPCResponse` mode's error messages, from a rejected Promise or the `error` parameter in callback-style, are now formatted as follows:

```typescript
{
   data: Record<string /* transaction hash */, {
    hash: string;
    programCounter: number;
    result: string;
    reason?: string;
    message: string;
  }>
}
```

Previously, these errors were contained within a combination of the `results: {[hash: string]: unknown}` and `hashes: string[]` properties:

```typescript
{
  results: Records<string /* tranasction hash*/, {
    error: string,
    program_counter: number,
    reason?: string
    return: string
  }>
  hashes: string[] // array of transaction hashes
}
```

Also, only `evm_mine` and `miner_start` return an array for the `data` field, as these are the only places where multiple transactions may be executed (this isn't _entirely_ true when a nonce is skipped and then the skipped nonce is executed, but this behavior wasn't supported in previous versions anyway).

### <a id="user-content-v7.0.0-alpha.0-vm-errors-on-rpc-response-now-defaults-to-disabled"></a>VM Errors on RPC Response now defaults to disabled

Ganache used to return error messages alongside the result for `eth_sendTransaction` and `eth_sendRawTransaction` RPC calls by default. This is invalid behavior for a node and causes problems with some libraries.

You can still enable this feature, but to do so you'll need to also enable `legacyInstamine` mode, as described above:

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

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-the-big-ones">back to list</a></sup></p>

### <a id="user-content-v7.0.0-alpha.0-default-startup-ether-is-now-1000-instead-of-100"></a>Default startup ether is now 1000 instead of 100

We polled 50 developers about Ganache's startup Ether amount. 44% had no opinion, 33% didn't need more, and 22% said they change the default amount to 1000 or more. While the 22% is a minority, we felt that it was a large enough percentage to warrant the change. Feel free to reach out to let us know if you like/dislike this change.

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-the-big-ones">back to list</a></sup></p>

### <a id="user-content-v7.0.0-alpha.0-ganaches-provider-and-server-interface-have-changed"></a>Ganache's `provider` and `server` interfaces have changed

Ganache's `provider` and `server` internals are no longer leaking. This means you can’t manipulate the `vm` directly anymore. We’re already planning on exposing many of the vm events that other tools rely on (like `”step”`) before launching to stable, but we need further feedback on other internals that will be missed. [Open a new issue](https://github.com/trufflesuite/ganache/issues/new?milestone=7.0.0) if you relied on these removed internals and need us to build in public and stable access to them.

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-the-big-ones">back to list</a></sup></p>

### <a id="user-content-v7.0.0-alpha.0-non-consecutive-transaction-nonces-no-longer-throw-an-error"></a> Non-consecutive transaction nonces no longer throw an error

We now support the `pendingTransactions` event and will soon support actual `pending` blocks.

Previously, if you sent a transaction with a nonce that did not match the account's transaction count that transaction would be immediately rejected. In v7 that transaction will be placed in the node's transaction queue.

You can replace these queued transactions the same way you'd replace the transaction on Mainnet or tests, by sending another transaction with the same nonce but a higher gas price.

Currently the eviction mechanism is not tunable, but we plan on exposing options to change the behavior in the near future.

Note: currently, the number of queued transactions does not have an upper bound and you can continue adding new transactions until your process runs out of memory and crashes. We consider this a memory leak and a bug. Expect this unbounded behavior to change in a patch-level release in the future.

Note 2: if you use the persisted DB option: we have never stored unexecuted transactions to disk and do not plan to do so. The same is true of these queued transactions.

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-the-big-ones">back to list</a></sup></p>

### <a id="user-content-v7.0.0-alpha.0-weve-dropped-support-for-node-v8x"></a>We've dropped support for Node v8.x

Hopefully this won't affect anyone, as it's been unsupported by Node.js for over a year now.

We plan on dropping support for Node v10 within the next few months. Please [file an issue](https://github.com/trufflesuite/ganache/issues/new?milestone=7.0.0&title=I%20need%20Node.js%20v10) if you think you or your team will be unable to upgrade to Node v12 or later by mid October 2021.

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-the-big-ones">back to list</a></sup></p>

### <a id="user-content-v7.0.0-alpha.0-old-databases-from-previous-versions-are-not-compatible-with-v700"></a>Old databases from previous versions are not compatible with v7.0.0

Ganache's old database format is incompatible with this version. We've decided to hold off on building migration tools for this. If you will need a migration tool (you use the `db_path` flag and are unable to recreate your initial DB state) please [open an issue](https://github.com/trufflesuite/ganache/issues/new?milestone=7.0.0) to let us know.

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-the-big-ones">back to list</a></sup></p>
<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-breaking-changes">back to breaking</a></sup></p>

## <a id="user-content-v7.0.0-alpha.0-other-breaking-changes-but-you-probably-wont-notice-or-care"></a>Other breaking changes, but you probably won't notice or care

- `web3_clientVersion` now returns `Ganache/v{number/number/number}`
- `Runtime Error:` errors are now `Runtime error:`
- change `signer account is locked` error to `authentication needed: password or unlock`
- change `Exceeds block gas limit` error to `exceeds block gas limit`
- `server.listen` isn't pre-bound to the `server` instance (`server.listen.bind(server)`)
- `provider.send` isn't pre-bound to the `provider` instance (`provider.listen.bind(provider)`)
- remove `options.keepAliveTimeout`
- rename `provider.removeAllListeners` to `provider.clearListeners`
- `provider.close` is now `provider.disconnect` and returns a Promise (no callback argument)
- return `Cannot wrap a "[a-zA-Z]+" as a json-rpc type` on `evm_revert` error instead of `invalid type` or `false` for invalid snapshot ids
- change invalid string handling to error with `cannot convert string value ${value} into type Quantity; strings must be hex-encoded and prefixed with "0x".`
- change `Method {method} not supported` error to `The method {method} does not exist/is not available`
- return error `header not found` for requests to non-existent blocks
- replace mutable `provider.options` with `provider.getOptions()`; `getOptions` now returns a deep clone of the options object
- default `coinbase` (`eth_coinbase` RPC call) is now the `0x0` address (fixes #201)
- `sender doesn't have enough funds to send tx` errors are now prefixed with `VM Exception while processing transaction`
- `logs` subscription events are emitted before `newHeads` events

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-breaking-changes">back to breaking</a></sup></p>

## <a id="user-content-v7.0.0-alpha.0-technically-bug-fixes-but-these-might-break-your-tests"></a>Technically bug fixes, but these might break your tests:

- blocks are now filled based on actual transaction gas usage, not by the transactions stated `gas`/`gasLimit`
- the underlying state trie is now computed properly; hashes and stateRoots will differ (fixes #664)
- `chainId` option defaults to `1337` everywhere
- remove support for BN in provider RPC methods
- require transaction `data` to be valid json-rpc hex-encoded DATA (must start with `0x`)
- invalid transaction `v` values are no longer allowed
- previous versions sent utf-8 instead of binary over WebSockets when the request was binary encoded, the encoding is now echoed by default. There is new flag/option to revert behavior: `wsBinary`
- change error code when subscription requested over http from -32000 to -32004
- require transaction `value` string to be valid JSON-RPC encoded QUANTITY, e.g., "1000" is no longer valid!
- a `result` is no longer present when an `error` is returned (fixes #558)
- transaction ordering from multiple accounts is now ordered by `gasPrice`
- `options` now always treats strings that represent numbers as "0x" prefixed hex strings, not as numbers

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-breaking-changes">back to breaking</a></sup></p>

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-top">back to top</a></sup></p>

<a id="user-content-v7.0.0-alpha.0-fixes" href="#user-content-v7.0.0-alpha.0-fixes"></a>

---

# <p align="center"><a href="#user-content-v7.0.0-alpha.0-fixes"><img alt="Fixes" width="auto" src="https://raw.githubusercontent.com/trufflesuite/ganache/release-notes-assets/title-images/fixes.svg"></a></p>

- An actual block size is now returned in `eth_getBlock*` calls
- `eth_sign` returns correct signatures (fixes #556)
- The underlying state trie is now computed properly (fixes #664)

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-top">back to top</a></sup></p>

<a id="user-content-v7.0.0-alpha.0-new-features"></a>

---

# <p align="center"><a href="#user-content-v7.0.0-alpha.0-new-features"><img alt="New Features" width="auto" src="https://raw.githubusercontent.com/trufflesuite/ganache/release-notes-assets/title-images/new-features.svg"></a></p>

- Updated default `gasLimit` to 12M
  - note: we've never considered changing the default gasLimit as a semver breaking change, but welcome civil discourse if you disagree.
- Added more forking auth options and configuration. See `ganache --help` for details
- Added namespaces for options arguments. See `ganache --help` for the new option names. Note:
  - You can still use the "legacy" options.
  - Let us know if you love or hate the namespaced options.
- Added `provider.once(message: string) => Promise<unknown>`
- Add the option `miner.defaultTransactionGasLimit` which can be set to `"estimate"` to automatically use a gas estimate instead of the default when gas/gasLimit has been omitted from the transaction.
- `evm_mine` now accepts a new param: `options: {timestamp?: number, blocks: number?}`.
  - If `options.blocks` is given it mines that number of blocks before returning
- Added `miner.coinbase` option (closed #201).
- Added `evm_setAccountNonce` (closed #589).
- Added `getOptions()` to provider instance.
- Added `getInitialAccounts()` to provider instance.
- `evm_increaseTime` now takes either a number or a JSON-RPC hex-encoded QUANTITY value (closed #118).
- Added new flag, `wsBinary` (`true`, `false`, or "auto", defaults to "auto").
- Added support for non-executable pending transactions (skipped nonces).
- Added support for replacement transactions (closed #244 #484).

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-top">back to top</a></sup></p>

<a id="user-content-v7.0.0-alpha.0-known-issues"></a>

---

# <p align="center"><a href="#user-content-v7.0.0-alpha.0-known-issues"><img alt="Known Issues" width="auto" src="https://raw.githubusercontent.com/trufflesuite/ganache/release-notes-assets/title-images/known-issues.svg"></a></p>

- No Berlin/London support yet. We apologize for being behind on this one. This is our top priority and expect a follow up alpha release within 1 week to add in London and EIP-1559 transaction (type 2) support.
- Forking is so very slow.
- Forking's `chainId` shouldn't match the remote chain. We really should use a different `chainId` than the remote, but still be able to contextualize past transactions with their original `chainId`.
- WebSocket connections are sometimes closed prematurely.
- Our TypeScript types aren't properly exported.
- Our Docker container isn't published.
- We don't return a proper pending block.
- Uncles aren't fully supported when forking.
- Forking may fail in weird and unexpected ways. We need to "error better" here.

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-top">back to top</a></sup></p>

<a id="user-content-v7.0.0-alpha.0-future-plans"></a>

---

# <p align="center"><a href="#user-content-v7.0.0-alpha.0-future-plans"><img alt="Future Plans" width="auto" src="https://raw.githubusercontent.com/trufflesuite/ganache/release-notes-assets/title-images/future-plans.svg"></a></p>

- Support for enabling eligible draft EIPs before they are finalized or considered for inclusion in a hardfork.
- New hardfork support well in advance of the hardfork launch.
- Add an `eth_createAccessList` method.
- Add in VM events so tools like `solcoverage` will work.
- Track test performance metrics over time.
- Track real world Ganache usage (opt-in and anonymized) to better tune performance and drive bug fixes and feature development.
- Track test coverage.
- Document how to use Ganache in the browser, and what limits it has.
- `evm_mine` will return the new blocks instead of just `0x0`.
- We've laid the groundwork for additional performance improvements. We expect to see an additional 2-5x speed up for typical testing work loads in the near future.
- Add new `evm_setCode` and `evm_setStorageAt` RPC methods.
- Make `evm_snapshot` ids globally unique (unpredictable instead of a counter).
- Support `eth_getRawTransactionByHash` RPC method.
- Support `debug_accountAt` RPC method.
- Allow "mining" to be disabled on start up.
- Set CLI options via config file, package.json, or ENV vars.
- "Flavor" Plugins: We're building support for Layer 2 plugins into Ganache so we can start up and manage other chains. e.g., The `ganache filecoin` command will look for the `@ganache/filecoin` package and start up a Filecoin and IPFS server.
- Multi-chain configurations: you'll be able to start up your project's entire blockchain "ecosystem" from a single ganache command: e.g., `ganache --flavor ethereum --flavor filecoin --flavor optimism`.
  - this is where defining your CLI options via JSON config will come in very handy!
- Integrate with Infura: e.g., `ganache --fork mainnet` to fork mainnet via your own Infura account.
- Create a CLI interactive/RELP mode.
- Enable a CLI daemon mode.

[Open new issues](https://github.com/trufflesuite/ganache/issues/new?milestone=7.0.0) (or [join our team](https://consensys.net/open-roles/?discipline=32535/)) to influence what we implemented and prioritized.

<p align="right"><sup><a href="#user-content-v7.0.0-alpha.0-top">back to top</a></sup></p>

---

<sub>1. We don't evict excessive pending transactions, unreverted `evm_snapshot` references are only stored in memory, and we allow an unlimited number of wallet accounts to be created and stored in memory via `personal_newAccount`. 2. Truffle alum, [Nick Paterno](https://twitter.com/NJPaterno), built our ✨excellent✨ [gas estimation algorithm](https://github.com/trufflesuite/ganache/blob/88822501912ef14c88e4ff1957def79b4845223d/src/chains/ethereum/ethereum/src/helpers/gas-estimator.ts) which required no changes.
</sub>

---

<p align="center">
  💖 The Truffle Team
</p>
