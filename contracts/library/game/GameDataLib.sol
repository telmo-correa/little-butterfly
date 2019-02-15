pragma solidity ^0.4.24;

import "../data/PRNG.sol";
import "../data/EnumerableSetAddress.sol";
import "../data/EnumerableSet256.sol";
import "../data/URIDistribution.sol";
import "../token/ERC721Manager.sol";

/**
 * @title GameDataLib
 *
 * Library containing data structures and logic for game entities.
 */
library GameDataLib {

    /** Data structures */

    struct Butterfly {
        // data encoding butterfly appearance
        uint64 gene;

        // time this butterfly was created
        uint64 createdTimestamp;

        // last time this butterfly changed owner
        uint64 lastTimestamp;

        // set of owners, current and former
        EnumerableSetAddress.Data previousAddresses;
    }

    struct Heart {
        // ID of butterfly that generated this heart
        uint256 butterflyId;

        // time this heart was generated
        uint64 snapshotTimestamp;

        // set of owners, current and former, at time heart was generated
        EnumerableSetAddress.Data previousAddresses;
    }

    struct Flower {
        // Whether this address has ever claimed a butterfly
        bool isClaimed;

        // Data encoding flower appearance
        uint64 gene;

        // Data encoding the garden's timezone
        uint64 gardenTimezone;

        // Data encoding the creation timestamp
        uint64 createdTimestamp;

        // index of the flower registration
        uint160 flowerIndex;
    }

    struct URIMappingData {
        URIDistribution.Data flowerURIs;
        string whiteFlowerURI;

        URIDistribution.Data butterflyLiveURIs;
        URIDistribution.Data butterflyDeadURIs;
        URIDistribution.Data heartURIs;
    }

    // possible types of NFT
    enum TokenType {
        Butterfly,
        Heart
    }

    struct Data {
        // global pseudo-randomization seed
        PRNG.Data seed;

        // next ID available for token generation
        uint256 nextId;

        // token type data
        mapping (uint256 => TokenType) tokenToType;
        mapping (uint8 => mapping (address => EnumerableSet256.Data)) typedOwnedTokens;
        mapping (uint8 => EnumerableSet256.Data) typedTokens;

        // token data
        mapping (uint256 => Butterfly) butterflyData;
        mapping (uint256 => Heart) heartData;

        // owner data
        mapping (address => Flower) flowerData;
        address[] claimedFlowers;

        // URI mapping data
        URIMappingData uriMappingData;
    }

    /** Viewer methods */

    /**
     * @dev Gets game information associated with a specific butterfly.
     * Requires ID to be a valid butterfly.
     *
     * @param self Data storage Reference to game data
     * @param butterflyId uint256 ID of butterfly being queried
     *
     * @return gene uint64
     * @return createdTimestamp uint64
     * @return lastTimestamp uint64
     * @return numOwners uint160
     */
    function getButterflyInfo(
        Data storage self,
        uint256 butterflyId
    ) external view returns (
        uint64 gene,
        uint64 createdTimestamp,
        uint64 lastTimestamp,
        uint160 numOwners
    ) {
        Butterfly storage butterfly = self.butterflyData[butterflyId];
        require(butterfly.createdTimestamp != 0);

        gene = butterfly.gene;
        createdTimestamp = butterfly.createdTimestamp;
        lastTimestamp = butterfly.lastTimestamp;
        numOwners = uint160(butterfly.previousAddresses.elements.length);
    }

    /**
     * @dev Gets game information associated with a specific heart.
     * Requires ID to be a valid heart.
     *
     * @param self Data storage Reference to game data
     * @param heartId uint256 ID of heart being queried
     *
     * @return butterflyId uint256
     * @return gene uint64
     * @return snapshotTimestamp uint64
     * @return numOwners uint160
     */
    function getHeartInfo(
        Data storage self,
        uint256 heartId
    ) external view returns (
        uint256 butterflyId,
        uint64 gene,
        uint64 snapshotTimestamp,
        uint160 numOwners
    ) {
        Heart storage heart = self.heartData[heartId];
        require(heart.snapshotTimestamp != 0);

        butterflyId = heart.butterflyId;
        gene = self.butterflyData[butterflyId].gene;
        snapshotTimestamp = heart.snapshotTimestamp;
        numOwners = uint160(heart.previousAddresses.elements.length);
    }

    /**
     * @dev Gets game information associated with a specific flower.
     *
     * @param self Data storage Reference to game data
     * @param flowerAddress address Address of the flower being queried
     *
     * @return isClaimed bool
     * @return gene uint64
     * @return gardenTimezone uint64
     * @return createdTimestamp uint64
     * @return flowerIndex uint160
     */
    function getFlowerInfo(
        Data storage self,
        address flowerAddress
    ) external view returns (
        bool isClaimed,
        uint64 gene,
        uint64 gardenTimezone,
        uint64 createdTimestamp,
        uint160 flowerIndex
    ) {
        Flower storage flower = self.flowerData[flowerAddress];

        isClaimed = flower.isClaimed;
        if (isClaimed) {
            gene = flower.gene;
            gardenTimezone = flower.gardenTimezone;
            createdTimestamp = flower.createdTimestamp;
            flowerIndex = flower.flowerIndex;
        }
    }

    /**
     * @dev Returns the N-th owner associated with a butterfly.
     * Requires ID to be a valid butterfly, and owner index to be smaller than the number of owners.
     *
     * @param self Data storage Reference to game data
     * @param butterflyId uint256 ID of butterfly being queried
     * @param index uint160 Index of owner being queried
     *
     * @return address
     */
    function getButterflyOwnerByIndex(
        Data storage self,
        uint256 butterflyId,
        uint160 index
    ) external view returns (address) {
        Butterfly storage butterfly = self.butterflyData[butterflyId];
        require(butterfly.createdTimestamp != 0);

        return butterfly.previousAddresses.elements[index];
    }

    /**
     * @dev Returns the N-th owner associated with a heart's snapshot.
     * Requires ID to be a valid butterfly, and owner index to be smaller than the number of owners.
     *
     * @param self Data storage Reference to game data
     * @param heartId uint256 ID of heart being queried
     * @param index uint160 Index of owner being queried
     *
     * @return address
     */
    function getHeartOwnerByIndex(
        Data storage self,
        uint256 heartId,
        uint160 index
    ) external view returns (address) {
        Heart storage heart = self.heartData[heartId];
        require(heart.snapshotTimestamp != 0);

        return heart.previousAddresses.elements[index];
    }

    /**
     * @dev Determines whether the game logic allows a transfer of a butterfly to another address.
     * Conditions:
     * - The receiver address must have already claimed a butterfly
     * - The butterfly's last timestamp is within the last 24 hours
     * - The receiver address must have never claimed *this* butterfly
     * OR
     * - The receiver is 0x0
     *
     * @param self Data storage Reference to game data
     * @param butterflyId uint256 ID of butterfly being queried
     * @param receiver address Address of potential receiver
     * @param currentTimestamp uint64
     */
    function canReceiveButterfly(
        Data storage self,
        uint256 butterflyId,
        address receiver,
        uint64 currentTimestamp
    ) public view returns (bool) {
        Butterfly storage butterfly = self.butterflyData[butterflyId];

        // butterfly must exist
        if (butterfly.createdTimestamp == 0)
            return false;

        // can always transfer to 0 (destroying it)
        if (receiver == address(0x0))
            return true;

        // butterfly must have been last updated on the last day
        if (currentTimestamp < butterfly.lastTimestamp || currentTimestamp - butterfly.lastTimestamp > 1 days)
            return false;

        // receiver must have already claimed
        Flower storage flower = self.flowerData[receiver];
        if (!flower.isClaimed) return false;

        // receiver must have never owned this butterfly
        return !EnumerableSetAddress.contains(butterfly.previousAddresses, receiver);
    }


    /** Editor methods */

    /**
     * @dev Claims a flower and an initial butterfly for a given address.
     * Requires address to have not claimed previously
     *
     * @param self Data storage Reference to game data
     * @param claimer address Address making the claim
     * @param gardenTimezone uint64
     * @param currentTimestamp uint64
     *
     * @return butterflyId uint256 ID for the new butterfly
     */
    function claim(
        Data storage self,
        address claimer,
        uint64 gardenTimezone,
        uint64 currentTimestamp
    ) external returns (uint256 butterflyId) {
        Flower storage flower = self.flowerData[claimer];

        // require address has not claimed before
        require(!flower.isClaimed);
        // assert no overflow on IDs
        require(self.nextId + 1 != 0);

        // get butterfly ID
        butterflyId = self.nextId;
        // assert ID is not being reused
        Butterfly storage butterfly = self.butterflyData[butterflyId];
        require(butterfly.createdTimestamp == 0);
        // update counter
        self.nextId++;

        // update flower data
        flower.isClaimed = true;
        flower.gardenTimezone = gardenTimezone;
        flower.createdTimestamp = currentTimestamp;
        flower.gene = PRNG.next(self.seed);
        flower.flowerIndex = uint160(self.claimedFlowers.length);

        // update butterfly data
        butterfly.gene = PRNG.next(self.seed);
        butterfly.createdTimestamp = currentTimestamp;
        butterfly.lastTimestamp = currentTimestamp;
        EnumerableSetAddress.add(butterfly.previousAddresses, claimer);

        // update butterfly token data
        self.tokenToType[butterflyId] = TokenType.Butterfly;

        // register butterfly token
        EnumerableSet256.add(self.typedOwnedTokens[uint8(TokenType.Butterfly)][claimer], butterflyId);
        EnumerableSet256.add(self.typedTokens[uint8(TokenType.Butterfly)], butterflyId);

        // register address
        self.claimedFlowers.push(claimer);
    }

    /**
     * @dev Logs a transfer of a butterfly between two addresses, leaving a heart behind.
     *
     * Conditions:
     * - The receiver address must have already claimed a butterfly
     * - The butterfly's last timestamp is within the last 24 hours
     *
     * @param self Data storage Reference to game data
     * @param butterflyId uint256 ID of butterfly being queried
     * @param sender Address of sender
     * @param receiver address Address of potential receiver
     * @param currentTimestamp uint64
     *
     * @return heartId uint256 ID for the new heart
     */
    function transferButterfly(
        Data storage self,
        uint256 butterflyId,
        address sender,
        address receiver,
        uint64 currentTimestamp
    ) external returns (uint256 heartId) {
        // require transfer conditions to be satisfied
        require(canReceiveButterfly(self, butterflyId, receiver, currentTimestamp));

        // require no overflow on IDs
        require(self.nextId + 1 != 0);
        // get heart ID
        heartId = self.nextId;
        // assert ID is not being reused
        Heart storage heart = self.heartData[heartId];
        require(heart.snapshotTimestamp == 0);
        // update counter
        self.nextId++;

        // update heart data
        heart.butterflyId = butterflyId;
        heart.snapshotTimestamp = currentTimestamp;
        Butterfly storage butterfly = self.butterflyData[butterflyId];

        // update heart token heartId
        self.tokenToType[heartId] = TokenType.Heart;

        // update butterfly data
        butterfly.lastTimestamp = currentTimestamp;
        EnumerableSetAddress.add(butterfly.previousAddresses, receiver);

        // update heart addresses
        EnumerableSetAddress.copy(butterfly.previousAddresses, heart.previousAddresses);

        // update butterfly register
        EnumerableSet256.remove(self.typedOwnedTokens[uint8(TokenType.Butterfly)][sender], butterflyId);
        EnumerableSet256.add(self.typedOwnedTokens[uint8(TokenType.Butterfly)][receiver], butterflyId);

        // update heart register
        EnumerableSet256.add(self.typedOwnedTokens[uint8(TokenType.Heart)][sender], heartId);
        EnumerableSet256.add(self.typedTokens[uint8(TokenType.Heart)], heartId);
    }

    /**
     * @dev Logs a transfer of a heart between two addresses
     *
     * @param self Data storage Reference to game data
     * @param heartId uint256 ID of heart being queried
     * @param sender Address of sender
     * @param receiver address Address of potential receiver
     */
    function transferHeart(
        Data storage self,
        uint256 heartId,
        address sender,
        address receiver
    ) external {
        // update heart register
        EnumerableSet256.remove(self.typedOwnedTokens[uint8(TokenType.Heart)][sender], heartId);
        EnumerableSet256.add(self.typedOwnedTokens[uint8(TokenType.Heart)][receiver], heartId);
    }

    /**
     * @dev Returns the total number of tokens for a given type, owned by a specific address
     *
     * @param self Data storage Reference to game data
     * @param tokenType uint8
     * @param _owner address
     *
     * @return uint256
     */
    function typedBalanceOf(Data storage self, uint8 tokenType, address _owner) public view returns (uint256) {
        return self.typedOwnedTokens[tokenType][_owner].elements.length;
    }

    /**
     * @dev Returns the total number of tokens for a given type
     *
     * @param self Data storage Reference to game data
     * @param tokenType uint8
     *
     * @return uint256
     */
    function typedTotalSupply(Data storage self, uint8 tokenType) public view returns (uint256) {
        return self.typedTokens[tokenType].elements.length;
    }


    /**
     * @dev Returns the I-th token of a specific type owned by an index
     *
     * @param self Data storage Reference to game data
     * @param tokenType uint8
     * @param _owner address
     * @param _index uint256
     *
     * @return uint256
     */
    function typedTokenOfOwnerByIndex(
        Data storage self,
        uint8 tokenType,
        address _owner,
        uint256 _index
    ) external view returns (uint256) {
        return self.typedOwnedTokens[tokenType][_owner].elements[_index];
    }

    /**
     * @dev Returns the I-th token of a specific type
     *
     * @param self Data storage Reference to game data
     * @param tokenType uint8
     * @param _index uint256
     *
     * @return uint256
     */
    function typedTokenByIndex(
        Data storage self,
        uint8 tokenType,
        uint256 _index
    ) external view returns (uint256) {
        return self.typedTokens[tokenType].elements[_index];
    }

    /**
     * @dev Gets the total number of claimed flowers
     *
     * @param self Data storage Reference to game data
     * @return uint160
     */
    function totalFlowers(Data storage self) external view returns (uint160) {
        return uint160(self.claimedFlowers.length);
    }

    /**
     * @dev Gets the address of the N-th flower
     *
     * @param self Data storage Reference to game data
     * @return address
     */
    function getFlowerByIndex(Data storage self, uint160 index) external view returns (address) {
        return self.claimedFlowers[index];
    }

    /** Admin methods **/

    /**
     * @dev Registers a new flower URI with the corresponding weight
     *
     * @param self Data storage Reference to game data
     * @param weight uint16 Relative weight for the occurrence of this URI
     * @param uri string
     */
    function addFlowerURI(Data storage self, uint16 weight, string uri) external {
        URIDistribution.addURI(self.uriMappingData.flowerURIs, weight, uri);
    }

    /**
     * @dev Registers the flower URI for address 0
     *
     * @param self Data storage Reference to game data
     * @param uri string
     */
    function setWhiteFlowerURI(Data storage self, string uri) external {
        self.uriMappingData.whiteFlowerURI = uri;
    }

    /**
     * @dev Gets the flower URI for address 0
     *
     * @param self Data storage Reference to game data
     * @return string
     */
    function getWhiteFlowerURI(Data storage self) external view returns (string) {
        return self.uriMappingData.whiteFlowerURI;
    }

    /**
     * @dev Registers a new butterfly URI with the corresponding weight
     *
     * @param self Data storage Reference to game data
     * @param weight uint16 Relative weight for the occurrence of this URI
     * @param liveUri string
     * @param deadUri string
     * @param heartUri string
     */
    function addButterflyURI(Data storage self, uint16 weight, string liveUri, string deadUri, string heartUri) external {
        URIDistribution.addURI(self.uriMappingData.butterflyLiveURIs, weight, liveUri);
        URIDistribution.addURI(self.uriMappingData.butterflyDeadURIs, weight, deadUri);
        URIDistribution.addURI(self.uriMappingData.heartURIs, weight, heartUri);
    }

    /**
     * @dev Returns the URI mapped to a particular flower.
     * Requires flower to be claimed / exist.
     *
     * @param self Data storage Reference to game data
     * @param flowerAddress address Flower being queried
     * @return string
     */
    function getFlowerURI(Data storage self, address flowerAddress) external view returns (string) {
        Flower storage flower = self.flowerData[flowerAddress];
        require(flower.isClaimed);
        return URIDistribution.getURI(self.uriMappingData.flowerURIs, flower.gene);
    }

    /**
     * @dev Returns the URI mapped to a particular butterfly -- selecting the URI for it being alive
     * or dead based on the current timestamp.
     * Requires butterfly to exist.
     *
     * @param self Data storage Reference to game data
     * @param erc721Data ERC721Manager.ERC721Data storage Reference to ownership data
     * @param butterflyId uint256 ID of the butterfly being queried
     * @param currentTimestamp uint64
     * @return string
     */
    function getButterflyURI(
        Data storage self,
        ERC721Manager.ERC721Data storage erc721Data,
        uint256 butterflyId,
        uint64 currentTimestamp
    ) external view returns (string) {
        Butterfly storage butterfly = self.butterflyData[butterflyId];
        require(butterfly.createdTimestamp != 0);

        if (erc721Data.tokenOwner[butterflyId] == 0
            || currentTimestamp < butterfly.lastTimestamp
            || currentTimestamp - butterfly.lastTimestamp > 1 days) {
            return URIDistribution.getURI(self.uriMappingData.butterflyDeadURIs, butterfly.gene);
        }
        return URIDistribution.getURI(self.uriMappingData.butterflyLiveURIs, butterfly.gene);
    }

    /**
     * @dev Returns the URI for a particular butterfly gene -- useful for seeing the butterfly "as it was"
     * when it dropped a heart
     *
     * @param self Daata storage Reference to game data
     * @param gene uint64
     * @param isAlive bool
     * @return string
     */
    function getButterflyURIFromGene(
        Data storage self,
        uint64 gene,
        bool isAlive
    ) external view returns (string) {
        if (isAlive) {
            return URIDistribution.getURI(self.uriMappingData.butterflyLiveURIs, gene);
        }
        return URIDistribution.getURI(self.uriMappingData.butterflyDeadURIs, gene);
    }

    /**
     * @dev Returns the URI mapped to hearts
     *
     * @param self Data storage Reference to game data
     * @param heartId uint256 ID of heart being queried
     * @return string
     */
    function getHeartURI(Data storage self, uint256 heartId) external view returns (string) {
        Heart storage heart = self.heartData[heartId];
        require(heart.snapshotTimestamp != 0);

        uint64 gene = self.butterflyData[heart.butterflyId].gene;
        return URIDistribution.getURI(self.uriMappingData.heartURIs, gene);
    }

}
