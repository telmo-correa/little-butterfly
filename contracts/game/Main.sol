pragma solidity >=0.4.21 <0.6.0;

import "../library/token/ERC721Token.sol";
import "../library/game/GameDataLib.sol";

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Main
 *
 * Main contract for LittleButterflies.  Implements the ERC721 EIP for Non-Fungible Tokens.
 */
contract Main is ERC721Token, Ownable {

    GameDataLib.Data internal data;

    // Set our token name and symbol
    constructor() ERC721Token("LittleButterfly", "BFLY") public {
        // initialize PRNG values
        data.seed.s0 = uint64(now);
        data.seed.s1 = uint64(msg.sender);
    }


    /** Token viewer methods **/


    /**
     * @dev Gets game information associated with a specific butterfly.
     * Requires ID to be a valid butterfly.
     *
     * @param butterflyId uint256 ID of butterfly being queried
     *
     * @return gene uint64
     * @return createdTimestamp uint64
     * @return lastTimestamp uint64
     * @return numOwners uint160
     */
    function getButterflyInfo(uint256 butterflyId) public view returns (
        uint64 gene,
        uint64 createdTimestamp,
        uint64 lastTimestamp,
        uint160 numOwners
    ) {
       (gene, createdTimestamp, lastTimestamp, numOwners) = GameDataLib.getButterflyInfo(data, butterflyId);
    }

    /**
     * @dev Returns the N-th owner associated with a butterfly.
     * Requires ID to be a valid butterfly, and owner index to be smaller than the number of owners.
     *
     * @param butterflyId uint256 ID of butterfly being queried
     * @param index uint160 Index of owner being queried
     *
     * @return address
     */
    function getButterflyOwnerByIndex(
        uint256 butterflyId,
        uint160 index
    ) external view returns (address) {
        return GameDataLib.getButterflyOwnerByIndex(data, butterflyId, index);
    }


    /**
     * @dev Gets game information associated with a specific heart.
     * Requires ID to be a valid heart.
     *
     * @param heartId uint256 ID of heart being queried
     *
     * @return butterflyId uint256
     * @return gene uint64
     * @return snapshotTimestamp uint64
     * @return numOwners uint160
     */
    function getHeartInfo(uint256 heartId) public view returns (
        uint256 butterflyId,
        uint64 gene,
        uint64 snapshotTimestamp,
        uint160 numOwners
    ) {
        (butterflyId, gene, snapshotTimestamp, numOwners) = GameDataLib.getHeartInfo(data, heartId);
    }

    /**
     * @dev Returns the N-th owner associated with a heart's snapshot.
     * Requires ID to be a valid butterfly, and owner index to be smaller than the number of owners.
     *
     * @param heartId uint256 ID of heart being queried
     * @param index uint160 Index of owner being queried
     *
     * @return address
     */
    function getHeartOwnerByIndex(
        uint256 heartId,
        uint160 index
    ) external view returns (address) {
        return GameDataLib.getHeartOwnerByIndex(data, heartId, index);
    }


    /**
     * @dev Gets game information associated with a specific flower.
     *
     * @param flowerAddress address Address of the flower being queried
     *
     * @return isClaimed bool
     * @return gene uint64
     * @return gardenTimezone uint64
     * @return createdTimestamp uint64
     * @return flowerIndex uint160
     */
    function getFlowerInfo(
        address flowerAddress
    ) external view returns (
        bool isClaimed,
        uint64 gene,
        uint64 gardenTimezone,
        uint64 createdTimestamp,
        uint160 flowerIndex
    ) {
        (isClaimed, gene, gardenTimezone, createdTimestamp, flowerIndex) = GameDataLib.getFlowerInfo(data, flowerAddress);
    }


    /**
     * @dev Determines whether the game logic allows a transfer of a butterfly to another address.
     * Conditions:
     * - The receiver address must have already claimed a butterfly
     * - The butterfly's last timestamp is within the last 24 hours
     * - The receiver address must have never claimed *this* butterfly
     *
     * @param butterflyId uint256 ID of butterfly being queried
     * @param receiver address Address of potential receiver
     */
    function canReceiveButterfly(
        uint256 butterflyId,
        address receiver
    ) external view returns (bool) {
        return GameDataLib.canReceiveButterfly(data, butterflyId, receiver, uint64(now));
    }


    /** Override token methods **/

    /**
     * @dev Override the default ERC721 transferFrom implementation in order to check game conditions and
     * generate side effects
     */
    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        _setupTransferFrom(_from, _to, _tokenId, uint64(now));
        ERC721Manager.transferFrom(erc721Data, _from, _to, _tokenId);
    }

    /**
     * @dev Override the default ERC721 safeTransferFrom implementation in order to check game conditions and
     * generate side effects
     */
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
        _setupTransferFrom(_from, _to, _tokenId, uint64(now));
        ERC721Manager.safeTransferFrom(erc721Data, _from, _to, _tokenId);
    }

    /**
     * @dev Override the default ERC721 safeTransferFrom implementation in order to check game conditions and
     * generate side effects
     */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes _data
    ) public {
        _setupTransferFrom(_from, _to, _tokenId, uint64(now));
        ERC721Manager.safeTransferFrom(erc721Data, _from, _to, _tokenId, _data);
    }


    /**
    * @dev Execute before transfer, preventing token transfer in some circumstances.
    * Requirements:
    *  - Caller is owner, approved, or operator for the token
    *  - To has claimed a token before
    *  - Token is a Heart, or Token's last activity was in the last 24 hours
    *
    * @param from current owner of the token
    * @param to address to receive the ownership of the given token ID
    * @param tokenId uint256 ID of the token to be transferred
    * @param currentTimestamp uint64
    */
    function _setupTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint64 currentTimestamp
    ) private {
        if (data.tokenToType[tokenId] == GameDataLib.TokenType.Butterfly) {
            // try to do transfer and mint a heart
            uint256 heartId = GameDataLib.transferButterfly(data, tokenId, from, to, currentTimestamp);
            ERC721Manager.mint(erc721Data, from, heartId);
        } else {
            GameDataLib.transferHeart(data, tokenId, from, to);
        }
    }

    /**
     * @dev Overrides the default tokenURI method to lookup from the stored table of URIs -- rather than
     * storing a copy of the URI for each instance
     *
     * @param _tokenId uint256
     * @return string
     */
    function tokenURI(uint256 _tokenId) public view returns (string) {
        if (data.tokenToType[_tokenId] == GameDataLib.TokenType.Heart) {
            return GameDataLib.getHeartURI(data, _tokenId);
        }
        return GameDataLib.getButterflyURI(data, erc721Data, _tokenId, uint64(now));
    }

    /**
     * @dev Returns the URI mapped to a particular account / flower
     *
     * @param accountAddress address
     * @return string
     */
    function accountURI(address accountAddress) public view returns (string) {
        return GameDataLib.getFlowerURI(data, accountAddress);
    }

    /**
     * @dev Returns the URI mapped to account 0
     *
     * @return string
     */
    function accountZeroURI() public view returns (string) {
        return GameDataLib.getWhiteFlowerURI(data);
    }

    /**
     * @dev Returns the URI for a particular butterfly gene -- useful for seeing the butterfly "as it was"
     * when it dropped a heart
     *
     * @param gene uint64
     * @param isAlive bool
     * @return string
     */
    function getButterflyURIFromGene(uint64 gene, bool isAlive) public view returns (string) {
        return GameDataLib.getButterflyURIFromGene(data, gene, isAlive);
    }


    /** Extra token methods **/

    /**
     * @dev Claims a flower and an initial butterfly for a given address.
     * Requires address to have not claimed previously
     *
     * @param gardenTimezone uint64
     */
    function claim(uint64 gardenTimezone) external {
        address claimer = msg.sender;

        // claim a butterfly
        uint256 butterflyId = GameDataLib.claim(data, claimer, gardenTimezone, uint64(now));

        // mint its token
        ERC721Manager.mint(erc721Data, claimer, butterflyId);
    }

    /**
     * @dev Burns a token.  Caller must be owner or approved.
     *
     * @param _tokenId uint256 ID of token to burn
     */
    function burn(uint256 _tokenId) public {
        require(ERC721Manager.isApprovedOrOwner(erc721Data, msg.sender, _tokenId));

        address _owner = ERC721Manager.ownerOf(erc721Data, _tokenId);

        _setupTransferFrom(_owner, address(0x0), _tokenId, uint64(now));
        ERC721Manager.burn(erc721Data, _owner, _tokenId);
    }



    /**
     * @dev Returns the total number of tokens for a given type, owned by a specific address
     *
     * @param tokenType uint8
     * @param _owner address
     *
     * @return uint256
     */
    function typedBalanceOf(uint8 tokenType, address _owner) public view returns (uint256) {
        return GameDataLib.typedBalanceOf(data, tokenType, _owner);
    }

    /**
     * @dev Returns the total number of tokens for a given type
     *
     * @param tokenType uint8
     *
     * @return uint256
     */
    function typedTotalSupply(uint8 tokenType) public view returns (uint256) {
        return GameDataLib.typedTotalSupply(data, tokenType);
    }


    /**
     * @dev Returns the I-th token of a specific type owned by an index
     *
     * @param tokenType uint8
     * @param _owner address
     * @param _index uint256
     *
     * @return uint256
     */
    function typedTokenOfOwnerByIndex(
        uint8 tokenType,
        address _owner,
        uint256 _index
    ) external view returns (uint256) {
        return GameDataLib.typedTokenOfOwnerByIndex(data, tokenType, _owner, _index);
    }

    /**
     * @dev Returns the I-th token of a specific type
     *
     * @param tokenType uint8
     * @param _index uint256
     *
     * @return uint256
     */
    function typedTokenByIndex(
        uint8 tokenType,
        uint256 _index
    ) external view returns (uint256) {
        return GameDataLib.typedTokenByIndex(data, tokenType, _index);
    }

    /**
     * @dev Gets the total number of claimed flowers
     *
     * @return uint160
     */
    function totalFlowers() external view returns (uint160) {
        return GameDataLib.totalFlowers(data);
    }

    /**
     * @dev Gets the address of the N-th flower
     *
     * @return address
     */
    function getFlowerByIndex(uint160 index) external view returns (address) {
        return GameDataLib.getFlowerByIndex(data, index);
    }


    /** Admin setup methods */

    /*
    * Methods intended for initial contract setup, to be called at deployment.
    * Call renounceOwnership() to make the contract have no owner after setup is complete.
    */

    /**
     * @dev Registers a new flower URI with the corresponding weight
     *
     * @param weight uint16 Relative weight for the occurrence of this URI
     * @param uri string
     */
    function addFlowerURI(uint16 weight, string uri) external onlyOwner {
        GameDataLib.addFlowerURI(data, weight, uri);
    }

    /**
     * @dev Registers the flower URI for address 0
     *
     * @param uri string
     */
    function setWhiteFlowerURI(string uri) external onlyOwner {
        GameDataLib.setWhiteFlowerURI(data, uri);
    }

    /**
     * @dev Registers a new butterfly URI with the corresponding weight
     *
     * @param weight uint16 Relative weight for the occurrence of this URI
     * @param liveUri string
     * @param deadUri string
     * @param heartUri string
     */
    function addButterflyURI(uint16 weight, string liveUri, string deadUri, string heartUri) external onlyOwner {
        GameDataLib.addButterflyURI(data, weight, liveUri, deadUri, heartUri);
    }

}
