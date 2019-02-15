pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title ERC721Manager
 *
 * @dev This library implements OpenZepellin's ERC721 implementation (as of 7/31/2018) as
 * an external library, in order to keep contract sizes smaller.  Intended for use with
 * ERC721Token.sol, also provided.
 *
 * Both files are released under the MIT License.
 *
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Smart Contract Solutions, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
library ERC721Manager {

    using SafeMath for uint256;

    // We define the events on both the library and the client, so that the events emitted here are detected
    // as if they had been emitted by the client
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );
    event Approval(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );
    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    struct ERC721Data {
        // List of supported interfaces
        mapping (bytes4 => bool) supportedInterfaces;

        // Mapping from token ID to owner
        mapping (uint256 => address) tokenOwner;

        // Mapping from token ID to approved address
        mapping (uint256 => address) tokenApprovals;

        // Mapping from owner to number of owned token
        mapping (address => uint256) ownedTokensCount;

        // Mapping from owner to operator approvals
        mapping (address => mapping (address => bool)) operatorApprovals;


        // Token name
        string name_;

        // Token symbol
        string symbol_;

        // Mapping from owner to list of owned token IDs
        mapping(address => uint256[]) ownedTokens;

        // Mapping from token ID to index of the owner tokens list
        mapping(uint256 => uint256) ownedTokensIndex;

        // Array with all token ids, used for enumeration
        uint256[] allTokens;

        // Mapping from token id to position in the allTokens array
        mapping(uint256 => uint256) allTokensIndex;

        // Optional mapping for token URIs
        mapping(uint256 => string) tokenURIs;
    }

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `ERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant ERC721_RECEIVED = 0x150b7a02;


    bytes4 private constant InterfaceId_ERC165 = 0x01ffc9a7;
    /**
     * 0x01ffc9a7 ===
     *   bytes4(keccak256('supportsInterface(bytes4)'))
     */

    bytes4 private constant InterfaceId_ERC721 = 0x80ac58cd;
    /*
     * 0x80ac58cd ===
     *   bytes4(keccak256('balanceOf(address)')) ^
     *   bytes4(keccak256('ownerOf(uint256)')) ^
     *   bytes4(keccak256('approve(address,uint256)')) ^
     *   bytes4(keccak256('getApproved(uint256)')) ^
     *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
     *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
     *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
     *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
     *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
     */

    bytes4 private constant InterfaceId_ERC721Exists = 0x4f558e79;
    /*
     * 0x4f558e79 ===
     *   bytes4(keccak256('exists(uint256)'))
     */

    bytes4 private constant InterfaceId_ERC721Enumerable = 0x780e9d63;
    /**
     * 0x780e9d63 ===
     *   bytes4(keccak256('totalSupply()')) ^
     *   bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
     *   bytes4(keccak256('tokenByIndex(uint256)'))
     */

    bytes4 private constant InterfaceId_ERC721Metadata = 0x5b5e139f;
    /**
     * 0x5b5e139f ===
     *   bytes4(keccak256('name()')) ^
     *   bytes4(keccak256('symbol()')) ^
     *   bytes4(keccak256('tokenURI(uint256)'))
     */


    function initialize(ERC721Data storage self, string _name, string _symbol) external {
        self.name_ = _name;
        self.symbol_ = _symbol;

        // register the supported interface to conform to ERC165
        _registerInterface(self, InterfaceId_ERC165);

        // register the supported interfaces to conform to ERC721 via ERC165
        _registerInterface(self, InterfaceId_ERC721);
        _registerInterface(self, InterfaceId_ERC721Exists);
        _registerInterface(self, InterfaceId_ERC721Enumerable);
        _registerInterface(self, InterfaceId_ERC721Metadata);
    }

    function _registerInterface(ERC721Data storage self, bytes4 _interfaceId) private {
        self.supportedInterfaces[_interfaceId] = true;
    }

    function supportsInterface(ERC721Data storage self, bytes4 _interfaceId) external view returns (bool) {
        return self.supportedInterfaces[_interfaceId];
    }

    /**
     * @dev Gets the balance of the specified address
     * @param _owner address to query the balance of
     * @return uint256 representing the amount owned by the passed address
     */
    function balanceOf(ERC721Data storage self, address _owner) public view returns (uint256) {
        require(_owner != address(0));
        return self.ownedTokensCount[_owner];
    }

    /**
     * @dev Gets the owner of the specified token ID
     * @param _tokenId uint256 ID of the token to query the owner of
     * @return owner address currently marked as the owner of the given token ID
     */
    function ownerOf(ERC721Data storage self, uint256 _tokenId) public view returns (address) {
        address owner = self.tokenOwner[_tokenId];
        require(owner != address(0));
        return owner;
    }

    /**
     * @dev Returns whether the specified token exists
     * @param _tokenId uint256 ID of the token to query the existence of
     * @return whether the token exists
     */
    function exists(ERC721Data storage self, uint256 _tokenId) public view returns (bool) {
        address owner = self.tokenOwner[_tokenId];
        return owner != address(0);
    }

    /**
     * @dev Approves another address to transfer the given token ID
     * The zero address indicates there is no approved address.
     * There can only be one approved address per token at a given time.
     * Can only be called by the token owner or an approved operator.
     * @param _to address to be approved for the given token ID
     * @param _tokenId uint256 ID of the token to be approved
     */
    function approve(ERC721Data storage self, address _to, uint256 _tokenId) external {
        address owner = ownerOf(self, _tokenId);
        require(_to != owner);
        require(msg.sender == owner || isApprovedForAll(self, owner, msg.sender));

        self.tokenApprovals[_tokenId] = _to;

        emit Approval(owner, _to, _tokenId);
    }

    /**
     * @dev Gets the approved address for a token ID, or zero if no address set
     * @param _tokenId uint256 ID of the token to query the approval of
     * @return address currently approved for the given token ID
     */
    function getApproved(ERC721Data storage self, uint256 _tokenId) public view returns (address) {
        return self.tokenApprovals[_tokenId];
    }

    /**
     * @dev Sets or unsets the approval of a given operator
     * An operator is allowed to transfer all tokens of the sender on their behalf
     * @param _to operator address to set the approval
     * @param _approved representing the status of the approval to be set
     */
    function setApprovalForAll(ERC721Data storage self, address _to, bool _approved) external {
        require(_to != msg.sender);
        self.operatorApprovals[msg.sender][_to] = _approved;
        emit ApprovalForAll(msg.sender, _to, _approved);
    }

    /**
     * @dev Tells whether an operator is approved by a given owner
     * @param _owner owner address which you want to query the approval of
     * @param _operator operator address which you want to query the approval of
     * @return bool whether the given operator is approved by the given owner
     */
    function isApprovedForAll(
        ERC721Data storage self,
        address _owner,
        address _operator
    ) public view returns (bool) {
        return self.operatorApprovals[_owner][_operator];
    }

    /**
     * @dev Transfers the ownership of a given token ID to another address
     * Usage of this method is discouraged, use `safeTransferFrom` whenever possible
     * Requires the msg sender to be the owner, approved, or operator
     * @param _from current owner of the token
     * @param _to address to receive the ownership of the given token ID
     * @param _tokenId uint256 ID of the token to be transferred
    */
    function transferFrom(
        ERC721Data storage self,
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        require(isApprovedOrOwner(self, msg.sender, _tokenId));
        require(_from != address(0));
        require(_to != address(0));

        _clearApproval(self, _from, _tokenId);
        _removeTokenFrom(self, _from, _tokenId);
        _addTokenTo(self, _to, _tokenId);

        emit Transfer(_from, _to, _tokenId);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     *
     * Requires the msg sender to be the owner, approved, or operator
     * @param _from current owner of the token
     * @param _to address to receive the ownership of the given token ID
     * @param _tokenId uint256 ID of the token to be transferred
    */
    function safeTransferFrom(
        ERC721Data storage self,
        address _from,
        address _to,
        uint256 _tokenId
    ) external {
        // solium-disable-next-line arg-overflow
        safeTransferFrom(self, _from, _to, _tokenId, "");
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg sender to be the owner, approved, or operator
     * @param _from current owner of the token
     * @param _to address to receive the ownership of the given token ID
     * @param _tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function safeTransferFrom(
        ERC721Data storage self,
        address _from,
        address _to,
        uint256 _tokenId,
        bytes _data
    ) public {
        transferFrom(self, _from, _to, _tokenId);
        // solium-disable-next-line arg-overflow
        require(_checkAndCallSafeTransfer(_from, _to, _tokenId, _data));
    }

    /**
     * @dev Internal function to clear current approval of a given token ID
     * Reverts if the given address is not indeed the owner of the token
     * @param _owner owner of the token
     * @param _tokenId uint256 ID of the token to be transferred
     */
    function _clearApproval(ERC721Data storage self, address _owner, uint256 _tokenId) internal {
        require(ownerOf(self, _tokenId) == _owner);
        if (self.tokenApprovals[_tokenId] != address(0)) {
            self.tokenApprovals[_tokenId] = address(0);
        }
    }

    /**
     * @dev Internal function to invoke `onERC721Received` on a target address
     * The call is not executed if the target address is not a contract
     * @param _from address representing the previous owner of the given token ID
     * @param _to target address that will receive the tokens
     * @param _tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return whether the call correctly returned the expected magic value
     */
    function _checkAndCallSafeTransfer(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes _data
    ) internal returns (bool) {
        if (!_isContract(_to)) {
            return true;
        }
        bytes4 retval = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);
        return (retval == ERC721_RECEIVED);
    }

    /**
     * Returns whether the target address is a contract
     * @dev This function will return false if invoked during the constructor of a contract,
     * as the code is not actually created until after the constructor finishes.
     * @param _addr address to check
     * @return whether the target address is a contract
     */
    function _isContract(address _addr) internal view returns (bool) {
        uint256 size;
        // XXX Currently there is no better way to check if there is a contract in an address
        // than to check the size of the code at that address.
        // See https://ethereum.stackexchange.com/a/14016/36603
        // for more details about how this works.
        // TODO Check this again before the Serenity release, because all addresses will be
        // contracts then.
        // solium-disable-next-line security/no-inline-assembly
        assembly { size := extcodesize(_addr) }
        return size > 0;
    }


    /**
     * @dev Gets the token name
     * @return string representing the token name
     */
    function name(ERC721Data storage self) external view returns (string) {
        return self.name_;
    }

    /**
     * @dev Gets the token symbol
     * @return string representing the token symbol
     */
    function symbol(ERC721Data storage self) external view returns (string) {
        return self.symbol_;
    }

    /**
     * @dev Returns an URI for a given token ID
     * Throws if the token ID does not exist. May return an empty string.
     * @param _tokenId uint256 ID of the token to query
     */
    function tokenURI(ERC721Data storage self, uint256 _tokenId) external view returns (string) {
        require(exists(self, _tokenId));
        return self.tokenURIs[_tokenId];
    }

    /**
     * @dev Gets the token ID at a given index of the tokens list of the requested owner
     * @param _owner address owning the tokens list to be accessed
     * @param _index uint256 representing the index to be accessed of the requested tokens list
     * @return uint256 token ID at the given index of the tokens list owned by the requested address
     */
    function tokenOfOwnerByIndex(
        ERC721Data storage self,
        address _owner,
        uint256 _index
    ) external view returns (uint256) {
        require(_index < balanceOf(self, _owner));
        return self.ownedTokens[_owner][_index];
    }

    /**
     * @dev Gets the total amount of tokens stored by the contract
     * @return uint256 representing the total amount of tokens
     */
    function totalSupply(ERC721Data storage self) external view returns (uint256) {
        return self.allTokens.length;
    }

    /**
     * @dev Gets the token ID at a given index of all the tokens in this contract
     * Reverts if the index is greater or equal to the total number of tokens
     * @param _index uint256 representing the index to be accessed of the tokens list
     * @return uint256 token ID at the given index of the tokens list
     */
    function tokenByIndex(ERC721Data storage self, uint256 _index) external view returns (uint256) {
        require(_index < self.allTokens.length);
        return self.allTokens[_index];
    }

    /**
     * @dev Function to set the token URI for a given token
     * Reverts if the token ID does not exist
     * @param _tokenId uint256 ID of the token to set its URI
     * @param _uri string URI to assign
     */
    function setTokenURI(ERC721Data storage self, uint256 _tokenId, string _uri) external {
        require(exists(self, _tokenId));
        self.tokenURIs[_tokenId] = _uri;
    }

    /**
     * @dev Internal function to add a token ID to the list of a given address
     * @param _to address representing the new owner of the given token ID
     * @param _tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenTo(ERC721Data storage self, address _to, uint256 _tokenId) internal {
        require(self.tokenOwner[_tokenId] == address(0));
        self.tokenOwner[_tokenId] = _to;
        self.ownedTokensCount[_to] = self.ownedTokensCount[_to].add(1);

        uint256 length = self.ownedTokens[_to].length;
        self.ownedTokens[_to].push(_tokenId);
        self.ownedTokensIndex[_tokenId] = length;
    }

    /**
     * @dev Internal function to remove a token ID from the list of a given address
     * @param _from address representing the previous owner of the given token ID
     * @param _tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFrom(ERC721Data storage self, address _from, uint256 _tokenId) internal {
        require(ownerOf(self, _tokenId) == _from);
        self.ownedTokensCount[_from] = self.ownedTokensCount[_from].sub(1);
        self.tokenOwner[_tokenId] = address(0);

        // To prevent a gap in the array, we store the last token in the index of the token to delete, and
        // then delete the last slot.
        uint256 tokenIndex = self.ownedTokensIndex[_tokenId];
        uint256 lastTokenIndex = self.ownedTokens[_from].length.sub(1);
        uint256 lastToken = self.ownedTokens[_from][lastTokenIndex];

        self.ownedTokens[_from][tokenIndex] = lastToken;
        self.ownedTokens[_from].length--;
        // ^ This also deletes the contents at the last position of the array

        // Note that this will handle single-element arrays. In that case, both tokenIndex and lastTokenIndex are going to
        // be zero. Then we can make sure that we will remove _tokenId from the ownedTokens list since we are first swapping
        // the lastToken to the first position, and then dropping the element placed in the last position of the list

        self.ownedTokensIndex[_tokenId] = 0;
        self.ownedTokensIndex[lastToken] = tokenIndex;
    }

    /**
     * @dev Function to mint a new token
     * Reverts if the given token ID already exists
     * @param _to address the beneficiary that will own the minted token
     * @param _tokenId uint256 ID of the token to be minted by the msg.sender
     */
    function mint(ERC721Data storage self, address _to, uint256 _tokenId) external {
        require(_to != address(0));
        _addTokenTo(self, _to, _tokenId);
        emit Transfer(address(0), _to, _tokenId);

        self.allTokensIndex[_tokenId] = self.allTokens.length;
        self.allTokens.push(_tokenId);
    }

    /**
     * @dev Function to burn a specific token
     * Reverts if the token does not exist
     * @param _owner owner of the token to burn
     * @param _tokenId uint256 ID of the token being burned by the msg.sender
     */
    function burn(ERC721Data storage self, address _owner, uint256 _tokenId) external {
        _clearApproval(self, _owner, _tokenId);
        _removeTokenFrom(self, _owner, _tokenId);
        emit Transfer(_owner, address(0), _tokenId);

        // Clear metadata (if any)
        if (bytes(self.tokenURIs[_tokenId]).length != 0) {
            delete self.tokenURIs[_tokenId];
        }

        // Reorg all tokens array
        uint256 tokenIndex = self.allTokensIndex[_tokenId];
        uint256 lastTokenIndex = self.allTokens.length.sub(1);
        uint256 lastToken = self.allTokens[lastTokenIndex];

        self.allTokens[tokenIndex] = lastToken;
        self.allTokens[lastTokenIndex] = 0;

        self.allTokens.length--;
        self.allTokensIndex[_tokenId] = 0;
        self.allTokensIndex[lastToken] = tokenIndex;
    }

    /**
     * @dev Returns whether the given spender can transfer a given token ID
     * @param _spender address of the spender to query
     * @param _tokenId uint256 ID of the token to be transferred
     * @return bool whether the msg.sender is approved for the given token ID,
     *  is an operator of the owner, or is the owner of the token
     */
    function isApprovedOrOwner(
        ERC721Data storage self,
        address _spender,
        uint256 _tokenId
    ) public view returns (bool) {
        address owner = ownerOf(self, _tokenId);
        // Disable solium check because of
        // https://github.com/duaraghav8/Solium/issues/175
        // solium-disable-next-line operator-whitespace
        return (
            _spender == owner
            || getApproved(self, _tokenId) == _spender
            || isApprovedForAll(self, owner, _spender)
        );
    }

}
