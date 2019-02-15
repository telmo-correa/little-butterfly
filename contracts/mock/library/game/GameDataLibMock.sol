pragma solidity ^0.4.24;

import "../../../library/game/GameDataLib.sol";


contract GameDataLibMock {

    GameDataLib.Data internal self;
    ERC721Manager.ERC721Data internal erc721Data;
    uint256 internal lastId;

    constructor() public {
        // initialize PRNG values
        self.seed.s0 = uint64(now);
        self.seed.s1 = uint64(msg.sender);
    }

    function getButterflyInfo(
        uint256 butterflyId
    ) external view returns (
        uint64 gene,
        uint64 createdTimestamp,
        uint64 lastTimestamp,
        uint160 numOwners
    ) {
        (gene, createdTimestamp, lastTimestamp, numOwners) = GameDataLib.getButterflyInfo(self, butterflyId);
    }

    function getHeartInfo(
        uint256 heartId
    ) external view returns (
        uint256 butterflyId,
        uint64 gene,
        uint64 snapshotTimestamp,
        uint160 numOwners
    ) {
        (butterflyId, gene, snapshotTimestamp, numOwners) = GameDataLib.getHeartInfo(self, heartId);
    }

    function getFlowerInfo(
        address flowerAddress
    ) external view returns (
        bool isClaimed,
        uint64 gene,
        uint64 gardenTimezone,
        uint64 createdTimestamp,
        uint160 flowerIndex
    ) {
        (isClaimed, gene, gardenTimezone, createdTimestamp, flowerIndex) = GameDataLib.getFlowerInfo(self, flowerAddress);
    }

    function getButterflyOwnerByIndex(
        uint256 butterflyId,
        uint160 index
    ) external view returns (address) {
        return GameDataLib.getButterflyOwnerByIndex(self, butterflyId, index);
    }

    function getHeartOwnerByIndex(
        uint256 heartId,
        uint160 index
    ) external view returns (address) {
        return GameDataLib.getHeartOwnerByIndex(self, heartId, index);
    }

    function canReceiveButterfly(
        uint256 butterflyId,
        address receiver,
        uint64 currentTimestamp
    ) external view returns (bool) {
        return GameDataLib.canReceiveButterfly(self, butterflyId, receiver, currentTimestamp);
    }


    function claim(
        address claimer,
        uint64 gardenTimezone,
        uint64 currentTimestamp
    ) external {
        lastId = GameDataLib.claim(self, claimer, gardenTimezone, currentTimestamp);
    }

    function transferButterfly(
        uint256 butterflyId,
        address sender,
        address receiver,
        uint64 currentTimestamp
    ) external {
        lastId = GameDataLib.transferButterfly(self, butterflyId, sender, receiver, currentTimestamp);
    }

    function getLastId() external view returns (uint256) {
        return lastId;
    }

    function typedBalanceOf(uint8 tokenType, address _owner) public view returns (uint256) {
        return GameDataLib.typedBalanceOf(self, tokenType, _owner);
    }

    function typedTotalSupply(uint8 tokenType) public view returns (uint256) {
        return GameDataLib.typedTotalSupply(self, tokenType);
    }

    function typedTokenOfOwnerByIndex(
        uint8 tokenType,
        address _owner,
        uint256 _index
    ) external view returns (uint256) {
        return GameDataLib.typedTokenOfOwnerByIndex(self, tokenType, _owner, _index);
    }

    function typedTokenByIndex(
        uint8 tokenType,
        uint256 _index
    ) external view returns (uint256) {
        return GameDataLib.typedTokenByIndex(self, tokenType, _index);
    }

    function totalFlowers() external view returns (uint160) {
        return GameDataLib.totalFlowers(self);
    }

    function getFlowerByIndex(uint160 index) external view returns (address) {
        return GameDataLib.getFlowerByIndex(self, index);
    }


    function addFlowerURI(uint16 weight, string uri) external {
        GameDataLib.addFlowerURI(self, weight, uri);
    }

    function setWhiteFlowerURI(string uri) external {
        GameDataLib.setWhiteFlowerURI(self, uri);
    }

    function getWhiteFlowerURI() external view returns (string) {
        return GameDataLib.getWhiteFlowerURI(self);
    }

    function addButterflyURI(uint16 weight, string liveUri, string deadUri, string heartUri) external {
        GameDataLib.addButterflyURI(self, weight, liveUri, deadUri, heartUri);
    }

    function getFlowerURI(address flowerAddress) external view returns (string) {
        return GameDataLib.getFlowerURI(self, flowerAddress);
    }

    function getButterflyURI(uint256 butterflyId, uint64 currentTimestamp) external view returns (string) {
        return GameDataLib.getButterflyURI(self, erc721Data, butterflyId, currentTimestamp);
    }

    function getHeartURI(uint256 heartId) external view returns (string) {
        return GameDataLib.getHeartURI(self, heartId);
    }

    function getButterflyURIFromGene(uint64 gene, bool isAlive) external view returns (string) {
        return GameDataLib.getButterflyURIFromGene(self, gene, isAlive);
    }

}
