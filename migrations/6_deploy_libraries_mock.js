const PRNG = artifacts.require("PRNG");
const EnumerableSetAddress = artifacts.require("EnumerableSetAddress");
const EnumerableSet256 = artifacts.require("EnumerableSet256");
const URIDistribution = artifacts.require("URIDistribution");

const PRNGMock = artifacts.require("PRNGMock");
const EnumerableSetAddressMock = artifacts.require("EnumerableSetAddressMock");
const EnumerableSet256Mock = artifacts.require("EnumerableSet256Mock");
const URIDistributionMock = artifacts.require("URIDistributionMock");

const GameDataLib = artifacts.require("GameDataLib");
const GameDataLibMock = artifacts.require("GameDataLibMock");

/*
module.exports = function(deployer) {
    deployer.link(PRNG, PRNGMock);
    deployer.deploy(PRNGMock);

    deployer.link(EnumerableSetAddress, EnumerableSetAddressMock);
    deployer.deploy(EnumerableSetAddressMock);

    deployer.link(EnumerableSet256, EnumerableSet256Mock);
    deployer.deploy(EnumerableSet256Mock);

    deployer.link(URIDistribution, URIDistributionMock);
    deployer.deploy(URIDistributionMock);

    deployer.link(GameDataLib, GameDataLibMock);
    deployer.deploy(GameDataLibMock);
};
*/
