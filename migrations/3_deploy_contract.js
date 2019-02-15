const ERC721Manager = artifacts.require("ERC721Manager");
const GameDataLib = artifacts.require("GameDataLib");

const Main = artifacts.require("Main");

module.exports = function(deployer) {
    deployer.link(ERC721Manager, Main);
    deployer.link(GameDataLib, Main);
    deployer.deploy(Main);
};
