pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

import "./ERC721Manager.sol";

/**
 * @title ERC721Token
 *
 * @dev This token interfaces with the OpenZepellin's ERC721 implementation (as of 7/31/2018) as
 * an external library, in order to keep contract sizes smaller.  Intended for use with the
 * ERC721Manager.sol, also provided.
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
contract ERC721Token is ERC165, ERC721 {

    ERC721Manager.ERC721Data internal erc721Data;

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


    constructor(string _name, string _symbol) public {
        ERC721Manager.initialize(erc721Data, _name, _symbol);
    }

    function supportsInterface(bytes4 _interfaceId) external view returns (bool) {
        return ERC721Manager.supportsInterface(erc721Data, _interfaceId);
    }

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ERC721Manager.balanceOf(erc721Data, _owner);
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return ERC721Manager.ownerOf(erc721Data, _tokenId);
    }

    function exists(uint256 _tokenId) public view returns (bool _exists) {
        return ERC721Manager.exists(erc721Data, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        ERC721Manager.approve(erc721Data, _to, _tokenId);
    }

    function getApproved(uint256 _tokenId) public view returns (address _operator) {
        return ERC721Manager.getApproved(erc721Data, _tokenId);
    }

    function setApprovalForAll(address _to, bool _approved) public {
        ERC721Manager.setApprovalForAll(erc721Data, _to, _approved);
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
        return ERC721Manager.isApprovedForAll(erc721Data, _owner, _operator);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        ERC721Manager.transferFrom(erc721Data, _from, _to, _tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
        ERC721Manager.safeTransferFrom(erc721Data, _from, _to, _tokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes _data
    ) public {
        ERC721Manager.safeTransferFrom(erc721Data, _from, _to, _tokenId, _data);
    }


    function totalSupply() public view returns (uint256) {
        return ERC721Manager.totalSupply(erc721Data);
    }

    function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256 _tokenId) {
        return ERC721Manager.tokenOfOwnerByIndex(erc721Data, _owner, _index);
    }

    function tokenByIndex(uint256 _index) public view returns (uint256) {
        return ERC721Manager.tokenByIndex(erc721Data, _index);
    }

    function name() external view returns (string _name) {
        return erc721Data.name_;
    }

    function symbol() external view returns (string _symbol) {
        return erc721Data.symbol_;
    }

    function tokenURI(uint256 _tokenId) public view returns (string) {
        return ERC721Manager.tokenURI(erc721Data, _tokenId);
    }


    function _mint(address _to, uint256 _tokenId) internal {
        ERC721Manager.mint(erc721Data, _to, _tokenId);
    }

    function _burn(address _owner, uint256 _tokenId) internal {
        ERC721Manager.burn(erc721Data, _owner, _tokenId);
    }

    function _setTokenURI(uint256 _tokenId, string _uri) internal {
        ERC721Manager.setTokenURI(erc721Data, _tokenId, _uri);
    }

    function isApprovedOrOwner(
        address _spender,
        uint256 _tokenId
    ) public view returns (bool) {
        return ERC721Manager.isApprovedOrOwner(erc721Data, _spender, _tokenId);
    }
}
