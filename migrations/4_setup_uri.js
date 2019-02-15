const Main = artifacts.require("Main");

/**
 * This migration step is responsible for setting up all of the flower, butterfly, and heart URIs -- and then
 * renouncing ownership of the contract, so that these configurations may no longer be modified.
 *
 * Each method call associates a particular URI string with a probability for flowers, butterflies, and hearts.
 * As of the time of this documentation, there were:
 *  * 15 types flowers with equal probability of occurrence,
 *  * 30 types of butterflies, being 15 common, 10 uncommon, 3 rare, and 2 epic
 *  * Only one type of heart
 *
 * Rather than the placeholder strings below, the string should point to a valid image URI, or alternatively,
 * to a URI for a JSON file that matches the following schema:
 *
 *   https://eips.ethereum.org/EIPS/eip-1047
 *
 */


module.exports = function(deployer) {
    Main.deployed().then(function (instance) {

        // setup flowers
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmTtPtJodMAZauMRFeReuK7qmakZXFREmvMqB7KZ6hBSn8");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmdLhoQgDnyN3YyumraC4WsYpP77bdje82i4uWwev5x4Jb");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmNgDxWEYaVFsGRvVqVagqVRRxrFfxrQ9JTQEMwLwwRwM9");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmQxzEDHF7ZToXNw2GXR2SRiAh5GsjjnhQwKoigq2XTbq8");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmeDFFBvREt3vQUSQCFZuaa4aPbfrL9y1ABViQWq3Qj5dR");

        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmZsAy7NSvEmXDAqso3E2Y2wV7ZbfRAmVgSQjeUbKg9R4d");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmQx217LZDtPkU1M1BmU5qhCVYTQ5QtiNGxC6eRAC4AguL");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmSRbAEW6Qtwrdf21mriURVufAMuYUtTUayro5iiLboH17");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmSMg2Dhnqs6nGo5W7RSKSovxXTT9EQ3esjAGDhQqjgxqG");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmUgZyCn6iRMJMMAhXtrxBPZidQr21t8ZHxoX8TQttvAoT");

        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmWezM8eRtqtSPKxvyrLEsnhCtgvcFn3xzED1LW6LNbeG5");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmWGbZEw6y1d68VGYEeJdUbW8nQqVYiumWFuCSL3jWUUcm");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmdyZf2UiWvzwfV9RTCGyAwwGBwteo9xYy5LmSSSzyhH6m");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmWdkTgusJ1sDrMZ5AN8GZTZNpBmHZsiPfvvrZtbPwN2Vi");
        instance.addFlowerURI(1, "https://ipfs.io/ipfs/QmVXiTZqcuvTPSCYL5czuCiZ3WZQr2wgXFWfJEvYZnxEd2");

        instance.setWhiteFlowerURI("https://ipfs.io/ipfs/QmQAXdSGdQQuRvmNegoKc1Eamg7rr5gxwmpZcpcL6Qzis8");


        // setup butterflies
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmfTkEFHfz5he3GHgLromoSwp2fBGAbJGkSUCuuqxFGJur", "https://ipfs.io/ipfs/QmcDnpwxGnQhLJiceRsEzbN3KR9MZLRrz7F8yKYU7qvQpH", "https://ipfs.io/ipfs/Qmceo48QEXSMeyXqQzuCz7DzUdbLTdsECQaTotP1JssVWr");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmeoeaEH1ihAgpEJZq6Z3bm75NFXaxyBWtVmUGv2x5A3Eq", "https://ipfs.io/ipfs/QmYnKh6r5EyvPNs22JikEJcEAu5cgoVU5jAFvRWFC1uM7r", "https://ipfs.io/ipfs/QmPwKLnncqZdYDvc34qEpDg6NnvhHQXib3CNGXd4CXxYUk");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmUd41DJCY5VgQWuMihPE6GTuh1bw3QD77EyuxuZcYkZRD", "https://ipfs.io/ipfs/QmTZDYYF75SabP4JoLpBdaXcyDe4CznrZzTWX6B79bju8u", "https://ipfs.io/ipfs/QmeyLvhVfhcv68aSBo5n1sovJfyX6G7GeJMVu9aEURxTgR");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmXJWrdePrJwHnaEihsA5keYsfrvHwLJMHF7gdkEPGZsW7", "https://ipfs.io/ipfs/QmNTC9dGyMvB1p5Y4x6KpKX2oBuQudGHvVYwhZwv6xuBV2", "https://ipfs.io/ipfs/QmcipMtf4BNqQcT59xRrnqe9UZoLX5XexYkJUiK3ajpnVn");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmWpJwvxqfucdffhN8rknRu6Mr2Ugo6zSexkibW8QYLgGj", "https://ipfs.io/ipfs/QmfUoD9svtA4j9QvJuMMDhvU63bVscjtD1kCNfNxc9Au4y", "https://ipfs.io/ipfs/QmXCKQGWvwMSQZfN2DwbbNvihvpWpCMvDv7VSD2caTYcDM");

        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmdhkzxU92RVofsDRLSQSpEf1PWP7UbDUFHZCMV9hts2hm", "https://ipfs.io/ipfs/QmNPp8uQ2NYM5Ag6mvRpzJsbtf8kfWydpHvChRDEdw44SG", "https://ipfs.io/ipfs/QmXPudNq5MrfVS3RAxCWccvJA4itBvNJ6YZVzyCi2cESfu");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmZrLWjJmuj7o7v83BDWEqa98SNNNvtjErvN3XcXUN5S3r", "https://ipfs.io/ipfs/QmdEyiaQ8bLcraw2bEpEeRLHGZPh9iCDYssbntgXyCoDwc", "https://ipfs.io/ipfs/QmPpZU9ShgYPfoM8Bhb2dRxLANK9rGRPtrsSxtcJVafwG8");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/Qmes4ym4nYWZZ4BqqHfNjcXQC2iJVRypwHLYgUczUnZG65", "https://ipfs.io/ipfs/QmRMRcYtQVou1PpMzhT66hVkmZdcKcrtYT1hRG3ndMrtQs", "https://ipfs.io/ipfs/QmP9HTQsyEkoSm4TmS3Jjc6fGazFAqSrQVpvmZKyQE4rTk");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/Qma5yJRXUPkbW2THMBVb1tiMWNzjoAkuvaJS7oCJfMfUmQ", "https://ipfs.io/ipfs/QmSekW2umwiByGEV8WqX4XjSgigd6sMF81EyeDENRWSBZF", "https://ipfs.io/ipfs/QmQdmwgDuNiYzdQ6XYsMapPEJvSwzRBtUMavjVzHqcec6k");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmTUNPne7yFa2rP75iUGQrmBtAGo5N4WgxaL91oJc94ire", "https://ipfs.io/ipfs/QmRLL1ejcNdcS6LBQ3jzFS3TxnpomRuqHAwqWTDNGrN75P", "https://ipfs.io/ipfs/QmVN2RmSCbtKk78X6thyszKamZKe8Pd7BJMV8dzG13VRSV");

        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmcPUW8XZcGgoQXUah7e4p2V8g6n4Z3me3VBMuTrG5BztA", "https://ipfs.io/ipfs/QmdNsTJTw922ivtp2bMaSokvzAkSQcDMocrR7DvfMQ4E6B", "https://ipfs.io/ipfs/QmP3qJotmJiqxqbSEDjJqFfahrAr8DPADZ7Q1abqzhC5Ca");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmSeQKt4igREE91E2K9gKzfUsubxS17obd2dhazmyrhcgV", "https://ipfs.io/ipfs/QmYNVjx4jzdFZcJu1wLMakZYn5C15DAG2Li6qGeAZLbhFN", "https://ipfs.io/ipfs/QmXJoRxkgErFiCN42YhbuGeKcJ8UXZdYGvWxGe3ECqsAsZ");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmZ7HkNRmxfpUShNr6wzFDhJDjngtvzEDpUFQUBQQmrqjx", "https://ipfs.io/ipfs/QmTXmTnxoBATUFaqTS5ZgW4kiHBTNjVqmRimcyuB2YM3aD", "https://ipfs.io/ipfs/QmUx8EB8k55YyYchEZ9phedDF6ttNJCqLoxwtQw2nwEAQK");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmZ87QRgnGXMHEjKrAztzcyRytpK4oYXqm5cr4PrpaVwWF", "https://ipfs.io/ipfs/QmZSfRUYP9hy3xJv5AED8FtKAR4ZZJXh2vD9thMLKz6tZi", "https://ipfs.io/ipfs/QmVbeHKnQNgjvEXpHKdMDJ1kNNxkyVKF5AQt4kgUC8R5j9");
        instance.addButterflyURI(8, "https://ipfs.io/ipfs/QmeHMgmHNEc6eWytP3pxNxWpTmEEeEXr3gpkoVWZ99vVrA", "https://ipfs.io/ipfs/Qmf2G9QC61U288UkpDQ1Mvnwa3UCtX1B9zwG6FPoLgVGGa", "https://ipfs.io/ipfs/QmRyBjmBi1EhNbaK6EhFgtyTApEPuMoDDMybhWdvyYtgYv");

        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmUQBgp7Hx11tCx1xaSMxA349w7V4Mb6xWXZeBKbfg1HMS", "https://ipfs.io/ipfs/Qmci3qzmRYWBsVM4UAfXqzzwMr3NMoDHH8L5MfnbXwo3eE", "https://ipfs.io/ipfs/QmUhonnonPrVwL5L1ePEfbxoiS9bwbfZNFCPuBaHDdiLYV");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmRkD6ohZuNdmbBzPP7AwPyu9LwgK1St7PiktpuvKcR5Y9", "https://ipfs.io/ipfs/QmS3D1ynCTzNCo5gAmWaEDdjGVZxHkZgavXVTkYGrDKXQ2", "https://ipfs.io/ipfs/QmUcJDejDNfGS25kxFBTWA8h2AD4wiWhDoc5wDGhDv5AVS");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmeM9Kd3XDLz8f92KZ6LSthRR2FBQs2m5fnFshbQL6mXFd", "https://ipfs.io/ipfs/QmXoT8ArH7YFc13LiToPduXbACioMBs9pbxB1Pt31WJxuJ", "https://ipfs.io/ipfs/QmYNfEDD3B2ndUHPi9HQnhGkEASawVZbzcQp6CCD163CUe");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmUB5QnUxe5wgq49QCoLPA6wC3b4HPrmzkjTr4kL55tS4r", "https://ipfs.io/ipfs/QmakDsVgUEmNt3MszzVXbdmevBZkKSKsZqNmYzMbZkrnKc", "https://ipfs.io/ipfs/Qmf8xtHuYZtcMs2P1Qj7JLt2XBjDqKdEX9uZR7RVUxHGsz");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmXeNfRXoDF14HrB4VwFrToxrpyUUU4b3Fti23yqwmt6hM", "https://ipfs.io/ipfs/QmSPrgi17DV7BG9Zj4kZXHRCku8m8X7uSsEeKnD55TTbSa", "https://ipfs.io/ipfs/QmW22tJD8woBzg6Pu4WSazfPv7NkFz4BGwVYsEQdhBatcg");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmdpwFdjMYofFm8iQPwJV5xd18V25mFSL74qeTJfemwjxo", "https://ipfs.io/ipfs/QmRiPHYdFs1ZsXgJ52sz2jFTw29QRzhTtBkZkawFoYjsuE", "https://ipfs.io/ipfs/QmNMaf8vyUczCBnBTBeFrFDsgEKEEgYamuQxt78YgUFe1v");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmNnrNaKBfVSZXqcdAHjYXG4hvxtNw4sTwnazLzELivkgv", "https://ipfs.io/ipfs/QmRhMjL3xAQf5EAY2emnqwgL4fU6itZuz32mHXkkufWQnw", "https://ipfs.io/ipfs/QmQbh5Ebz3Y2nZrq2ZtQ6KcAnKeQKWxWZy1Nek4W83D9eP");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmSP1xa5CV8gwAp4RPFHopC3XUwBebyMGZLZAKJAR3sAGo", "https://ipfs.io/ipfs/QmcShvDeXBuy7mYeMRumM6VNZzAoZjbq8WKQHuWitvScYW", "https://ipfs.io/ipfs/QmRYSCi2cjpcosNgNJtJkMxVVy84L3ZhsqDnYjkkmomtCn");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmQ4pTTt393N4i2TbgEQm8oSpVTxKpm5JPvUitupYacNHA", "https://ipfs.io/ipfs/QmbG3yrkXZNsZzurRdD6SvNVgbp6CY6iJNNaY89SQY2FNH", "https://ipfs.io/ipfs/Qmcnsj9HSriNfqJQHsuYnL8u4u5BUCTE7x4rLifpWKS6ME");
        instance.addButterflyURI(4, "https://ipfs.io/ipfs/QmaGNV1mQR7kvXxh5KoWmQSxd5wGbDsvfdC6RaFwLgyr3P", "https://ipfs.io/ipfs/QmVNErnN91EQCKqYgdwPPaKUPWSE5vFmM8P7cimnF4Gwa6", "https://ipfs.io/ipfs/QmSXy2SD69nsSPNfKJEK2dDiZrzoHFQU7BgJYS7oGpy2Fr");

        instance.addButterflyURI(2, "https://ipfs.io/ipfs/QmbGDTTxobeQhVdywMHSEc7uxLKirVhU8FAt4TewA7z5ur", "https://ipfs.io/ipfs/QmcSrRFGnfZ9cdrYu9AFpqu6QWPNf3Sc2YdtWUzpGfcG7F", "https://ipfs.io/ipfs/QmfDBuC7VaXsCYHjom11MnuKKr4BJBoa6E7HSMbQfns4P5");
        instance.addButterflyURI(2, "https://ipfs.io/ipfs/QmXQ2NEuCJELdweFUgrSa9hZmFA8p11bbN8tjEXotPyUCr", "https://ipfs.io/ipfs/QmbCYviy2JocfsrsTGiBwqJKdexMo2HyYBTLm6mMRwgMHC", "https://ipfs.io/ipfs/QmcNSfZYRkxWMfaa7L4jzHTqyAdqzDpx5s9hdncpM8JnnE");
        instance.addButterflyURI(2, "https://ipfs.io/ipfs/QmUMUWuxab6CY25hwqYtW3DsQhwMWW5sxDLD2ZzKGuHd7N", "https://ipfs.io/ipfs/QmSC725w6CtNBr8KSB6QnQyzfgufTYQMk9UCWyjjKXkZcp", "https://ipfs.io/ipfs/QmRHkbgMLUogXrzvHv7b3FRnvTPaAeAy54oQBzZmPFjZ3F");

        instance.addButterflyURI(1, "https://ipfs.io/ipfs/QmfS6qhZ9wX1BjDcpE3gPbxiTAVrQdssqdE68uhg6AdGde", "https://ipfs.io/ipfs/QmbPHbppWMtzHA5GMV64tdAbmGBf5tKbXA3fbyopxi6C6x", "https://ipfs.io/ipfs/QmQ2QC1e6MRGNidJXcZ31h81fVCpXaYyVusC8ZHiQCH9N8");
        instance.addButterflyURI(1, "https://ipfs.io/ipfs/QmdCfmxLH3CiVTYqwxuR9fuUhyEvvv3j5XJm4Pc6m28J5W", "https://ipfs.io/ipfs/QmYicM6bmhNgffZW8xKfb7Rp4hFzhbTXM11mT7hAyd1fei", "https://ipfs.io/ipfs/QmNZ3XvaBFECPQaoX5kVk3FUa99tKF2DiY7G9eDrUK2yWH");
    });
};
