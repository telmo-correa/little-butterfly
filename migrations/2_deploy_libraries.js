const PRNG = artifacts.require("PRNG");
const EnumerableSetAddress = artifacts.require("EnumerableSetAddress");
const EnumerableSet256 = artifacts.require("EnumerableSet256");
const URIDistribution = artifacts.require("URIDistribution");

const ERC721Manager = artifacts.require("ERC721Manager");

const GameDataLib = artifacts.require("GameDataLib");

module.exports = function(deployer) {
    deployer.deploy(PRNG);
    deployer.deploy(EnumerableSetAddress);
    deployer.deploy(EnumerableSet256);
    deployer.deploy(URIDistribution);

    deployer.deploy(ERC721Manager);

    deployer.link(EnumerableSetAddress, GameDataLib);
    deployer.link(EnumerableSet256, GameDataLib);
    deployer.link(PRNG, GameDataLib);
    deployer.link(URIDistribution, GameDataLib);
    deployer.deploy(GameDataLib);
};
