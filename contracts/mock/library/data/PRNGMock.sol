pragma solidity >=0.4.21 <0.6.0;

import "../../../library/data/PRNG.sol";

contract PRNGMock {

    PRNG.Data private seed;

    constructor() public {
        seed.s0 = uint64(now);
        seed.s1 = uint64(msg.sender);
    }

    function next() external {
        PRNG.next(seed);
    }

    function get() external view returns (uint64) {
        return uint64(seed.s0 + seed.s1);
    }
}
