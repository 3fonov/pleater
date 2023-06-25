import * as _chai from 'chai';

import { Config, ConfigStep } from "../src/modules/config"

import { assert } from 'chai';

let config: Config;
describe("Config Steps Tests", () => {
    beforeAll(() => {
        config = new Config()
        config.steps = [
            new ConfigStep(0, 0, 0),
            new ConfigStep(1, 5000, 1000),
            new ConfigStep(2, 9999, 0),
        ]
    });


    it("Returns same value when first given", () => {
        let selectedValue = config.getNearestSteps(0);
        assert.equal(0, selectedValue[0].value)
        assert.equal(0, selectedValue[0].step)
        assert.equal(0, selectedValue[0].index)
        assert.isUndefined(selectedValue[1])
    })
    it("Returns same value when second given", () => {
        let selectedValue = config.getNearestSteps(5000);
        assert.equal(1000, selectedValue[0].value)
        assert.equal(5000, selectedValue[0].step)
        assert.equal(1, selectedValue[0].index)
        assert.isUndefined(selectedValue[1])
    })
    it("Returns same value when last given", () => {
        let selectedValue = config.getNearestSteps(9999);
        assert.equal(0, selectedValue[0].value)
        assert.equal(9999, selectedValue[0].step)
        assert.equal(2, selectedValue[0].index)
        assert.isUndefined(selectedValue[1])
    })
    it("Returns both when middle", () => {
        let selectedValue = config.getNearestSteps(1000);
        assert.equal(0, selectedValue[0].value)
        assert.equal(1000, selectedValue[1].value)
    })
});
// @suite class ConfigModuleTest {
//     private SUT: Config;

//     before() {
//         this.SUT = new Config("Test config");
//     }
//     @test 'Config is created'() {
//         expect(this.SUT.name).equal('Test config')
//     }
// }