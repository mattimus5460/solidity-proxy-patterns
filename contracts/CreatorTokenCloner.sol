pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract CreatorTokenCloner {
    address immutable tokenImplementation;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor() public {
        tokenImplementation = address(new ERC20PresetMinterPauserUpgradeable());
    }

    function createToken(string calldata name, string calldata symbol, uint256 initialSupply, address minterAddress) external returns (address) {
        address clone = Clones.clone(tokenImplementation);
        ERC20PresetMinterPauserUpgradeable newClone = ERC20PresetMinterPauserUpgradeable(clone);

        newClone.initialize(name, symbol);

        newClone.grantRole(MINTER_ROLE, minterAddress);
        newClone.grantRole(PAUSER_ROLE, minterAddress);

        return clone;
    }
}