import * as _chai from 'chai';

import { Config, ConfigStep } from "../src/modules/config"

import { assert } from 'chai';

let config: Config;
describe("Config Values Tests", () => {
    beforeAll(() => {
        config = new Config()
        config.steps = [
            new ConfigStep(0, 0, 0),
            new ConfigStep(1, 5000, 1000),
            new ConfigStep(2, 9999, 100),
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
});