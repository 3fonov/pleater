import { Config } from "./config";

export class BladeConfig {
    positionConfig: Config = new Config();
    rotationConfig: Config = new Config();
}
export class MachineConfig {
    thickness: number = 5;
    depth: number = 52;
    topConfig: BladeConfig = new BladeConfig();
    bottomConfig: BladeConfig = new BladeConfig();
}