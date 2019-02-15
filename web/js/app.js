const NetworkStatus = {
	NOT_LOADED: 1,
	WEB3_NOT_AVAILABLE: 2,
	USER_DENIED_ACCESS: 3,
	UNSUPPORTED_NETWORK: 4,
	INCORRECT_NETWORK_SELECTED: 5,
	OK: 6
};

const InitOptions = {
	AUTODETECT: 0,
	FIXED_MAINNET: 1,
	FIXED_ROPSTEN: 2,
	FIXED_RINKEBY: 3,
	FIXED_KOVAN: 4,
	SMS_MAINNET: 5,
	SMS_RINKEBY: 6
}

App = {
	web3Provider: null,
	contracts: {},
	total: {},
	butterflies: [],
	visitAccount: null,

	numCallTries: 20,
	sleepBetweenCalls: 10,
	maxSleepTime: 500,
	
	networkStatus: NetworkStatus.NOT_LOADED,
	userNetworkId: 3,
	actualNetworkId: 3,
	readOnlyNetwork: true,
	infuraEndpointString: {
		1: 'https://mainnet.infura.io/798c1e88399a4039a111e31b16db0de9',
		3: 'https://ropsten.infura.io/798c1e88399a4039a111e31b16db0de9',
		4: 'https://rinkeby.infura.io/798c1e88399a4039a111e31b16db0de9',
		42: 'https://kovan.infura.io/798c1e88399a4039a111e31b16db0de9'
	},
	fortmaticKeys: {
		1: 'pk_live_FB3CEFAE1CF6A95B',
		4: 'pk_test_517BA0F2BE040B0E'
	},

	animationFlower: null,
	animationButterfly: [],
	
	ipfsCache: {
		// flower JSON cache
		'https://ipfs.io/ipfs/QmTtPtJodMAZauMRFeReuK7qmakZXFREmvMqB7KZ6hBSn8': 'flowers/json/v1_flower_01.json',
		'https://ipfs.io/ipfs/QmdLhoQgDnyN3YyumraC4WsYpP77bdje82i4uWwev5x4Jb': 'flowers/json/v1_flower_02.json',
		'https://ipfs.io/ipfs/QmNgDxWEYaVFsGRvVqVagqVRRxrFfxrQ9JTQEMwLwwRwM9': 'flowers/json/v1_flower_03.json',
		'https://ipfs.io/ipfs/QmQxzEDHF7ZToXNw2GXR2SRiAh5GsjjnhQwKoigq2XTbq8': 'flowers/json/v1_flower_04.json',
		'https://ipfs.io/ipfs/QmeDFFBvREt3vQUSQCFZuaa4aPbfrL9y1ABViQWq3Qj5dR': 'flowers/json/v1_flower_05.json',

		'https://ipfs.io/ipfs/QmZsAy7NSvEmXDAqso3E2Y2wV7ZbfRAmVgSQjeUbKg9R4d': 'flowers/json/v1_flower_06.json',
		'https://ipfs.io/ipfs/QmQx217LZDtPkU1M1BmU5qhCVYTQ5QtiNGxC6eRAC4AguL': 'flowers/json/v1_flower_07.json',
		'https://ipfs.io/ipfs/QmSRbAEW6Qtwrdf21mriURVufAMuYUtTUayro5iiLboH17': 'flowers/json/v1_flower_08.json',
		'https://ipfs.io/ipfs/QmSMg2Dhnqs6nGo5W7RSKSovxXTT9EQ3esjAGDhQqjgxqG': 'flowers/json/v1_flower_09.json',
		'https://ipfs.io/ipfs/QmUgZyCn6iRMJMMAhXtrxBPZidQr21t8ZHxoX8TQttvAoT': 'flowers/json/v1_flower_10.json',

		'https://ipfs.io/ipfs/QmWezM8eRtqtSPKxvyrLEsnhCtgvcFn3xzED1LW6LNbeG5': 'flowers/json/v1_flower_11.json',
		'https://ipfs.io/ipfs/QmWGbZEw6y1d68VGYEeJdUbW8nQqVYiumWFuCSL3jWUUcm': 'flowers/json/v1_flower_12.json',
		'https://ipfs.io/ipfs/QmdyZf2UiWvzwfV9RTCGyAwwGBwteo9xYy5LmSSSzyhH6m': 'flowers/json/v1_flower_13.json',
		'https://ipfs.io/ipfs/QmWdkTgusJ1sDrMZ5AN8GZTZNpBmHZsiPfvvrZtbPwN2Vi': 'flowers/json/v1_flower_14.json',
		'https://ipfs.io/ipfs/QmVXiTZqcuvTPSCYL5czuCiZ3WZQr2wgXFWfJEvYZnxEd2': 'flowers/json/v1_flower_15.json',

		'https://ipfs.io/ipfs/QmQAXdSGdQQuRvmNegoKc1Eamg7rr5gxwmpZcpcL6Qzis8': 'flowers/json/v1_flower_white.json',


		// flower PNG cache
		'https://ipfs.io/ipfs/QmQ4cbf926a1Gpc47JNfpDHFWg7CHcv1Yr7cH6Vvq8QnRz': 'flowers/png/flower_01.png',
		'https://ipfs.io/ipfs/QmbkDDYoTcEGnqh5V5hGx1vwAhky6MpEpx89ZxjPWKSzXf': 'flowers/png/flower_02.png',
		'https://ipfs.io/ipfs/QmTgRVPTcS2zF3jzSUrcKnSrpeBy3mGuHJ31wDtXvrMn5C': 'flowers/png/flower_03.png',
		'https://ipfs.io/ipfs/QmTcwWLPmz146hAuG6cwixCqfKzoY18kdjYYFJx233aY71': 'flowers/png/flower_04.png',
		'https://ipfs.io/ipfs/QmeQL8iaL3AiN4qn4CRGyuUcAQR6mbNUVnWKknBPMbBxZw': 'flowers/png/flower_05.png',

		'https://ipfs.io/ipfs/Qmd4EKBfKYiCL4kkgwYqYtB6F99PTdEgTExh1AnW66eY4Y': 'flowers/png/flower_06.png',
		'https://ipfs.io/ipfs/QmYH19BTAZ1PtFrgWeZVSp1axuVPgBaoV7hiHQsnHbWkVe': 'flowers/png/flower_07.png',
		'https://ipfs.io/ipfs/QmcpLEwvWZdRwzJQomgsYG8gKcHctnMgEMQ1ZGpM77a4ou': 'flowers/png/flower_08.png',
		'https://ipfs.io/ipfs/QmYPfB8dMdBjeFQYutQrzN3W37S7ZbAq2jXsoRJbDBUfBf': 'flowers/png/flower_09.png',
		'https://ipfs.io/ipfs/QmPMStswb1hVA7k4MpRncLYmbeKoYdHjhwoMUNYBRctsz7': 'flowers/png/flower_10.png',

		'https://ipfs.io/ipfs/QmS4oZQGcqug6d2kDMobtQa1PUf9fZYzuRFPyBrqT1B5sa': 'flowers/png/flower_11.png',
		'https://ipfs.io/ipfs/QmaPu1nf1UJtVuHuxooDm29BkCcz6GSFRQ3d25BqVSfdBD': 'flowers/png/flower_12.png',
		'https://ipfs.io/ipfs/QmRN54TF5F2TNJegiuTWZDw4BEkphkBBTG33t4NaLqfzBN': 'flowers/png/flower_13.png',
		'https://ipfs.io/ipfs/QmQdwExUFpt82duE2BSkaCHMniiDjchN2GWPjBCntdBjuR': 'flowers/png/flower_14.png',
		'https://ipfs.io/ipfs/QmaHvATY1m1yfoJHw3bP4fH5k3Ai3HfqZkqU6ZPa7igPnJ': 'flowers/png/flower_15.png',

		'https://ipfs.io/ipfs/QmeWjxrcBxu6vpnfgL2vaeBu4moBtmn1CmwhfWqR9kbMWV': 'flowers/png/flower_white.png',


		// butterfly JSON cache
		'https://ipfs.io/ipfs/QmfTkEFHfz5he3GHgLromoSwp2fBGAbJGkSUCuuqxFGJur': 'butterflies/json/v1_butterfly_01.json',
		'https://ipfs.io/ipfs/QmeoeaEH1ihAgpEJZq6Z3bm75NFXaxyBWtVmUGv2x5A3Eq': 'butterflies/json/v1_butterfly_02.json',
		'https://ipfs.io/ipfs/QmUd41DJCY5VgQWuMihPE6GTuh1bw3QD77EyuxuZcYkZRD': 'butterflies/json/v1_butterfly_03.json',
		'https://ipfs.io/ipfs/QmXJWrdePrJwHnaEihsA5keYsfrvHwLJMHF7gdkEPGZsW7': 'butterflies/json/v1_butterfly_04.json',
		'https://ipfs.io/ipfs/QmWpJwvxqfucdffhN8rknRu6Mr2Ugo6zSexkibW8QYLgGj': 'butterflies/json/v1_butterfly_05.json',
		'https://ipfs.io/ipfs/QmdhkzxU92RVofsDRLSQSpEf1PWP7UbDUFHZCMV9hts2hm': 'butterflies/json/v1_butterfly_06.json',
		'https://ipfs.io/ipfs/QmZrLWjJmuj7o7v83BDWEqa98SNNNvtjErvN3XcXUN5S3r': 'butterflies/json/v1_butterfly_07.json',
		'https://ipfs.io/ipfs/Qmes4ym4nYWZZ4BqqHfNjcXQC2iJVRypwHLYgUczUnZG65': 'butterflies/json/v1_butterfly_08.json',
		'https://ipfs.io/ipfs/Qma5yJRXUPkbW2THMBVb1tiMWNzjoAkuvaJS7oCJfMfUmQ': 'butterflies/json/v1_butterfly_09.json',
		'https://ipfs.io/ipfs/QmTUNPne7yFa2rP75iUGQrmBtAGo5N4WgxaL91oJc94ire': 'butterflies/json/v1_butterfly_10.json',
		'https://ipfs.io/ipfs/QmcPUW8XZcGgoQXUah7e4p2V8g6n4Z3me3VBMuTrG5BztA': 'butterflies/json/v1_butterfly_11.json',
		'https://ipfs.io/ipfs/QmSeQKt4igREE91E2K9gKzfUsubxS17obd2dhazmyrhcgV': 'butterflies/json/v1_butterfly_12.json',
		'https://ipfs.io/ipfs/QmZ7HkNRmxfpUShNr6wzFDhJDjngtvzEDpUFQUBQQmrqjx': 'butterflies/json/v1_butterfly_13.json',
		'https://ipfs.io/ipfs/QmZ87QRgnGXMHEjKrAztzcyRytpK4oYXqm5cr4PrpaVwWF': 'butterflies/json/v1_butterfly_14.json',
		'https://ipfs.io/ipfs/QmeHMgmHNEc6eWytP3pxNxWpTmEEeEXr3gpkoVWZ99vVrA': 'butterflies/json/v1_butterfly_15.json',

		'https://ipfs.io/ipfs/QmUQBgp7Hx11tCx1xaSMxA349w7V4Mb6xWXZeBKbfg1HMS': 'butterflies/json/v1_butterfly_16.json',
		'https://ipfs.io/ipfs/QmRkD6ohZuNdmbBzPP7AwPyu9LwgK1St7PiktpuvKcR5Y9': 'butterflies/json/v1_butterfly_17.json',
		'https://ipfs.io/ipfs/QmeM9Kd3XDLz8f92KZ6LSthRR2FBQs2m5fnFshbQL6mXFd': 'butterflies/json/v1_butterfly_18.json',
		'https://ipfs.io/ipfs/QmUB5QnUxe5wgq49QCoLPA6wC3b4HPrmzkjTr4kL55tS4r': 'butterflies/json/v1_butterfly_19.json',
		'https://ipfs.io/ipfs/QmXeNfRXoDF14HrB4VwFrToxrpyUUU4b3Fti23yqwmt6hM': 'butterflies/json/v1_butterfly_20.json',
		'https://ipfs.io/ipfs/QmdpwFdjMYofFm8iQPwJV5xd18V25mFSL74qeTJfemwjxo': 'butterflies/json/v1_butterfly_21.json',
		'https://ipfs.io/ipfs/QmNnrNaKBfVSZXqcdAHjYXG4hvxtNw4sTwnazLzELivkgv': 'butterflies/json/v1_butterfly_22.json',
		'https://ipfs.io/ipfs/QmSP1xa5CV8gwAp4RPFHopC3XUwBebyMGZLZAKJAR3sAGo': 'butterflies/json/v1_butterfly_23.json',
		'https://ipfs.io/ipfs/QmQ4pTTt393N4i2TbgEQm8oSpVTxKpm5JPvUitupYacNHA': 'butterflies/json/v1_butterfly_24.json',
		'https://ipfs.io/ipfs/QmaGNV1mQR7kvXxh5KoWmQSxd5wGbDsvfdC6RaFwLgyr3P': 'butterflies/json/v1_butterfly_25.json',

		'https://ipfs.io/ipfs/QmbGDTTxobeQhVdywMHSEc7uxLKirVhU8FAt4TewA7z5ur': 'butterflies/json/v1_butterfly_26.json',
		'https://ipfs.io/ipfs/QmXQ2NEuCJELdweFUgrSa9hZmFA8p11bbN8tjEXotPyUCr': 'butterflies/json/v1_butterfly_27.json',
		'https://ipfs.io/ipfs/QmUMUWuxab6CY25hwqYtW3DsQhwMWW5sxDLD2ZzKGuHd7N': 'butterflies/json/v1_butterfly_28.json',

		'https://ipfs.io/ipfs/QmfS6qhZ9wX1BjDcpE3gPbxiTAVrQdssqdE68uhg6AdGde': 'butterflies/json/v1_butterfly_29.json',
		'https://ipfs.io/ipfs/QmdCfmxLH3CiVTYqwxuR9fuUhyEvvv3j5XJm4Pc6m28J5W': 'butterflies/json/v1_butterfly_30.json',


		// butterfly PNG cache
		'https://ipfs.io/ipfs/QmYY2PGLysZvuTSj7hayS5J7GhotsHfBBPaDahjfZKWGzr': 'butterflies/png/butterfly_01.png',
		'https://ipfs.io/ipfs/QmTK3agiGQGCB1knKhM8BzGVtBWcXiEAdje6CbFmyZEQsD': 'butterflies/png/butterfly_02.png',
		'https://ipfs.io/ipfs/QmUAvkcpBRfJTsNETJkTkdTSJKw9CboYSfZKyVbVH41iEG': 'butterflies/png/butterfly_03.png',
		'https://ipfs.io/ipfs/QmYaEnY8Gh2cMGXTHSqZGFyyn673GxjMKoTHeJB5twwW73': 'butterflies/png/butterfly_04.png',
		'https://ipfs.io/ipfs/QmUwe3TkRgp9vPviwrLSjHS2Y51KpHwEs5G3a9buSZ41z1': 'butterflies/png/butterfly_05.png',
		'https://ipfs.io/ipfs/Qma2234mCHBtGXLNKwtkNewE8Fm66ruFcHvfgiMEqdFWg3': 'butterflies/png/butterfly_06.png',
		'https://ipfs.io/ipfs/QmPFy5bPu956kchSm4uvwSiavvy9ZfgTAFyMbMxfNGRsb1': 'butterflies/png/butterfly_07.png',
		'https://ipfs.io/ipfs/QmY4TYu8nB1ckYvzii83fba8cZUZyunxhFJ1p5wJgod4ya': 'butterflies/png/butterfly_08.png',
		'https://ipfs.io/ipfs/QmTrPu5wvC9v7FMC18rEgMpfqZoPsPBq341Cbw4MiKFa3F': 'butterflies/png/butterfly_09.png',
		'https://ipfs.io/ipfs/QmRxd8jfz5beXZ8qkeTNcqhR8uHCShxMCKUHpgb7XBniZ2': 'butterflies/png/butterfly_10.png',
		'https://ipfs.io/ipfs/QmQRB1AASWAqn6xREYtBHTKucWyRYpzSh6RZRxdj29MXRJ': 'butterflies/png/butterfly_11.png',
		'https://ipfs.io/ipfs/QmcNCAj2jiqWmFHUF5cXojXkFaNDqKQT6XwqX1Dr9MZqCM': 'butterflies/png/butterfly_12.png',
		'https://ipfs.io/ipfs/QmWr36pN28YUbt5N9Dpm4xyA37bA7rQKrXt6wBYCu8SJVE': 'butterflies/png/butterfly_13.png',
		'https://ipfs.io/ipfs/QmPY5HJGh9tDNTHd8Jkcgz5bvMoL3aWNZBqXoHZPLS86Pi': 'butterflies/png/butterfly_14.png',
		'https://ipfs.io/ipfs/Qmeg7b6EArGTfrrmkMFEXLmHAqMdB2wBiYvFRytxFzh4hG': 'butterflies/png/butterfly_15.png',

		'https://ipfs.io/ipfs/QmcJgkTowkwR3Ncnzbov6vy8Zy9CWmaN9srzmjVG22x2dy': 'butterflies/png/butterfly_16.png',
		'https://ipfs.io/ipfs/QmP63pdCtM2PWB3Dna2tDJZLamyp5XPq7WcuM3ph3nrtS9': 'butterflies/png/butterfly_17.png',
		'https://ipfs.io/ipfs/QmfJZegAwcHZHcSq3eQrdcDChw3PGJtQ6dwpy2PX3kN7P6': 'butterflies/png/butterfly_18.png',
		'https://ipfs.io/ipfs/QmQEgN1SqqQYByxq5gCZdGANoDz2xsLpqpBYxKnfAhjjjV': 'butterflies/png/butterfly_19.png',
		'https://ipfs.io/ipfs/QmVKniQeFYEirvMhCy6tzqanXt6n19YGJQBZBgkZGex1kV': 'butterflies/png/butterfly_20.png',
		'https://ipfs.io/ipfs/QmVkMfa8SwxUifVQ28NsQJAMPPoM87aDcGU3B91GEcfrFz': 'butterflies/png/butterfly_21.png',
		'https://ipfs.io/ipfs/QmYW9cA1ridTLQ7u8KUogpgQFagnDAn12RrtBDUPyBWSse': 'butterflies/png/butterfly_22.png',
		'https://ipfs.io/ipfs/QmTMvgbw2irtQx8L9Vw32bTcPYwBcoDxzfuJSMVaMXKF4f': 'butterflies/png/butterfly_23.png',
		'https://ipfs.io/ipfs/QmXNWgAQn2AiKGez8YrG9kViNNeEb1ESd7nhiv3yZuW3ez': 'butterflies/png/butterfly_24.png',
		'https://ipfs.io/ipfs/QmbKaWBdYfjfvGDaL38MC85m4S6MpZzdNo3WS3Mf6hfD3r': 'butterflies/png/butterfly_25.png',

		'https://ipfs.io/ipfs/QmaKaghBKNXUUjpcA8FAUQwKZGyqSBcXrQpPUYmrqwos5r': 'butterflies/png/butterfly_26.png',
		'https://ipfs.io/ipfs/Qma7r8wHdfRQy1euxGUmkhpFsb9KHXeLquSG2rU94VETK1': 'butterflies/png/butterfly_27.png',
		'https://ipfs.io/ipfs/QmY2oRp7iugxgbbKNPLyinknEsxDW9GkkGfsUByabqKhc3': 'butterflies/png/butterfly_28.png',

		'https://ipfs.io/ipfs/QmTohmwXAf9BaoFhDHZGczBLr2kpGX5qofSWwRqdsvp5K6': 'butterflies/png/butterfly_29.png',
		'https://ipfs.io/ipfs/QmVc4EsfKXHxEjxuU2FXMkuFfKr1BZPZsqZzr5c7aCrD7i': 'butterflies/png/butterfly_30.png',


		// ghost JSON cache
		'https://ipfs.io/ipfs/QmcDnpwxGnQhLJiceRsEzbN3KR9MZLRrz7F8yKYU7qvQpH': 'ghosts/json/v1_ghost_01.json',
		'https://ipfs.io/ipfs/QmYnKh6r5EyvPNs22JikEJcEAu5cgoVU5jAFvRWFC1uM7r': 'ghosts/json/v1_ghost_02.json',
		'https://ipfs.io/ipfs/QmTZDYYF75SabP4JoLpBdaXcyDe4CznrZzTWX6B79bju8u': 'ghosts/json/v1_ghost_03.json',
		'https://ipfs.io/ipfs/QmNTC9dGyMvB1p5Y4x6KpKX2oBuQudGHvVYwhZwv6xuBV2': 'ghosts/json/v1_ghost_04.json',
		'https://ipfs.io/ipfs/QmfUoD9svtA4j9QvJuMMDhvU63bVscjtD1kCNfNxc9Au4y': 'ghosts/json/v1_ghost_05.json',
		'https://ipfs.io/ipfs/QmNPp8uQ2NYM5Ag6mvRpzJsbtf8kfWydpHvChRDEdw44SG': 'ghosts/json/v1_ghost_06.json',
		'https://ipfs.io/ipfs/QmdEyiaQ8bLcraw2bEpEeRLHGZPh9iCDYssbntgXyCoDwc': 'ghosts/json/v1_ghost_07.json',
		'https://ipfs.io/ipfs/QmRMRcYtQVou1PpMzhT66hVkmZdcKcrtYT1hRG3ndMrtQs': 'ghosts/json/v1_ghost_08.json',
		'https://ipfs.io/ipfs/QmSekW2umwiByGEV8WqX4XjSgigd6sMF81EyeDENRWSBZF': 'ghosts/json/v1_ghost_09.json',
		'https://ipfs.io/ipfs/QmRLL1ejcNdcS6LBQ3jzFS3TxnpomRuqHAwqWTDNGrN75P': 'ghosts/json/v1_ghost_10.json',
		'https://ipfs.io/ipfs/QmdNsTJTw922ivtp2bMaSokvzAkSQcDMocrR7DvfMQ4E6B': 'ghosts/json/v1_ghost_11.json',
		'https://ipfs.io/ipfs/QmYNVjx4jzdFZcJu1wLMakZYn5C15DAG2Li6qGeAZLbhFN': 'ghosts/json/v1_ghost_12.json',
		'https://ipfs.io/ipfs/QmTXmTnxoBATUFaqTS5ZgW4kiHBTNjVqmRimcyuB2YM3aD': 'ghosts/json/v1_ghost_13.json',
		'https://ipfs.io/ipfs/QmZSfRUYP9hy3xJv5AED8FtKAR4ZZJXh2vD9thMLKz6tZi': 'ghosts/json/v1_ghost_14.json',
		'https://ipfs.io/ipfs/Qmf2G9QC61U288UkpDQ1Mvnwa3UCtX1B9zwG6FPoLgVGGa': 'ghosts/json/v1_ghost_15.json',

		'https://ipfs.io/ipfs/Qmci3qzmRYWBsVM4UAfXqzzwMr3NMoDHH8L5MfnbXwo3eE': 'ghosts/json/v1_ghost_16.json',
		'https://ipfs.io/ipfs/QmS3D1ynCTzNCo5gAmWaEDdjGVZxHkZgavXVTkYGrDKXQ2': 'ghosts/json/v1_ghost_17.json',
		'https://ipfs.io/ipfs/QmXoT8ArH7YFc13LiToPduXbACioMBs9pbxB1Pt31WJxuJ': 'ghosts/json/v1_ghost_18.json',
		'https://ipfs.io/ipfs/QmakDsVgUEmNt3MszzVXbdmevBZkKSKsZqNmYzMbZkrnKc': 'ghosts/json/v1_ghost_19.json',
		'https://ipfs.io/ipfs/QmSPrgi17DV7BG9Zj4kZXHRCku8m8X7uSsEeKnD55TTbSa': 'ghosts/json/v1_ghost_20.json',
		'https://ipfs.io/ipfs/QmRiPHYdFs1ZsXgJ52sz2jFTw29QRzhTtBkZkawFoYjsuE': 'ghosts/json/v1_ghost_21.json',
		'https://ipfs.io/ipfs/QmRhMjL3xAQf5EAY2emnqwgL4fU6itZuz32mHXkkufWQnw': 'ghosts/json/v1_ghost_22.json',
		'https://ipfs.io/ipfs/QmcShvDeXBuy7mYeMRumM6VNZzAoZjbq8WKQHuWitvScYW': 'ghosts/json/v1_ghost_23.json',
		'https://ipfs.io/ipfs/QmbG3yrkXZNsZzurRdD6SvNVgbp6CY6iJNNaY89SQY2FNH': 'ghosts/json/v1_ghost_24.json',
		'https://ipfs.io/ipfs/QmVNErnN91EQCKqYgdwPPaKUPWSE5vFmM8P7cimnF4Gwa6': 'ghosts/json/v1_ghost_25.json',

		'https://ipfs.io/ipfs/QmcSrRFGnfZ9cdrYu9AFpqu6QWPNf3Sc2YdtWUzpGfcG7F': 'ghosts/json/v1_ghost_26.json',
		'https://ipfs.io/ipfs/QmbCYviy2JocfsrsTGiBwqJKdexMo2HyYBTLm6mMRwgMHC': 'ghosts/json/v1_ghost_27.json',
		'https://ipfs.io/ipfs/QmSC725w6CtNBr8KSB6QnQyzfgufTYQMk9UCWyjjKXkZcp': 'ghosts/json/v1_ghost_28.json',

		'https://ipfs.io/ipfs/QmbPHbppWMtzHA5GMV64tdAbmGBf5tKbXA3fbyopxi6C6x': 'ghosts/json/v1_ghost_29.json',
		'https://ipfs.io/ipfs/QmYicM6bmhNgffZW8xKfb7Rp4hFzhbTXM11mT7hAyd1fei': 'ghosts/json/v1_ghost_30.json',


		// ghost PNG cache
		'https://ipfs.io/ipfs/QmehkSG2sjbNPk5rHrwGPRQWnTg9eHApFbv1bsdDaFzzXe': 'ghosts/png/ghost_01.png',
		'https://ipfs.io/ipfs/Qma8W6siLuTGQhFS8toocaNEQmY9ZesfggCuTgnmTZsnYm': 'ghosts/png/ghost_02.png',
		'https://ipfs.io/ipfs/QmVWYQChBB36u2CVcCdW77cRvkmCRKLvpMr8tSPKpBXhgV': 'ghosts/png/ghost_03.png',
		'https://ipfs.io/ipfs/QmeUagn7mPJeqDJhotpNuPduFigddJPrM9o8SgKyM481fT': 'ghosts/png/ghost_04.png',
		'https://ipfs.io/ipfs/Qmci6115zJXe1mEpv1QSwZBqBhabV5BBMshfnDg2SadHXJ': 'ghosts/png/ghost_05.png',
		'https://ipfs.io/ipfs/QmX4uq9iRoo3Ax2NMkPR5CPqyQtmcgrYFx5hzKfWPsDw7p': 'ghosts/png/ghost_06.png',
		'https://ipfs.io/ipfs/QmaN3cng4G9NK7NN7vYgiWhnuFMgEjjSX5poh85WzDMPiY': 'ghosts/png/ghost_07.png',
		'https://ipfs.io/ipfs/QmTap3yZRYmdWqzk9sbvhL5doZmSs69YzdEz4sWm2gaFxA': 'ghosts/png/ghost_08.png',
		'https://ipfs.io/ipfs/QmQqxUhxf2uGRh7FoZVPYQhBamdaVkvPXzkgQJTiCdEfHK': 'ghosts/png/ghost_09.png',
		'https://ipfs.io/ipfs/QmXC4ykgMMVKemg1xyVbbWQDoZWYitkZQUZzd8SyWYg886': 'ghosts/png/ghost_10.png',
		'https://ipfs.io/ipfs/QmTRLghon6vEPNk2rXs19P4N7tFNUg1s4NMgJmV75qa7d7': 'ghosts/png/ghost_11.png',
		'https://ipfs.io/ipfs/Qmd4BxakLtZaKVAELhLTTA3iV1wnp8z2A3FS75LuNZW5RN': 'ghosts/png/ghost_12.png',
		'https://ipfs.io/ipfs/QmVWyawVyUzbXLcCpNdxW5vbNBzg54WWmsVB8Szow4JZ8B': 'ghosts/png/ghost_13.png',
		'https://ipfs.io/ipfs/QmYWVUhcVpiDMDqb9s7SpeUkAih8yzYc4a4LmkcBk2hm8f': 'ghosts/png/ghost_14.png',
		'https://ipfs.io/ipfs/QmcqRxaPQocKaEmcsciyHZw4PzXPmBxs96uEGscM67Ny48': 'ghosts/png/ghost_15.png',

		'https://ipfs.io/ipfs/QmTJ9GznGWBv2nLzpRLBwKUh4WHnP6eGQjp9pt5BbcEvPj': 'ghosts/png/ghost_16.png',
		'https://ipfs.io/ipfs/QmcojNJ5sCjM3FEWLvA9z66qNTYgoh82gT1hQgVuRQh9FT': 'ghosts/png/ghost_17.png',
		'https://ipfs.io/ipfs/QmX5z8NN6oxNrB6fZZx36r21ns4wvfTsQeBgCm3vqPvSZA': 'ghosts/png/ghost_18.png',
		'https://ipfs.io/ipfs/QmfEkjLQ92S5d3QKMAfPwP2dTHSyToawi4PEyTLriN5Az9': 'ghosts/png/ghost_19.png',
		'https://ipfs.io/ipfs/Qmep9fAXyQzUHPHfZe4u3QrHgmWHzqZnE1EJCHejp1gfYN': 'ghosts/png/ghost_20.png',
		'https://ipfs.io/ipfs/QmRvrVUSgKtRi3RadBVhiFqbRdXp137idmMXYr5H7ykeAg': 'ghosts/png/ghost_21.png',
		'https://ipfs.io/ipfs/QmSoaY8rkT2o1c7pSM8t9MKaXFr9GDZQpDqVrPB6Wx7NEX': 'ghosts/png/ghost_22.png',
		'https://ipfs.io/ipfs/QmYydfkm5W9BfVBwiZdTqm7iaSyr5NQSrbGcNw88E7XqMq': 'ghosts/png/ghost_23.png',
		'https://ipfs.io/ipfs/QmPzaE9aBvE9YMH5ikRx99P6g4Ny4dp4iKMfNKbG8xtiuG': 'ghosts/png/ghost_24.png',
		'https://ipfs.io/ipfs/Qmbr5VPir97ZJfkudBHHJLx9vmVepHee3exEAqcaAYJxht': 'ghosts/png/ghost_25.png',

		'https://ipfs.io/ipfs/QmSTdZ3Mufw1BM7WyuGeUTUsS1wtvNh7ETcnLJzpipAxhh': 'ghosts/png/ghost_26.png',
		'https://ipfs.io/ipfs/QmUK5YsMEPYRJQfWczhc1twwjC5b7bLncibsP1dNAzpQSm': 'ghosts/png/ghost_27.png',
		'https://ipfs.io/ipfs/QmYKpcprt7ZpWEdDBiVD78bM6po5C3aQTwfJMvRuDeGUjd': 'ghosts/png/ghost_28.png',

		'https://ipfs.io/ipfs/QmVCPM4JQEdHQSXefka5Gr6PYTctRz5y2jXERkG9KAbTDc': 'ghosts/png/v1_ghost_29.png',
		'https://ipfs.io/ipfs/QmVn3seYxMnK8s4UskYc3gpWh88D744wntGSNzUHEX8EVh': 'ghosts/png/v1_ghost_30.png',


		// heart JSON cache
		'https://ipfs.io/ipfs/Qmceo48QEXSMeyXqQzuCz7DzUdbLTdsECQaTotP1JssVWr': 'hearts/json/v1_heart_01.json',
		'https://ipfs.io/ipfs/QmPwKLnncqZdYDvc34qEpDg6NnvhHQXib3CNGXd4CXxYUk': 'hearts/json/v1_heart_02.json',
		'https://ipfs.io/ipfs/QmeyLvhVfhcv68aSBo5n1sovJfyX6G7GeJMVu9aEURxTgR': 'hearts/json/v1_heart_03.json',
		'https://ipfs.io/ipfs/QmcipMtf4BNqQcT59xRrnqe9UZoLX5XexYkJUiK3ajpnVn': 'hearts/json/v1_heart_04.json',
		'https://ipfs.io/ipfs/QmXCKQGWvwMSQZfN2DwbbNvihvpWpCMvDv7VSD2caTYcDM': 'hearts/json/v1_heart_05.json',
		'https://ipfs.io/ipfs/QmXPudNq5MrfVS3RAxCWccvJA4itBvNJ6YZVzyCi2cESfu': 'hearts/json/v1_heart_06.json',
		'https://ipfs.io/ipfs/QmPpZU9ShgYPfoM8Bhb2dRxLANK9rGRPtrsSxtcJVafwG8': 'hearts/json/v1_heart_07.json',
		'https://ipfs.io/ipfs/QmP9HTQsyEkoSm4TmS3Jjc6fGazFAqSrQVpvmZKyQE4rTk': 'hearts/json/v1_heart_08.json',
		'https://ipfs.io/ipfs/QmQdmwgDuNiYzdQ6XYsMapPEJvSwzRBtUMavjVzHqcec6k': 'hearts/json/v1_heart_09.json',
		'https://ipfs.io/ipfs/QmVN2RmSCbtKk78X6thyszKamZKe8Pd7BJMV8dzG13VRSV': 'hearts/json/v1_heart_10.json',
		'https://ipfs.io/ipfs/QmP3qJotmJiqxqbSEDjJqFfahrAr8DPADZ7Q1abqzhC5Ca': 'hearts/json/v1_heart_11.json',
		'https://ipfs.io/ipfs/QmXJoRxkgErFiCN42YhbuGeKcJ8UXZdYGvWxGe3ECqsAsZ': 'hearts/json/v1_heart_12.json',
		'https://ipfs.io/ipfs/QmUx8EB8k55YyYchEZ9phedDF6ttNJCqLoxwtQw2nwEAQK': 'hearts/json/v1_heart_13.json',
		'https://ipfs.io/ipfs/QmVbeHKnQNgjvEXpHKdMDJ1kNNxkyVKF5AQt4kgUC8R5j9': 'hearts/json/v1_heart_14.json',
		'https://ipfs.io/ipfs/QmRyBjmBi1EhNbaK6EhFgtyTApEPuMoDDMybhWdvyYtgYv': 'hearts/json/v1_heart_15.json',

		'https://ipfs.io/ipfs/QmUhonnonPrVwL5L1ePEfbxoiS9bwbfZNFCPuBaHDdiLYV': 'hearts/json/v1_heart_16.json',
		'https://ipfs.io/ipfs/QmUcJDejDNfGS25kxFBTWA8h2AD4wiWhDoc5wDGhDv5AVS': 'hearts/json/v1_heart_17.json',
		'https://ipfs.io/ipfs/QmYNfEDD3B2ndUHPi9HQnhGkEASawVZbzcQp6CCD163CUe': 'hearts/json/v1_heart_18.json',
		'https://ipfs.io/ipfs/Qmf8xtHuYZtcMs2P1Qj7JLt2XBjDqKdEX9uZR7RVUxHGsz': 'hearts/json/v1_heart_19.json',
		'https://ipfs.io/ipfs/QmW22tJD8woBzg6Pu4WSazfPv7NkFz4BGwVYsEQdhBatcg': 'hearts/json/v1_heart_20.json',
		'https://ipfs.io/ipfs/QmNMaf8vyUczCBnBTBeFrFDsgEKEEgYamuQxt78YgUFe1v': 'hearts/json/v1_heart_21.json',
		'https://ipfs.io/ipfs/QmQbh5Ebz3Y2nZrq2ZtQ6KcAnKeQKWxWZy1Nek4W83D9eP': 'hearts/json/v1_heart_22.json',
		'https://ipfs.io/ipfs/QmRYSCi2cjpcosNgNJtJkMxVVy84L3ZhsqDnYjkkmomtCn': 'hearts/json/v1_heart_23.json',
		'https://ipfs.io/ipfs/Qmcnsj9HSriNfqJQHsuYnL8u4u5BUCTE7x4rLifpWKS6ME': 'hearts/json/v1_heart_24.json',
		'https://ipfs.io/ipfs/QmSXy2SD69nsSPNfKJEK2dDiZrzoHFQU7BgJYS7oGpy2Fr': 'hearts/json/v1_heart_25.json',

		'https://ipfs.io/ipfs/QmfDBuC7VaXsCYHjom11MnuKKr4BJBoa6E7HSMbQfns4P5': 'hearts/json/v1_heart_26.json',
		'https://ipfs.io/ipfs/QmcNSfZYRkxWMfaa7L4jzHTqyAdqzDpx5s9hdncpM8JnnE': 'hearts/json/v1_heart_27.json',
		'https://ipfs.io/ipfs/QmRHkbgMLUogXrzvHv7b3FRnvTPaAeAy54oQBzZmPFjZ3F': 'hearts/json/v1_heart_28.json',

		'https://ipfs.io/ipfs/QmQ2QC1e6MRGNidJXcZ31h81fVCpXaYyVusC8ZHiQCH9N8': 'hearts/json/v1_heart_29.json',
		'https://ipfs.io/ipfs/QmNZ3XvaBFECPQaoX5kVk3FUa99tKF2DiY7G9eDrUK2yWH': 'hearts/json/v1_heart_30.json',


		// heart PNG cache
		'https://ipfs.io/ipfs/QmUaRZ4cdmRtnmQvBENr5t8tqniNy9Lbot3WganJujYm4h': 'hearts/png/heart_01.png',
		'https://ipfs.io/ipfs/QmWDnZU3EX7vyqTGUESp4PVb9w13fybFYj859NaoRmQz8N': 'hearts/png/heart_02.png',
		'https://ipfs.io/ipfs/Qmf9EQVeiTCYdkzSFtJEvNhSoRfqfbNc3Lu7d6Lg1a3tgW': 'hearts/png/heart_03.png',
		'https://ipfs.io/ipfs/QmQLNri6KzfvSR2fyJukHPYBDw61aRcjPPVwuXW6ydGw6v': 'hearts/png/heart_04.png',
		'https://ipfs.io/ipfs/QmPJ1R8uUx6rHj5tHhTEhKkm6zPbj6UpUu8isjsRWyXPBS': 'hearts/png/heart_05.png',
		'https://ipfs.io/ipfs/QmUvAvGLEfrWoeQaKTNc4WpNa6m3iXXd4VcJrtYQKbXjnu': 'hearts/png/heart_06.png',
		'https://ipfs.io/ipfs/QmYfXf55wwTpDxzLrTDuYY2sMJQi8EN3RgBGTZsjivK1mH': 'hearts/png/heart_07.png',
		'https://ipfs.io/ipfs/QmbPqH2j1NghNKVAHtgSR9KtJEN45mo72S3wpk2JjgNNe6': 'hearts/png/heart_08.png',
		'https://ipfs.io/ipfs/QmbxzRrb3pRRLfDewqCyHc24NdjmfyntGKayaHQ1oGZ6AQ': 'hearts/png/heart_09.png',
		'https://ipfs.io/ipfs/QmTZhFdT7qyernQJjt1hPa8GorE746oURpb5pdAa5pa5Dx': 'hearts/png/heart_10.png',
		'https://ipfs.io/ipfs/QmPLCzctVBh8QNwnCJWorTmVVLXRUw3pY9tm3kBDZE9qDd': 'hearts/png/heart_11.png',
		'https://ipfs.io/ipfs/QmTVyeE4sojXiZ57WXgSmkG14YYq4FwnNKxUM4CVRE8QMh': 'hearts/png/heart_12.png',
		'https://ipfs.io/ipfs/QmZbEHiiynPZF56EfsT6ZM7mvrd8P5w9GqN62uLhS3UTjM': 'hearts/png/heart_13.png',
		'https://ipfs.io/ipfs/QmRy6XxJevaKPZcBQuLiHQ6MhEEg7XEoQcbYyASMwYCq9F': 'hearts/png/heart_14.png',
		'https://ipfs.io/ipfs/QmNLn9FJSySbLqaCtJZRQMktpiLELMMvWVrqcdJz4Hc9Eg': 'hearts/png/heart_15.png',

		'https://ipfs.io/ipfs/QmWoSAf1aSVUUhFqcnZ1GpKLwSrvwSsaMGK5fFuEraWWgm': 'hearts/png/heart_16.png',
		'https://ipfs.io/ipfs/QmdszbPbpUqeyLPr6fuuJdcBehKUQLNfDuopcCygJa1wMG': 'hearts/png/heart_17.png',
		'https://ipfs.io/ipfs/Qma4zx1qwbiHsHq22A7VHex6R6Pq9bBwdQm4frB8AYgVzv': 'hearts/png/heart_18.png',
		'https://ipfs.io/ipfs/QmYZveG3XWznQMuCqHEDr1TShLAMEmv7cfpJbnqF6Ddcc9': 'hearts/png/heart_19.png',
		'https://ipfs.io/ipfs/QmRPX2gXSkRXgYBGyhWEUKnGFobfFmSCgFw5H2iJb7nZmv': 'hearts/png/heart_20.png',
		'https://ipfs.io/ipfs/QmXMT7G28TZ6dSFvs7n85WE2pmnJbpm5iwFJB7YSguXVu7': 'hearts/png/heart_21.png',
		'https://ipfs.io/ipfs/QmXXzzS5EGDzmY5D9W8hWk8wjaJNitnyp1JeztZLyx2oJ9': 'hearts/png/heart_22.png',
		'https://ipfs.io/ipfs/QmTpQN8ixApr7FoZxPshg8RvRJFRkLWSBgbsqaUhf65EFL': 'hearts/png/heart_23.png',
		'https://ipfs.io/ipfs/QmeHkxyQnLXmUxky3P6EunKUseAkrV7MwAx6RasD47ZQzn': 'hearts/png/heart_24.png',
		'https://ipfs.io/ipfs/QmYMnXPN453m33NnpkbjQw9MJ5nztsEKBd91RsAHkW8o6i': 'hearts/png/heart_25.png',

		'https://ipfs.io/ipfs/QmT1oz6zxqAnfRCFsvN6Db7TDUxkWKMQSBYyg6SEwc8szt': 'hearts/png/heart_26.png',
		'https://ipfs.io/ipfs/QmQ79T6Bd11Qzh8bKL7wgN3zQk8yqtfS1FAFj2NXJ9sfWU': 'hearts/png/heart_27.png',
		'https://ipfs.io/ipfs/QmSU7Div4fjzUWBDKEGy6h72v1MAKyYgJ6Em7JmRmeB68k': 'hearts/png/heart_28.png',

		'https://ipfs.io/ipfs/QmaG5udCiRY2S15KJ17y5Akqw7Jou3mG3excpUqWRhESG1': 'hearts/png/heart_29.png',
		'https://ipfs.io/ipfs/QmUeJevLSbdbX9RZeHJ8UWST9nPQxyCs4m8118K5QtRr6d': 'hearts/png/heart_30.png',
	},

	getIPFS: function(uri) {
		return 'ipfs/' + App.ipfsCache[uri];
	},

	getLastInitOption: function() {
		if (typeof(Storage) !== 'undefined') {
			const storageValue = sessionStorage.getItem('lastInitOption');
			if (storageValue == null) return InitOptions.AUTODETECT;
			return parseInt(storageValue);
		}
		return App.sessionLastInitOption;
	},
	
	setLastInitOption: function(optionId) {
		if (typeof(Storage) !== 'undefined') {
			sessionStorage.setItem('lastInitOption', optionId);
		} else {
			App.sessionLastInitOption = optionId;
		}
	},
	
	init: async function(optionId) {
		const lastInitOption = App.getLastInitOption();
		if (lastInitOption == InitOptions.SMS_MAINNET || lastInitOption === InitOptions.SMS_RINKEBY) {
			if (optionId != InitOptions.AUTODETECT && optionId != lastInitOption) {
				if (App.fortmatic != null && typeof App.fortmatic !== 'undefined') {
					App.fortmatic.user.logout();
					App.fortmatic = null;
				}
			} else if (optionId == InitOptions.AUTODETECT) {
				optionId = lastInitOption;
			}
		}
		
		App.setLastInitOption(optionId);
		
		switch (optionId) {
			case InitOptions.AUTODETECT: {
				await App.initAutodetectNetwork(3);
				break;
			}
			case InitOptions.FIXED_MAINNET: {
				await App.initFixedNetwork(1);
				$('.target-network').text(networkIdToName(1));
				break;
			}
			case InitOptions.FIXED_ROPSTEN: {
				await App.initFixedNetwork(3);
				$('.target-network').text(networkIdToName(3));
				break;
			}
			case InitOptions.FIXED_RINKEBY: {
				await App.initFixedNetwork(4);
				$('.target-network').text(networkIdToName(4));
				break;
			}
			case InitOptions.FIXED_KOVAN: {
				await App.initFixedNetwork(42);
				$('.target-network').text(networkIdToName(42));
				break;
			}
			case InitOptions.SMS_MAINNET: {
				await App.initFortmaticNetwork(1);
				$('.target-network').text(networkIdToName(1));
				break;
			}
			case InitOptions.SMS_RINKEBY: {
				await App.initFortmaticNetwork(4);
				$('.target-network').text(networkIdToName(4));
				break;
			}
			default: {
				console.error('Unsupported init option: ' + optionId);
				return;
			}
		}

		App.updateJoinText();
		return await App.initContract();
	},	
	
	initInfuraNetworkId: function(networkId) {
		App.readOnlyNetwork = true;
		App.actualNetworkId = networkId;
		App.web3Provider = new Web3.providers.HttpProvider(App.infuraEndpointString[networkId]);
		web3 = new Web3(App.web3Provider);
	},
	
	initAutodetectNetwork: async function(defaultNetworkId) {
		// modern dapp browsers
		if (window.ethereum) {
			App.web3Provider = window.ethereum;
			
			try {
				// request account access
				await window.ethereum.enable();
				
				web3 = new Web3(App.web3Provider);
				App.userNetworkId = parseInt(web3.version.network);
				if (isSupported(App.userNetworkId)) {
					App.networkStatus = NetworkStatus.OK;
					App.actualNetworkId = App.userNetworkId;
				} else {
					App.networkStatus = NetworkStatus.UNSUPPORTED_NETWORK;
				}
				
			} catch (error) {
				// user denied account access
				console.error(error);
				App.networkStatus = NetworkStatus.USER_DENIED_ACCESS;
			}
		}

		// legacy dapp browsers
		else if (window.web3) {
			if (App.readOnlyNetwork) {
				App.web3Provider = null;
			} else {
				App.web3Provider = window.web3.currentProvider;
				
				web3 = new Web3(App.web3Provider);
				App.userNetworkId = parseInt(web3.version.network);
				if (isSupported(App.userNetworkId)) {
					App.networkStatus = NetworkStatus.OK;
					App.actualNetworkId = App.userNetworkId;
				} else {
					App.networkStatus = NetworkStatus.UNSUPPORTED_NETWORK;
				}
			}
		}

		if (App.web3Provider == null) {
			// web3 not supported
			App.networkStatus = NetworkStatus.WEB3_NOT_AVAILABLE;
			App.userNetworkId = 0;
		}
		
		if (App.networkStatus != NetworkStatus.OK) {
			App.initInfuraNetworkId(defaultNetworkId);
		} else {
			App.readOnlyNetwork = false;
		}
		
		App.readProvider = App.web3Provider;
		App.readWeb3 = web3;
	},
	
	initFixedNetwork: async function(fixedNetworkId) {
		// modern dapp browsers
		if (window.ethereum) {
			App.web3Provider = window.ethereum;
			
			try {
				// request account access
				await window.ethereum.enable();
				
				web3 = new Web3(App.web3Provider);
				App.userNetworkId = parseInt(web3.version.network);
				if (App.userNetworkId == fixedNetworkId) {
					App.networkStatus = NetworkStatus.OK;
					App.actualNetworkId = App.userNetworkId;
				} else {
					App.networkStatus = NetworkStatus.INCORRECT_NETWORK_SELECTED;
				}
				
			} catch (error) {
				// user denied account access
				console.error(error);
				App.networkStatus = NetworkStatus.USER_DENIED_ACCESS;
			}
		}

		// legacy dapp browsers
		else if (window.web3) {
			if (App.readOnlyNetwork) {
				App.web3Provider = null;
			} else {		
				App.web3Provider = window.web3.currentProvider;
				
				web3 = new Web3(App.web3Provider);
				App.userNetworkId = parseInt(web3.version.network);
				if (App.userNetworkId == fixedNetworkId) {
					App.networkStatus = NetworkStatus.OK;
					App.actualNetworkId = App.userNetworkId;
				} else {
					App.networkStatus = NetworkStatus.INCORRECT_NETWORK_SELECTED;
				}
			}
		}

		if (App.web3Provider == null) {
			// web3 not supported
			App.networkStatus = NetworkStatus.WEB3_NOT_AVAILABLE;
			App.userNetworkId = 0;
		}
		
		if (App.networkStatus != NetworkStatus.OK) {
			App.initInfuraNetworkId(fixedNetworkId);
		} else {
			App.readOnlyNetwork = false;
		}
		
		App.readProvider = App.web3Provider;
		App.readWeb3 = web3;
	},

	initFortmaticNetwork: async function(fortmaticNetworkId) {
		const key = App.fortmaticKeys[fortmaticNetworkId];
		if (typeof key === 'undefined') throw 'Unsupported network for fortmatic: ' + fortmaticNetworkId;
		
		App.fortmatic = new Fortmatic(key);
		App.web3Provider = App.fortmatic.getProvider();
		web3 = new Web3(App.web3Provider);
		
		// ensure user is logged in
		App.visitAccount = await web3.eth.getAccounts();
				
		// use infura provider for read methods for speed
		App.readProvider = new Web3.providers.HttpProvider(App.infuraEndpointString[fortmaticNetworkId]);
		
		App.userNetworkId = fortmaticNetworkId;
		App.actualNetworkId = App.userNetworkId;
		App.networkStatus = NetworkStatus.OK;
		App.readOnlyNetwork = false;
	},
	
	updateJoinText: function() {
		// update join message based on status
		$('.join-message').hide();
		switch (App.networkStatus) {
			case (NetworkStatus.WEB3_NOT_AVAILABLE):  {
				$('.join-no-web3').show();
				break;
			}
			case (NetworkStatus.USER_DENIED_ACCESS): {
				$('.join-no-access').show();
				break;
			}
			case (NetworkStatus.UNSUPPORTED_NETWORK): {
				$('.current-network').text(networkIdToName(App.userNetworkId));
				$('.join-unsupported-network').show();
				break;
			}
			case (NetworkStatus.INCORRECT_NETWORK_SELECTED): {
				$('.current-network').text(networkIdToName(App.userNetworkId));
				$('.join-incorrect-network').show();
				break;
			}
			case (NetworkStatus.OK): {
				$('.current-network').text(networkIdToName(App.userNetworkId));
				$('.join-supported-network').show();
				break;
			}
			default: {
				console.error('Unknown network status: ' + App.networkStatus);
			}
		}
	},
	
	clearGarden: function() {
		App.visitAccount = null;
		
		// clear former animation, if any
		$('#img-flower').empty();
		if (App.animationFlower != null) {
			App.animationFlower.destroy();
			App.animationFlower = null;
		}
		
		$('#img-butterfly').empty();
		if (App.animationButterfly.length > 0) {
			for (let i = 0; i < App.animationButterfly.length; i++) {
				const anim = App.animationButterfly[i];
				anim.destroy();
			}
			App.animationButterfly = [];
		}
		
		$('.gardenTitle').text('my garden');
		
		$('#flowerIndex').text('garden #');
		$('.livingFlower').text('#');
		$('.hostedButterflies').text('#');
		$('.hostedButterfliesLabel').text("hosted butterflies");
		$('.collectedHearts').text('#');
		$('.collectedHeartsLabel').text("collected hearts");
		
		$('#img-chest').hide(); 
	},
	
	returnHome: async function() {
		App.visitAccount = await App.getCurrentAccount();
		if (App.visitAccount == null || typeof App.visitAccount === 'undefined') {
			await App.init(App.getLastInitOption());
			return;
		}
		
		App.getFlowerInfo(App.visitAccount).then((flowerInfo) => {
			if(flowerInfo && flowerInfo.length === 5 && flowerInfo[0]) {
				App.checkin(App.visitAccount, flowerInfo);
			}
			else {
				window.location.href = "#openJoin";
			}
		});
	},

	initContract: async function() {
		let contractLocation = '';
		
		switch (App.actualNetworkId) {
			case 1: { 
				contractLocation = 'contracts/mainnet.json';
				$('.network-indicator-mainnet').show();
				$('.network-indicator-ropsten').hide();
				$('.network-indicator-rinkeby').hide();
				$('.network-indicator-kovan').hide();
				$('.top-left.collapse')					
					.removeClass('network-indicator-transform-ropsten')
					.removeClass('network-indicator-transform-rinkeby')
					.removeClass('network-indicator-transform-kovan')
					.removeClass('network-indicator-transform-unknown')
					.addClass('network-indicator-transform-mainnet');
				break;
			}
			case 3: { 
				contractLocation = 'contracts/ropsten.json';
				$('.network-indicator-mainnet').hide();
				$('.network-indicator-ropsten').show();
				$('.network-indicator-rinkeby').hide();
				$('.network-indicator-kovan').hide();
				$('.top-left.collapse')					
					.removeClass('network-indicator-transform-mainnet')
					.removeClass('network-indicator-transform-rinkeby')
					.removeClass('network-indicator-transform-kovan')
					.removeClass('network-indicator-transform-unknown')
					.addClass('network-indicator-transform-ropsten');
				break;
			}
			case 4: { 
				contractLocation = 'contracts/rinkeby.json'; 
				$('.network-indicator-mainnet').hide();
				$('.network-indicator-ropsten').hide();
				$('.network-indicator-rinkeby').show();
				$('.network-indicator-kovan').hide();
				$('.top-left.collapse')					
					.removeClass('network-indicator-transform-mainnet')
					.removeClass('network-indicator-transform-ropsten')
					.removeClass('network-indicator-transform-kovan')
					.removeClass('network-indicator-transform-unknown')
					.addClass('network-indicator-transform-rinkeby');
				break;
			}
			case 42: { 
				contractLocation = 'contracts/kovan.json'; 
				$('.network-indicator-mainnet').hide();
				$('.network-indicator-ropsten').hide();
				$('.network-indicator-rinkeby').hide();
				$('.network-indicator-kovan').show();
				$('.top-left.collapse')					
					.removeClass('network-indicator-transform-mainnet')
					.removeClass('network-indicator-transform-ropsten')
					.removeClass('network-indicator-transform-rinkeby')
					.removeClass('network-indicator-transform-unknown')
					.addClass('network-indicator-transform-kovan');
				break;
			}
			default: {
				console.error('Unknown network ID: ' + App.actualNetworkId);
				$('.network-indicator-mainnet').hide();
				$('.network-indicator-ropsten').hide();
				$('.network-indicator-rinkeby').hide();
				$('.network-indicator-kovan').hide();
				$('.top-left.collapse')
					.removeClass('network-indicator-transform-mainnet')
					.removeClass('network-indicator-transform-ropsten')
					.removeClass('network-indicator-transform-rinkeby')
					.removeClass('network-indicator-transform-kovan')
					.addClass('network-indicator-transform-unknown');
				return;
			};
		}
		
		const lastInitOption = App.getLastInitOption();
		if (lastInitOption == InitOptions.SMS_MAINNET || lastInitOption === InitOptions.SMS_RINKEBY) {
			
			$.getJSON(contractLocation, function(data) {
				App.contracts.readMain = TruffleContract(data);
				App.contracts.readMain.setProvider(App.readProvider);
				
				App.contracts.readMain.deployed().then(async (instance) => {
					App.readInstance = instance;
					App.transferEvent(data);
					
					const contract = web3.eth.contract(data.abi);
					App.instance = contract.at(data.networks[App.actualNetworkId].address);
					
					const currentAccount = await App.getCurrentAccount();
					if (currentAccount) {
						App.visitAccount = currentAccount;
						App.getFlowerInfo(App.visitAccount).then((flowerInfo) => {
							if(flowerInfo && flowerInfo.length === 5 && flowerInfo[0]) {
								App.checkin(App.visitAccount, flowerInfo);
							}
							else {
								App.clearGarden();
								window.location.href = "#openJoin";
							}
						});
					} else {
						App.clearGarden();
						window.location.href = "#openJoin";
					}
					App.totals();
				});
			});
			
			return;
		}
			
		$.getJSON(contractLocation, function(data) {
			App.contracts.Main = TruffleContract(data);
			App.contracts.Main.setProvider(App.web3Provider);

			App.contracts.Main.deployed().then((instance) => {
				App.instance = instance;
				App.readInstance = instance;

			}).then(async () => {
				App.transferEvent(data);

				const currentAccount = await App.getCurrentAccount();
				if (currentAccount) {
					App.visitAccount = currentAccount;
					App.getFlowerInfo(App.visitAccount).then((flowerInfo) => {
						if(flowerInfo && flowerInfo.length === 5 && flowerInfo[0]) {
							App.checkin(App.visitAccount, flowerInfo);
						}
						else {
							App.clearGarden();
							window.location.href = "#openJoin";
						}
					});
				} else {
					App.clearGarden();
					window.location.href = "#openJoin";
				}
				App.totals();
			}).catch(function (error) {
				console.error(error);
			});
		});
	},

	visit: async function(token) {
		App.ownerOf(token).then((account) => {
			App.getFlowerInfo(account).then((flowerInfo) => {
				if(flowerInfo && flowerInfo.length === 5 && flowerInfo[0])
					App.checkin(account, flowerInfo);
			});
		})
	},

	checkin: async function(account, flowerInfo) {
		$('#img-chest').show(); 
		
		const now = new Date().getTime();
		const date = (parseInt(flowerInfo[3], 10)) * 1000;
		const lived = Math.round((now - date) / 1000);

		if (account === await App.getCurrentAccount()) {
			$('.gardenTitle').text('my garden');
		} else {
			$('.gardenTitle').text('visiting garden');
		}

		$('.livingFlower').text(describeSecondsShort(lived));

		$('#img-butterfly').empty();
		if (App.animationButterfly.length > 0) {
			for (let i = 0; i < App.animationButterfly.length; i++) {
				const anim = App.animationButterfly[i];
				anim.destroy();
			}
			App.animationButterfly = [];
		}
		
		App.totalButterflyOwned(account).then((totalButterflyOwned) => {
			let tag = (parseInt(flowerInfo[4], 10) + 1).toString();
			if (tag.length === 1) tag = '00'+tag;
			if (tag.length === 2) tag = '0'+tag;
			$('#flowerIndex').text('garden #' + tag);
			$('.hostedButterflies').text(totalButterflyOwned);
			$('.hostedButterfliesLabel').text((totalButterflyOwned === 1) ? "hosted butterfly" : "hosted butterflies");
			return totalButterflyOwned;
		}).then((total) => {
			for (let i = 0; i < total; i++) {
				App.getButterflyOwned(account,i).then((index) => {
					App.getButterflyInfo(index).then((info) => {
						const now = new Date().getTime();
						const date = (parseInt(info[2], 10)) * 1000;
						const remainingTime = (now - date) / 3600000;
						let _size, _top, _left;

						$('#img-butterfly').append('<div id="flyingButter'+index+'" class="butterfly"></div>');
						const flyingButterIndex = $('#flyingButter'+index);

						_size = Math.floor(Math.random()*40)+80;
						_top = Math.floor(Math.random()*80)+10;
						_left = Math.floor(Math.random()*60)+20;

						flyingButterIndex.css('width', _size);
						flyingButterIndex.css('top', _top + '%');
						flyingButterIndex.css('left', _left + '%');

						if (remainingTime < 24) {
							App.getButterflyURIFromGene(info[0], true).then((uri) => {
								$.getJSON(App.getIPFS(uri), (json) => {
									const id = json.attributes[2].value;
									const anim_path = 'animation/butterflies/'+id+'/butterfly_'+pad(id)+'.json';

									const anim = lottie.loadAnimation({
										container: document.getElementById('flyingButter'+index),
										renderer: 'svg',
										loop: true,
										autoplay: true,
										path: anim_path
									});
									anim.setSpeed((Math.random() * 0.3) + 0.85);
									App.animationButterfly.push(anim);
								})
							});
						}

					})
				})
			}
		});

		App.totalHeartOwned(account).then((totalHeartOwned) => {
			$('.collectedHearts').text(totalHeartOwned);
			$('.collectedHeartsLabel').text((totalHeartOwned === 1) ? "collected heart" : "collected hearts");
		});

		// clear former animation, if any
		$('#img-flower').empty();
		if (App.animationFlower != null) {
			App.animationFlower.destroy();
			App.animationFlower = null;
		}
		
		App.getFlowerURI(account).then((uri) => {
			$.getJSON(App.getIPFS(uri), (json) => {
				const id = json.attributes[0].value;
				const anim_path = 'animation/flowers/'+id+'/flower_'+pad(id)+'.json';

				App.animationFlower = lottie.loadAnimation({
					container: document.getElementById('img-flower'),
					renderer: 'svg',
					loop: true,
					autoplay: true,
					path: anim_path
				});
			})
		});
	},

	totals: function() {
		App.totalFlowers().then((flowerInfo) => {
			$('.connectedFlowers').text(flowerInfo);
		});

		App.totalButterflies().then((flowerInfo) => {
			$('.totalButterflies').text(flowerInfo);
		});

		App.totalHearts().then((flowerInfo) => {
			$('.droppedHearts').text(flowerInfo);
		});
	},

	bindEvents: function() {		
		$('.returnHome').click(App.returnHome);
	
		$('#img-chest').click(App.openChest);
		$(document).on('click', '#openButterfly .close', App.openChest);
		$(document).on('click', '#openHeart .close', App.openChest);

		$('#btnButterflies').click(App.openButterflies);
		$(document).on('click', '.openButterflies', App.openButterflies);

		$('#btnFlowers').click(App.openFlowers);
		$(document).on('click', '.openFlowers', App.openFlowers);

		$('#btnHearts').click(App.openHearts);
		$(document).on('click', '.openHearts', App.openHearts);

		$(document).on('click', '.seeButterfly', App.seeButterfly);

		$(document).on('click', '.seeTransfer', App.seeTransfer);
		$(document).on('click', '.openTransfer', App.seeTransfer);

		$(document).on('click', '.seeHeart', App.seeHeart);

		$(document).on('click', '.seeHeartTransfer', App.seeHeartTransfer);
		$(document).on('click', '.openTransferHeart', App.seeHeartTransfer);

		$(document).on('click', '.flowerVisit', function() {
			const account = $(this).attr('data-account');
			killTimeouts();
			window.location.href = "#close";

			App.visitAccount = account;
			App.getFlowerInfo(account).then((flowerInfo) => {
				App.checkin(account, flowerInfo)
			})
		});

		$(document).on('click', '.sendTo', function() {
			const account = $(this).attr('data-account');
			const token = $(this).attr('data-token');

			killTimeouts();

			App.sendTo(account, token).then((response) => {
				console.log(response)
			})
		});

		$(document).on('click', '.burn', function() {
			const token = $(this).attr('data-token');
			killTimeouts();

			App.burn(token).then((response) => {
				console.log(response)
			})
		});

		$(document).on('click', '.visit', function() {
			const butterfly = $(this).attr('data-butterfly');
			killTimeouts();

			App.visit(butterfly);
		});

		$(document).on('click', 'a[href="#close"]', function() {
			// killTimeouts()
		});
	},

	openChest: function() {
		if (App.visitAccount == null) return;
		App.getFlowerInfo(App.visitAccount).then((flowerInfo) => {
			App.getFlowerURI(App.visitAccount).then((uri) => {
				$.getJSON(App.getIPFS(uri), (json) => {
					$('#panelFlowerImg').attr('src', App.getIPFS(json.image))
				})
			});

			let tag = (parseInt(flowerInfo[4],10) + 1).toString();

			if(tag.length === 1) tag = '00' + tag;
			if(tag.length === 2) tag = '0' + tag;
			$('#flowerTag').text('#' + tag);

			const now = new Date().getTime();
			const date = (parseInt(flowerInfo[3], 10)) * 1000;
			const hours = (now - date) / 3600000;
			const days = Math.floor((hours) / 24);
			const time = secondsToTime( ((now - date)/1000) - (days*3600*24) );

			if (days < 1) $('#flowerDay').text('time:');
			else if (days === 1) $('#flowerDay').text('time: ' + days + ' day');
			else if (days > 1) $('#flowerDay').text('time: ' + days + ' days');

			countdown(time, '#flowerTime', false);
		});

		App.totalButterflyOwned(App.visitAccount).then((totalButterflyOwned) => {
			$('#totalButterflyOwned').text('butterflies: ' + pad(totalButterflyOwned, true));

			$('#panelButterflies').empty();
			let rows = {};
			let promises = [];
			const updateRows = () => {
				$('#panelButterflies').empty();
				for (let i = 0; i < totalButterflyOwned; i++) {
					const img = rows[i];
					if (typeof img !== 'undefined') img.appendTo('#panelButterflies');
				}
			};

			for (let i = 0; i < totalButterflyOwned; i++) {
				promises.push((async (i) => {
					App.getButterflyOwned(App.visitAccount,i).then((butterfly) => {
						App.getTokenURI(butterfly).then((uri) => {
							$.getJSON(App.getIPFS(uri), (json) => {
								rows[i] = $('<img class="seeButterfly" data-options="true" data-butterfly="'+butterfly+'" src="'+App.getIPFS(json.image)+'" width="80px" alt="Butterfly">');
								updateRows();
							})
						})
					})
				})(i));
			}
		});

		App.totalHeartOwned(App.visitAccount).then((totalHeartOwned) => {
			$('#totalHeartOwned').text('hearts: ' + pad(totalHeartOwned, true));

			$('#panelHearts').empty();
			let rows = {};
			let promises = [];
			const updateRows = () => {
				$('#panelHearts').empty();
				for (let i = 0; i < totalHeartOwned; i++) {
					const img = rows[i];
					if (typeof img !== 'undefined') img.appendTo('#panelHearts');
				}
			};

			for (let i = 0; i < totalHeartOwned; i++) {
				promises.push((async (i) => {
					App.getHeartsOwned(App.visitAccount,i).then((heart) => {
						App.getTokenURI(heart).then((uri) => {
							$.getJSON(App.getIPFS(uri), (json) => {
								rows[i] = $('<img class="seeHeart" data-options="true" data-heart="'+heart+'" src="'+App.getIPFS(json.image)+'" width="60px" alt="Heart">');
								updateRows();
							})
						})
					})
				})(i));
			}
		});
	},

	openButterflies: function() {
		const page = $(this).attr('data-page') ? $(this).attr('data-page'): 1;

		App.totalButterflies().then((totalButterflies) => {
			const total = parseInt(totalButterflies,10);
			const from = (page * 10) - 10;
			let to = (page * 10) - 1;
			if (to > total) to = total;

			App.makePagination(total, page, '#butterfliesPagination', 'openButterflies');

			$('#butterflies_table>tbody').empty();
			if (to !== 0) $('<tr>').append($('<td>').append('Loading...')).appendTo('#butterflies_table');

			let rows = {};
			let promises = [];
			const updateRows = () => {
				$('#butterflies_table>tbody').empty();
				for (let i = from; i < to; i++) {
					const tr = rows[i];
					if (typeof tr !== 'undefined') tr.appendTo('#butterflies_table');
				}
			};

			for (let i = from; i < to; i++) {
				promises.push((async (i) => {
					let butterfly;
					for (let x = 0; x < App.numCallTries; x++) {
						butterfly = await App.getButterfly(i);
						if (i === 0 || butterfly != 0) break;
						console.log("retry #" + x); await sleep(x);
					}
					if (!(i === 0 || butterfly != 0)) return Promise.resolve();

					let info = ["0", "0"];
					for (let x = 0; x < App.numCallTries; x++) {
						info = await App.getButterflyInfo(butterfly);
						if (info[1] != "0") break;
						console.log("retry #" + x); await sleep(x);
					}

					let uri;
					for (let x = 0; x < App.numCallTries; x++) {
						uri = await App.getTokenURI(butterfly);
						if (typeof uri !== "undefined") break;
						console.log("retry #" + x); await sleep(x);
					}
					if (typeof uri === 'undefined') return Promise.resolve();

					return $.getJSON(App.getIPFS(uri), (json) => {
						let visited, flightTimeString, survivalTimeString;
						const now = new Date().getTime();
						const creationDate = (parseInt(info[1], 10)) * 1000;
						const arrivalDate = (parseInt(info[2], 10)) * 1000;

						let flightTimeSeconds = Math.round((now - creationDate) / 1000);
						let survivalTimeSeconds = 86400 - Math.round((now - arrivalDate) / 1000);

						if(survivalTimeSeconds < 0) {
							flightTimeSeconds = Math.round((arrivalDate - creationDate) / 1000) + 86400;
							survivalTimeSeconds = 0;
						}

						if (info[3] == 1) {
							visited = '1 flower';
						} else {
							visited = info[3] + ' flowers';
						}

						flightTimeString = describeSeconds(flightTimeSeconds);
						if (survivalTimeSeconds === 0) {
							survivalTimeString = 'expired';
						} else {
							survivalTimeString = describeSeconds(survivalTimeSeconds);
						}

						rows[i] = $('<tr>').append(
							$('<td>').append('<img src='+App.getIPFS(json.image)+' width="30px">'),
							$('<td>').text(json.attributes[0].value),
							$('<td class="column-optional">').text(visited),
							$('<td class="column-optional">').text(flightTimeString),
							$('<td>').text(survivalTimeString),
							$('<td>').append('<a data-butterfly="'+butterfly+'" class="seeButterfly">see travel</a>'),
						);
						updateRows();
					});
				})(i));
			}
		});
	},

	openFlowers: function() {
		const page = $(this).attr('data-page') ? $(this).attr('data-page'): 1;

		App.totalFlowers().then(function(totalFlowers) {
			const total = parseInt(totalFlowers,10);
			const from = (page * 10) - 10;
			let to = (page * 10) - 1;
			if (to > total) to = total;

			App.makePagination(total, page, '#flowersPagination', 'openFlowers');

			$('#flowers_table>tbody').empty();
			if (to !== 0) $('<tr>').append($('<td>').append('Loading...')).appendTo('#flowers_table');

			let rows = {};
			let promises = [];
			const updateRows = () => {
				$('#flowers_table>tbody').empty();
				for (let i = from; i < to; i++) {
					const tr = rows[i];
					if (typeof tr !== 'undefined') tr.appendTo('#flowers_table');
				}
			};

			for (let i = from; i < to; i++) {
				promises.push((async (i) => {
					let account = ["0x"];
					for (let x = 0; x < App.numCallTries; x++) {
						account = await App.getFlower(i);
						if (account[0] != "0x") break;
						console.log("retry #" + x); await sleep(x);
					}
					if (account[0] == "0x") return Promise.resolve();

					let info;
					for (let x = 0; x < App.numCallTries; x++) {
						info = await App.getFlowerInfo(account);
						if (typeof info !== 'undefined' && info[3] != 0) break;
						console.log("retry #" + x); await sleep(x);
					}

					let uri;
					for (let x = 0; x < App.numCallTries; x++) {
						uri = await App.getFlowerURI(account);
						if (typeof uri !== 'undefined') break;
						console.log("retry #" + x); await sleep(x);
					}
					if (typeof uri === 'undefined') return Promise.resolve();

					let totalButterflies;
					for (let x = 0; x < App.numCallTries; x++) {
						totalButterflies = await App.totalButterflyOwned(account);
						if (typeof totalButterflies != 'undefined') break;
						console.log("retry #" + x); await sleep(x);
					}

					return $.getJSON(App.getIPFS(uri), (json) => {
						const now = new Date().getTime();
						const date = (parseInt(info[3], 10)) * 1000;
						const lived = Math.round((now - date) / 1000);

						let lovedBy;
						if (totalButterflies === 0) lovedBy = 'none';
						else if (totalButterflies === 1) lovedBy = totalButterflies + ' butterfly';
						else lovedBy = totalButterflies + ' butterflies';

						rows[i] = $('<tr>').append(
							$('<td>').append('<img src='+App.getIPFS(json.image)+' width="20px">'),
							$('<td>').text((parseInt(info[4], 10) + 1).toString()),
							$('<td class="column-optional">').text(describeSeconds(lived)),
							$('<td>').text(lovedBy),
							$('<td>').append('<a class="flowerVisit" data-account="'+account+'">visit</a>'),
						);
						updateRows();
					})
				})(i));
			}
		});
	},

	openHearts: function() {
		const page = $(this).attr('data-page') ? $(this).attr('data-page'): 1;

		App.totalHearts().then((totalHearts) => {
			const total = parseInt(totalHearts,10);
			const from = (page * 10) - 10;
			let to = (page * 10) - 1;
			if (to > total) to = total;

			App.makePagination(total, page, '#heartsPagination', 'openHearts');

			$('#hearts_table>tbody').empty();
			if (to !== 0) $('<tr>').append($('<td>').append('Loading...')).appendTo('#hearts_table');

			let rows = {};
			let promises = [];
			const updateRows = () => {
				$('#hearts_table>tbody').empty();
				for (let i = from; i < to; i++) {
					const tr = rows[i];
					if (typeof tr !== 'undefined') tr.appendTo('#hearts_table');
				}
			};

			for (let i = from; i < to; i++) {
				promises.push((async (i) => {
					let heart = 0;
					for (let x = 0; x < App.numCallTries; x++) {
						heart = await App.getHeart(i);
						if (heart != 0) break;
						console.log("retry #" + x); await sleep(x);
					}
					if (heart == 0) return Promise.resolve();

					let info = ["0", "0"];
					for (let x = 0; x < App.numCallTries; x++) {
						info = await App.getHeartInfo(heart);
						if (info[1] != "0") break;
						console.log("retry #" + x); await sleep(x);
					}

					let uri;
					for (let x = 0; x < App.numCallTries; x++) {
						uri = await App.getTokenURI(heart);
						if (typeof uri !== "undefined") break;
						console.log("retry #" + x); await sleep(x);
					}
					if (typeof uri === 'undefined') return Promise.resolve();

					return $.getJSON(App.getIPFS(uri), (json) => {
						const date = new Date(parseInt(info[2], 10)) * 1000;
						rows[i] = $('<tr>').append(
							$('<td>').append('<img src='+App.getIPFS(json.image)+' width="30px">'),
							$('<td class="column-optional">').text(info[0]),
							$('<td>').text(new Date(date).toLocaleDateString("en-US")),
							$('<td>').html(info[3] + ' <span class="column-optional">memories</span>'),
							$('<td>').append('<a data-heart="'+heart+'" class="seeHeart">see travel</a>'),
						);
						updateRows();
					})
				})(i));
			}
		});
	},

	seeButterfly: async function() {
		const butterfly = $(this).attr('data-butterfly');
		const options = $(this).attr('data-options');

		$('#close').click();
		killTimeouts();
		window.location.href = "#openButterfly";

		$('#butterflyVisit').empty();
		$('#butterflyTag').text(butterfly);
		$('#butterflyID').text('butterflies: ' + butterfly);
		
		let canEdit;
		if (options) {
			canEdit = await App.canEditToken(butterfly);
		} else {
			canEdit = false;
		}
		
		if (canEdit) {
			$('#butterflyVisit').append(
				$('<a data-butterfly="'+butterfly+'" class="visit" href="#close" style="color:aqua;margin:5px">visit </a>'),
				$('<a data-butterfly="'+butterfly+'" class="seeTransfer" style="color:blue;margin:5px">transfer </a>'),
				$('<a data-token="'+butterfly+'" class="burn" style="color:purple;margin:5px">burn </a>'),
			);
			$('#openButterfly .close').attr('href', '#openChest');
		}
		else {
			$('#openButterfly .close').attr('href', '#openButterflies');
			$('#butterflyVisit').append($('<a data-butterfly="'+butterfly+'" class="visit" href="#close" style="color:blue">visit</a>'));
		}

		App.getButterflyInfo(butterfly).then((butterflyInfo) => {
			const now = new Date().getTime();

			const creationDate = (parseInt(butterflyInfo[1], 10)) * 1000;
			const arrivalDate = (parseInt(butterflyInfo[2], 10)) * 1000;

			let flightTimeSeconds = Math.round((now - creationDate) / 1000);
			let survivalTimeSeconds = 86400 - Math.round((now - arrivalDate) / 1000);

			if (survivalTimeSeconds < 0) {
				flightTimeSeconds = Math.round((arrivalDate - creationDate) / 1000) + 86400;
				survivalTimeSeconds = 0;
			}

			App.getButterflyURIFromGene(butterflyInfo[0], survivalTimeSeconds > 0).then((uri) => {
				$.getJSON(App.getIPFS(uri), (json) => {
					$('#panelButterflyImg').attr('src', App.getIPFS(json.image));
					$('#butterflyTag').text(json.name);
					$('#butterflyID').text(json.name);
					$('#butterflyType').text('type: ' + json.attributes[0].value);
				});

				if (survivalTimeSeconds > 0) {
					$('#butterflyFlight').text('flight time:');
					$('#butterflyDay').text('');
					countdown(secondsToTime(flightTimeSeconds), '#butterflyTime', false);
					countdown(secondsToTime(survivalTimeSeconds), '#timeLeft', true);
				}
				else {
					$('#butterflyFlight').text('expired');
					$('#butterflyDay').text('life time:');
					$('#butterflyTime').text(describeTime(secondsToTime(flightTimeSeconds)));
					$('#timeLeft').text('expired');
				}

				const numFlowers = butterflyInfo[3];
				if (numFlowers == 1) $('#butterflyVisited').text('played with: 1 flower');
				if (numFlowers > 1) $('#butterflyVisited').text('played with: '+numFlowers+' flowers');

				$('#panelFlowersFromButterflies').empty();
				let rows = {};
				let promises = [];
				const updateRows = () => {
					$('#panelFlowersFromButterflies').empty();
					for (let i = 0; i < numFlowers; i++) {
						const img = rows[i];
						if (typeof img !== 'undefined') img.appendTo('#panelFlowersFromButterflies');
					}
				};

				for (let i = 0; i < numFlowers; i++){
					promises.push((async (i) => {
						App.getButterflyOwnerByIndex(butterfly, i).then((account) => {
							App.getFlowerURI(account).then((uri) => {
								$.getJSON(App.getIPFS(uri), (json) => {
									if (account == 0 || account == "0x") {
										rows[i] = $('<img src="' + App.getIPFS(json.image) + '" width="50px" alt="Flower">');
									} else {
										rows[i] = $('<img class="flowerVisit" data-account="' + account + '" src="' + App.getIPFS(json.image) + '" width="50px" alt="Flower">');
									}
									updateRows();
								})
							});
						});
					})(i));
				}
			})
		})
	},

	seeTransfer: function() {
		const butterfly = $(this).attr('data-butterfly');
		const page = $(this).attr('data-page') ? $(this).attr('data-page'): 1;

		$('#close').click();
		killTimeouts();
		window.location.href = "#openTransfer";

		App.totalFlowers().then(function(totalFlowers) {
			const total = parseInt(totalFlowers,10);
			const from = (page * 10) - 10;
			let to = (page * 10) - 1;
			if (to > total) to = total;

			App.makePagination(total, page, '#transferPagination', 'openTransfer', 10, butterfly)

			$('#transfer_table>tbody').empty();
			if (to !== 0) $('<tr>').append($('<td>').append('Loading...')).appendTo('#transfer_table');

			let rows = {};
			let promises = [];
			const updateRows = () => {
				$('#transfer_table>tbody').empty();
				for (let i = from; i < to; i++) {
					const tr = rows[i];
					if (typeof tr !== 'undefined') tr.appendTo('#transfer_table');
				}
			};

			for (let i = from; i < to; i++) {
				promises.push((async (i) => {
					let account = ["0x"];
					for (let x = 0; x < App.numCallTries; x++) {
						account = await App.getFlower(i);
						if (account[0] != "0x") break;
						console.log("retry #" + x); await sleep(x);
					}
					if (account[0] == "0x") return Promise.resolve();

					let info;
					for (let x = 0; x < App.numCallTries; x++) {
						info = await App.getFlowerInfo(account);
						if (typeof info !== 'undefined' && info[3] != 0) break;
						console.log("retry #" + x); await sleep(x);
					}

					let uri;
					for (let x = 0; x < App.numCallTries; x++) {
						uri = await App.getFlowerURI(account);
						if (typeof uri !== 'undefined') break;
						console.log("retry #" + x); await sleep(x);
					}
					if (typeof uri === 'undefined') return Promise.resolve();

					return $.getJSON(App.getIPFS(uri), (json) => {
						const now = new Date().getTime();
						const date = (parseInt(info[3], 10)) * 1000;
						const lived = Math.round((now - date) / 1000);

						let link;
						App.canReceiveButterfly(butterfly, account).then((result) => {
							if (result) link = '<a class="sendTo" href="#close" data-account="'+account+'" data-token="'+butterfly+'">send to</a>';
							else link = '<span></span>';

							App.totalButterflyOwned(account).then((totalButterflies) => {
								let lovedBy;

								if (totalButterflies === 0) lovedBy = 'no butterflies';
								else if (totalButterflies === 1) lovedBy = totalButterflies + ' butterfly';
								else if (totalButterflies > 1) lovedBy = totalButterflies + ' butterflies';

								rows[i] = $('<tr>').append(
									$('<td>').append('<img src='+App.getIPFS(json.image)+' width="20px">'),
									$('<td>').text((parseInt(info[4], 10) + 1).toString()),
									$('<td class="column-optional">').text(describeSeconds(lived)),
									$('<td>').text(lovedBy),
									$('<td>').append(link),
								);
								updateRows();
							})
						})
					});

				})(i));
			}
		});
	},

	seeHeart: async function() {
		const heart = $(this).attr('data-heart');
		const options = $(this).attr('data-options');

		$('#close').click();
		killTimeouts();
		window.location.href = "#openHeart";

		$('#heartVisit').empty();
		$('#heartTag').text(heart);
		$('#heartID').text('butterflies: ' + heart);
		
		let canEdit;
		if (options) {
			canEdit = await App.canEditToken(heart);
		} else {
			canEdit = false;
		}
		
		if (canEdit) {
			$('#heartVisit').append(
				$('<a data-heart="'+heart+'" class="visit" href="#close" style="color:aqua;margin:5px">visit </a>'),
				$('<a data-heart="'+heart+'" class="seeHeartTransfer" style="color:blue;margin:5px">transfer </a>'),
				$('<a data-token="'+heart+'" class="burn" style="color:purple;margin:5px">burn </a>'),
			);
			$('#openHeart .close').attr('href', '#openChest')
		}
		else {
			$('#openHeart .close').attr('href', '#openHearts');
			$('#heartVisit').append($('<a data-heart="'+heart+'" class="visit" href="#close" style="color:blue">visit</a>'));
		}

		App.getHeartInfo(heart).then((heartInfo) => {
			App.getTokenURI(heart).then((uri) => {
				$.getJSON(App.getIPFS(uri), (json) => {
					$('#heartTag').text(json.name);
					$('#heartID').text(json.description);
					$('#heartType').text('type: ' + json.attributes[0].value);
					$('#panelHeartImg').attr('src', App.getIPFS(json.image));

					const now = new Date().getTime();
					const date = (parseInt(heartInfo[2], 10)) * 1000; // + parseInt(res[2], 10)
					const hours = (now - date) / 3600000;
					const days = Math.floor((hours) / 24);
					const flight = ((now - date) / 1000) - (days * 3600*24);
					const flightTime = secondsToTime(flight);

					countdown(flightTime, '#heartTime', false);

					if (days < 1) $('#heartDay').text('time: ');
					else if (days === 1) $('#heartDay').text('time: ' + days + ' day');
					else if (days > 1) $('#heartDay').text('time: ' + days + ' days');

					$('#heartTime').text(pad(flightTime.h) + ':' + pad(flightTime.m) + ':' + pad(flightTime.s));

					const numFlowers = heartInfo[3];
					if (numFlowers == 1) $('#heartVisited').text('played with: 1 flower');
					if (numFlowers > 1) $('#heartVisited').text('played with: '+numFlowers+' flowers');

					$('#panelFlowersFromHearts').empty();
					let rows = {};
					let promises = [];
					const updateRows = () => {
						$('#panelFlowersFromHearts').empty();
						for (let i = 0; i < numFlowers; i++) {
							const img = rows[i];
							if (typeof img !== 'undefined') img.appendTo('#panelFlowersFromHearts');
						}
					};

					for (let i = 0; i < numFlowers; i++){
						promises.push((async (i) => {
							App.getHeartOwnerByIndex(heart, i).then((account) => {
								App.getFlowerURI(account).then((uri) => {
									$.getJSON(App.getIPFS(uri), (json) => {
										if (account == 0 || account == "0x") {
											rows[i] = $('<img src="'+App.getIPFS(json.image)+'" width="50px" alt="Flower">');
										} else {
											rows[i] = $('<img class="flowerVisit" data-account="'+account+'" src="'+App.getIPFS(json.image)+'" width="50px" alt="Flower">');
										}
										updateRows();
									})
								});
							})
						})(i));
					}
				})
			})
		})
	},

	seeHeartTransfer: function() {
		const heart = $(this).attr('data-heart');
		const page = $(this).attr('data-page') ? $(this).attr('data-page'): 1;

		$('#close').click();
		killTimeouts();
		window.location.href = "#openTransferHeart";

		App.totalFlowers().then(async function(totalFlowers) {
			const total = parseInt(totalFlowers,10);
			const from = (page * 10) - 10;
			let to = (page * 10) - 1;
			if (to > total) to = total;

			App.makePagination(total, page, '#transferHeartPagination', 'openTransferHeart', 10, heart)

			$('#transferHeart_table>tbody').empty();
			if (to !== 0) $('<tr>').append($('<td>').append('Loading...')).appendTo('#transferHeart_table');

			let rows = {};
			let promises = [];
			const updateRows = () => {
				$('#transferHeart_table>tbody').empty();
				for (let i = from; i < to; i++) {
					const tr = rows[i];
					if (typeof tr !== 'undefined') tr.appendTo('#transferHeart_table');
				}
			};

			const currentAccount = await App.getCurrentAccount();
			for (let i = from; i < to; i++) {
				promises.push((async (i) => {
					let account = ["0x"];
					for (let x = 0; x < App.numCallTries; x++) {
						account = await App.getFlower(i);
						if (account[0] != "0x") break;
						console.log("retry #" + x); await sleep(x);
					}
					if (account[0] == "0x") return Promise.resolve();

					let info;
					for (let x = 0; x < App.numCallTries; x++) {
						info = await App.getFlowerInfo(account);
						if (typeof info !== 'undefined' && info[3] != 0) break;
						console.log("retry #" + x); await sleep(x);
					}

					let uri;
					for (let x = 0; x < App.numCallTries; x++) {
						uri = await App.getFlowerURI(account);
						if (typeof uri !== 'undefined') break;
						console.log("retry #" + x); await sleep(x);
					}
					if (typeof uri === 'undefined') return Promise.resolve();

					return $.getJSON(App.getIPFS(uri), (json) => {
						const now = new Date().getTime();
						const date = (parseInt(info[3], 10)) * 1000;
						const lived = Math.round((now - date) / 1000);

						let link;
						if (account.toLowerCase() != currentAccount.toLowerCase()) link = '<a class="sendTo" href="#close" data-account="'+account+'" data-token="'+heart+'">send to</a>';

						App.totalButterflyOwned(account).then((totalButterflies) => {
							let lovedBy;

							if (totalButterflies === 0) lovedBy = 'no butterflies';
							else if (totalButterflies === 1) lovedBy = totalButterflies + ' butterfly';
							else if (totalButterflies > 1) lovedBy = totalButterflies + ' butterflies';

							rows[i] = $('<tr>').append(
								$('<td>').append('<img src='+App.getIPFS(json.image)+' width="20px">'),
								$('<td>').text((parseInt(info[4], 10) + 1).toString()),
								$('<td class="column-optional">').text(describeSeconds(lived)),
								$('<td>').text(lovedBy),
								$('<td>').append(link),
							);
							updateRows();
						})
					});
				})(i));
			}
		});
	},

	makePagination: function(total, page, ref, href, perPage = 10, token = 'null') {
		$(ref).empty();

		total = parseInt(total,10);
		page = parseInt(page,10);

		const division = total / perPage;

		if (page) {
			if (page > 1) $(ref).append('<a href="#'+href+'" data-page="'+(page-1)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">previous</a>');

			if ((page-4) > 0 && page === Math.ceil(division))
				$(ref).append('<a href="#'+href+'" data-page="'+(page-4)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+(page-4)+'</a>');
			if (((page-3) > 0) && (page === (Math.ceil(division)-1) || page === (Math.ceil(division))))
				$(ref).append('<a href="#'+href+'" data-page="'+(page-3)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+(page-3)+'</a>');

			if ((page-2) > 0) $(ref).append('<a href="#'+href+'" data-page="'+(page-2)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+(page-2)+'</a>');
			if ((page-1) > 0) $(ref).append('<a href="#'+href+'" data-page="'+(page-1)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+(page-1)+'</a>');

			$(ref).append('<a href="#'+href+'" data-page="'+page+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+page+'</a>');

			if ((page+1) <= Math.ceil(division)) $(ref).append('<a href="#'+href+'" data-page="'+(page+1)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+(page+1)+'</a>');
			if ((page+2) <= Math.ceil(division)) $(ref).append('<a href="#'+href+'" data-page="'+(page+2)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+(page+2)+'</a>');

			if (page <= 2 && Math.ceil(division) >= 4)
				$(ref).append('<a href="#'+href+'" data-page="'+(page+3)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+(page+3)+'</a>');
			if (page === 1 && Math.ceil(division) >= 5)
				$(ref).append('<a href="#'+href+'" data-page="'+(page+4)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">'+(page+4)+'</a>');

			if ((page+1) <= Math.ceil(division)) $(ref).append('<a href="#'+href+'" data-page="'+(page+1)+'" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">more</a>')
		}

		if(!page) {
			if (division > 1) {
				$(ref).append('<a href="#'+href+'" data-page="1" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">1</a>');
				$(ref).append('<a href="#'+href+'" data-page="2" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">2</a>');
				if (division > 2) $(ref).append('<a href="#'+href+'" data-page="3" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">3</a>');
				if (division > 3) $(ref).append('<a href="#'+href+'" data-page="4" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">4</a>');
				if (division > 4) $(ref).append('<a href="#'+href+'" data-page="5" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">5</a>');
				if (division > 5) $(ref).append('<a href="#'+href+'" data-page="2" class="'+href+'" data-butterfly="'+token+'" data-heart="'+token+'">more</a>');
			}
		}
	},

	getCurrentAccount: async function() {
		return new Promise((resolve, reject) => {
			web3.eth.getAccounts(function(error, accounts) {
				if (error) reject(error);
				resolve(accounts[0]);
			});
		});
	},
	
	canEditToken: async function(token) {
		if (App.readOnlyNetwork) return false;
		
		const currentAccount = await App.getCurrentAccount();
		const tokenOwner = await App.ownerOf(token);
		
		return currentAccount.toLowerCase() === tokenOwner.toLowerCase();
	},
	
	getFlowerInfo: async function(account) {
		return await App.readInstance.getFlowerInfo(account);
	},

	claim: async function() {
		const d = new Date();
		const t = d.getTimezoneOffset() * 60;

		const lastInitOption = App.getLastInitOption();
		if (lastInitOption == InitOptions.SMS_MAINNET || lastInitOption === InitOptions.SMS_RINKEBY) {
			const currentAccount = await App.getCurrentAccount();
			return new Promise((resolve, reject) => {
				App.instance.claim.sendTransaction(t, {from: currentAccount}, function(error, txHash) {
					if (error) reject(error);
					resolve();
				});
			});
		}
		
		return App.instance.claim(t);
	},

	totalFlowers: async function() {
		return parseInt((await App.readInstance.totalFlowers()).toString());
	},

	totalButterflies: async function() {
		return parseInt((await App.readInstance.typedTotalSupply(0)).toString());
	},

	totalHearts: async function() {
		return parseInt((await App.readInstance.typedTotalSupply(1)).toString());
	},

	getFlower: async function(index) {
		return await App.readInstance.getFlowerByIndex(index);
	},

	getButterfly: async function(index) {
		return parseInt((await App.readInstance.typedTokenByIndex(0, index)).toString());
	},

	getHeart: async function(index) {
		return parseInt((await App.readInstance.typedTokenByIndex(1, index)).toString());
	},

	totalButterflyOwned: async function(account) {
		return parseInt((await App.readInstance.typedBalanceOf(0, account)).toString());
	},

	totalHeartOwned: async function(account) {
		return parseInt((await App.readInstance.typedBalanceOf(1, account)).toString());
	},

	getButterflyOwned: async function(account,index) {
		return parseInt((await App.readInstance.typedTokenOfOwnerByIndex(0, account, index)).toString());
	},

	getHeartsOwned: async function(account, index) {
		return parseInt((await App.readInstance.typedTokenOfOwnerByIndex(1, account, index)).toString());
	},

	getButterflyInfo: async function(index) {
		return (await App.readInstance.getButterflyInfo(index)).toString().split(',');
	},

	getHeartInfo: async function(index) {
		return (await App.readInstance.getHeartInfo(index)).toString().split(',');
	},

	getFlowerURI: async function(account) {
		if (account == 0 || account == "0x") {
			return await App.readInstance.accountZeroURI();
		}

		return await App.readInstance.accountURI(account);
	},

	getTokenURI: async function(token) {
		return await App.readInstance.tokenURI(token);
	},

	getButterflyURIFromGene: async function(gene, isAlive) {
		return await App.readInstance.getButterflyURIFromGene(gene, isAlive);
	},

	sendTo: async function(account, token) {
		const currentAccount = await App.getCurrentAccount();
		const lastInitOption = App.getLastInitOption();
		if (lastInitOption == InitOptions.SMS_MAINNET || lastInitOption === InitOptions.SMS_RINKEBY) {
			return new Promise((resolve, reject) => {
				App.instance.transferFrom.sendTransaction(currentAccount, account, token, 
					{from: currentAccount}, function(error, txHash) {
					if (error) reject(error);
					resolve();
				});
			});
		}
		
		return App.instance.transferFrom(currentAccount, account, token);
	},

	burn: async function(token) {
		const lastInitOption = App.getLastInitOption();
		if (lastInitOption == InitOptions.SMS_MAINNET || lastInitOption === InitOptions.SMS_RINKEBY) {
			const currentAccount = await App.getCurrentAccount();
			return new Promise((resolve, reject) => {
				App.instance.burn.sendTransaction(token, {from: currentAccount}, function(error, txHash) {
					if (error) reject(error);
					resolve();
				});
			});
		}
		
		return await App.instance.burn(token);
	},

	canReceiveButterfly: async function(butterfly, flower) {
		return await App.readInstance.canReceiveButterfly(butterfly, flower);
	},

	ownerOf: async function(token) {
		return await App.readInstance.ownerOf(token);
	},

	getButterflyOwnerByIndex: async function(butterfly, index) {
		return await App.readInstance.getButterflyOwnerByIndex(butterfly, index);
	},

	getHeartOwnerByIndex: async function(heart, index) {
		return await App.readInstance.getHeartOwnerByIndex(heart, index);
	},

	transferEvent: async function(json) {
		if (App.readOnlyNetwork) return;
		const lastInitOption = App.getLastInitOption();
		if (lastInitOption == InitOptions.SMS_MAINNET || lastInitOption === InitOptions.SMS_RINKEBY) return;
		
		const event = App.instance.Transfer();

		event.get((error, logs) => {
			window.transferLogs = logs;
		});

		event.watch(async (error, result) => {
			if (!error) {
				let print = true;

				for (log in window.transferLogs) {
					if (result.transactionHash == window.transferLogs[log].transactionHash) {
						print = false;
					}
				}

				if (print){
					const currentAccount = await App.getCurrentAccount();
					if (currentAccount == result.args._from || currentAccount == result.args._to){
						alert('A transfer has been made with your account!');
						window.location.href = window.location.href + '/';
					}
				}

			} else {
				console.error(error);
			}
		});
	},

};

$(function() {
	$(window).load(function() {
		App.bindEvents();
		App.init(InitOptions.AUTODETECT).then(() => {
			lottie.loadAnimation({
				container: document.getElementById('img-scenario'),
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: 'animation/scenario/scenario.json'
			});

			const anim_chest = lottie.loadAnimation({
				container: document.getElementById('img-chest'),
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path: 'animation/chest/chest.json'
			});

			$('#img-chest').click(function() {
				anim_chest.play();
			});

			$('#close').click(function() {
				anim_chest.goToAndStop(0, 0);
			});

			anim_chest.addEventListener('complete', function(){
				window.location.href = "#openChest";
			});
		});
	});
});

function networkIdToName(networkId) {
	switch (networkId) {
		case 1: return 'Mainnet';
		case 2: return 'Morden';
		case 3: return 'Ropsten';
		case 4: return 'Rinkeby';
		case 42: return 'Kovan';
		default: {
			if (typeof networkId === 'undefined') {
				return 'an unknkown network';
			}
			return 'an unknkown network (network ID ' + networkId + ')';
		}
	}
}

function isSupported(networkId) {
	return networkId === 1 
		|| networkId === 3
		|| networkId === 4
		|| networkId === 42;
}

function secondsToTime(seconds) {
	const roundSeconds = Math.round(seconds);
	const displayDays = Math.floor(seconds / (24 * 60 * 60));

	const divisorHours = roundSeconds % (24 * 60 * 60);
	const displayHours = Math.floor(divisorHours / (60 * 60));

	const divisorMinutes = divisorHours % (60 * 60);
	const displayMinutes = Math.floor(divisorMinutes / 60);

	const divisor_for_seconds = divisorMinutes % 60;
	const displaySeconds = Math.ceil(divisor_for_seconds);

	return {
		"d": displayDays,
		"h": displayHours,
		"m": displayMinutes,
		"s": displaySeconds
	};
}

function countdown(time, ref, down = true, selfRef = false) {
	if (!selfRef) window.myTimer = true;

	if (down) time.s --;
	else time.s ++;

	if (!down) {
		if(time.s === 60) {
			time.s = 0;
			time.m +=1;
			if (time.m === 60) {
				time.m = 0;
				time.h +=1;
				if (time.h === 24) {
					time.h = 0;
					time.m = 0;
					time.s = 0;
					time.d += 1;
				}
			}
		}
	}

	else {
		if(time.s === -1) {
			time.s = 59;
			time.m -=1;
			if (time.m === -1) {
				time.m = 59;
				time.h -=1;
				if (time.h === -1) {
					time.h = 23;
					time.m = 59;
					time.s = 59;
				}
			}
		}
	}

	$(ref).text(describeTime(time));

	if (window.myTimer) {
		setTimeout(function() {
			countdown(time, ref, down, true)
		},1000);
	}
}

function killTimeouts() {
	let id = window.setTimeout(function() {}, 0);

	while (id--) {
		window.clearTimeout(id);
	}
	window.myTimer = true;
}

function pad(number, bool) {
	number = parseInt(number,10);
	if(bool && number == 0) return number;
	return (number < 10 ? '0': '') + number;
}

function describeTime(time) {
	if (time.d > 0) {
		if (time.h === 0 && time.m === 0 && time.s === 0) {
			return (time.d === 1 ? '1 day' : time.d + ' days');
		}
		return (time.d === 1 ? '1 day' : time.d + ' days') + ' ' + pad(time.h)+':'+pad(time.m) +':'+pad(time.s);
	}
	return pad(time.h)+':'+pad(time.m) +':'+pad(time.s);
}

function describeSeconds(seconds) {
	if (seconds < 60) {
		return 'less than 1 min';
	}

	if (seconds < 1.5 * 60 * 60) {
		const minutes = Math.round(seconds / 60);
		return minutes + ' min';
	}

	if (seconds < 1.5 * 24 * 60 * 60) {
		const hours = Math.round(seconds / (60 * 60));
		return (hours === 1) ? '1 hour' : hours + ' hours';
	}

	const days = Math.round(seconds / (24 * 60 * 60));
	return (days === 1) ? '1 day' : days + ' days';
}

function describeSecondsShort(seconds) {
	if (seconds < 60) {
		return '< 1 min';
	}

	if (seconds < 1.5 * 60 * 60) {
		const minutes = Math.round(seconds / 60);
		return minutes + 'm';
	}

	if (seconds < 1.5 * 24 * 60 * 60) {
		const hours = Math.round(seconds / (60 * 60));
		return hours + 'h';
	}

	const days = Math.round(seconds / (24 * 60 * 60));
	return days + 'd';
}

function sleep(retryNumber) {
	const milliseconds = Math.min(Math.floor(Math.random() * (Math.pow(2, retryNumber) - 1) * App.sleepBetweenCalls), App.maxSleepTime);
	console.log('sleep for: ' + milliseconds);
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}
