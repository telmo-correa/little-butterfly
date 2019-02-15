pragma solidity >=0.4.21 <0.6.0;

import "../../../library/data/EnumerableSetAddress.sol";

contract EnumerableSetAddressMock {

    EnumerableSetAddress.Data private self;

    function contains(address value) external view returns (bool) {
        return EnumerableSetAddress.contains(self, value);
    }

    function add(address value) external {
        EnumerableSetAddress.add(self, value);
    }

    function remove(address value) external {
        EnumerableSetAddress.remove(self, value);
    }

    function size() external view returns (uint160) {
        return EnumerableSetAddress.size(self);
    }

    function get(uint160 index) external view returns (address) {
        return EnumerableSetAddress.get(self, index);
    }

    function clear() external {
        EnumerableSetAddress.clear(self);
    }
}
