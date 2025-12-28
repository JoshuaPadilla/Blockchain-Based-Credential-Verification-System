// SPDX-License-Identifier: MIT

pragma solidity  0.8.19;

import {Script} from "../lib/forge-std/src/Script.sol";
import {CredentialVerifier} from "../src/CredentialVerifier.sol";
contract DeployCredentialVerifier is Script {
    function run() external returns (CredentialVerifier) {
        vm.startBroadcast();

        CredentialVerifier verifier = new CredentialVerifier();

        vm.stopBroadcast();

        return verifier;
    }
}