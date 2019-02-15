pragma solidity >=0.4.21 <0.6.0;

import "../../../library/data/EnumerableSet256.sol";

contract EnumerableSet256Mock {

    EnumerableSet256.Data private self;

    function contains(uint256 value) external view returns (bool) {
        return EnumerableSet256.contains(self, value);
    }

    function add(uint256 value) external {
        EnumerableSet256.add(self, value);
    }

    function remove(uint256 value) external {
        EnumerableSet256.remove(self, value);
    }

    function size() external view returns (uint256) {
        return EnumerableSet256.size(self);
    }

    function get(uint256 index) external view returns (uint256) {
        return EnumerableSet256.get(self, index);
    }

    function clear() external {
        EnumerableSet256.clear(self);
    }
}
