pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/presets/ERC721PresetMinterPauserAutoIdUpgradeable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";

contract ERC721Cloner {
    address immutable beaconAddress;

    address[] public allClonedContracts;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor() public {
        beaconAddress = address(new UpgradeableBeacon(address(new ERC721PresetMinterPauserAutoIdUpgradeable())));
    }

    function createToken(string calldata name, string calldata symbol, string calldata baseTokenUri, address minterAddress) external returns (address) {

        BeaconProxy clone = new BeaconProxy(
            beaconAddress,
                abi.encodeWithSelector(ERC721PresetMinterPauserAutoIdUpgradeable.initialize.selector, name, symbol, baseTokenUri)
        );

        ERC721PresetMinterPauserAutoIdUpgradeable newClone = ERC721PresetMinterPauserAutoIdUpgradeable(address(clone));

        newClone.grantRole(MINTER_ROLE, minterAddress);
        newClone.grantRole(PAUSER_ROLE, minterAddress);

        allClonedContracts.push(address(clone));

        return address(clone);
    }
}