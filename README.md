# Little Butterfly

This repository contains all of the archives related to [Little Butterfly](https://littlebutterfly.info), a small 
crypto-collectible game created for the ["Gaming like it's 1923"](https://itch.io/jam/gaming-like-its-1923) game jam.

The game is inspired by the song "Little Butterfly", by Irving Berlin.  It speaks of butterflies, flying from flower
to flower, leaving behind broken hearts, and eventually dying themselves.

The main contract implements [ERC721](http://erc721.org).

## Game lifecycle

Any account can join the game by calling the claim method on its main contract, Main.sol.  This method may only be
called once by any account -- an account cannot join the game twice.

When joining the game, the account receives information about a 'flower' -- an avatar -- and a token, representing
a butterfly.  There is a variety of types of flowers and butterflies, selected via a pseudo-random number generation.

Butterflies have only 24 hours after being received before they turn into ghosts.  Butterflies may only be
transferred to other accounts that joined the game, and they may no longer be transferred after they turned into ghosts.
Transferring the butterfly resets its 24 hour timer.

Butterfly visits are a one-time affair -- a butterfly may never be transferred again to an account that previously
owned it.

Butterflies, whether or not they are ghosts, are burnable -- they may be burned by their owner (or approved operator).

Whenever a butterfly is transferred, or burned, it leaves behind another token -- a heart.  Hearts are freely
transferable, without any restrictions -- and are also burnable.


## Implementation details

Tokens may represent butterflies (alive or ghosts), or hearts.  IDs are never reused.

The URI for a butterfly token is dependant upon its properties, allowing it to change image and status over time.

Information on the butterflies, and the images themselves, are hosted over IPFS -- though the webserver implementation
provided caches a local copy of all images and JSON files to ensure quick access.

The main smart contract, Main.sol, does not implement the ERC721 methods directly, but rather calls to an external
library responsible for maintaining all of the token ownership data.

The website provided only serves static files; all smart contract interaction is performed by the client, via web3.

The website *is* designed to be responsive web design (or an approximation thereof), and supports interacting with
the smart contracts via Fortmatic (fortmatic.com), allowing the game to be played on mobile phones or browsers without 
dapp-support.


## Project structure

This project is configured as a default truffle project, with solidity contracts and libraries under /contracts,
javascript tests under /test, and migration steps under /migrations.  A copy of the website is included under /web.

The project has dependencies on open-zeppelin contracts, which may be installed via npm (`npm install openzeppelin-solidity`).
We picked compiler with version 0.4.24 for compatibility.

After the dependencies are properly installed, it can be compiled with `truffle compile`, migrated with `truffle migrate`
(if the blockchain from truffle-config.js is available), and tested with `truffle test`.


## License

The source code on this repository is licensed under the MIT license.

Images and animations used on this project are not released under any license.

Original music "Little Butterfly" entered the public domain in 2019.
