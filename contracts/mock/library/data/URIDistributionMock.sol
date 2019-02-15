pragma solidity ^0.4.24;

import "../../../library/data/URIDistribution.sol";

contract URIDistributionMock {

    URIDistribution.Data private self;

    function addURI(uint16 weight, string uri) external {
        URIDistribution.addURI(self, weight, uri);
    }

    function getURI(uint64 seed) external view returns (string) {
        return URIDistribution.getURI(self, seed);
    }
}
