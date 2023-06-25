import * as _chai from 'chai';

import { Config, ConfigStep } from "../src/modules/config"

import { assert } from 'chai';

let config: Config;
let config2: Config;
describe("Config Values Tests", () => {
    beforeAll(() => {
        config = new Config()
        config.steps = [
            new ConfigStep(0, 0, 0),
            new ConfigStep(1, 5000, 1000),
            new ConfigStep(2, 9999, 100),
        ]
        config2 = new Config()
        config2.steps = [
            new ConfigStep(0, 1, 10),
            new ConfigStep(1, 2500, 5),
            new ConfigStep(2, 3000, 0),
            new ConfigStep(3, 7500, 0),
            new ConfigStep(4, 8000, 40),
            new ConfigStep(5, 9999, 10),
        ]
    });
    it("Returns 0 if step below 0", () => {
        const value = config.getValue(-1);
        assert.equal(value, 0);
    });
    it("Returns 100 if step above 9999", () => {
        const value = config.getValue(11111);
        assert.equal(value, 100);
    });

    it("Returns 500 if step 2500", () => {
        const value = config.getValue(2500);
        assert.equal(value, 500);
    });

    it("Returns 550 if step 7500", () => {
        const value = config.getValue(7500);
        assert.equal(Math.round(value), 550);
    });
    it("Returns 40 if step 8000", () => {
        const value = config2.getValue(8000);
        assert.equal(Math.round(value), 40);
    });
    it("Returns 32 if step 7900", () => {
        const value = config2.getValue(7900);
        assert.equal(Math.round(value), 32);
    });
});