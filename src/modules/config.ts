
export class ConfigStep {
    index: number;
    step: number;
    value: number;
    constructor(index: number, step: number,
        value: number) {
        this.index = index;
        this.step = step;
        this.value = value;
    }
}
export class Config {
    value: number = 0;
    steps: Array<ConfigStep> = [];
    constructor() {
        for (let index = 0; index < 10; index++) {
            const step = new ConfigStep(index + 1, (index + 1) * 1000 - 1, 0)
            this.steps.push(step);
        }
    }

    getNearestSteps(step: number): [fromStep: ConfigStep, toStep?: ConfigStep] {
        const activeSteps = this.steps.filter((step) => step.step || step.step == 0);
        if (activeSteps[0].step >= step) {
            return [activeSteps[0], undefined]
        }
        for (let index = 0; index < activeSteps.length; index++) {
            const currentStep = activeSteps[index];
            if (currentStep.step === step) {
                return [currentStep, undefined]
            }
            if (index < activeSteps.length - 1 && currentStep.step < step && activeSteps[index + 1].step > step) {
                return [currentStep, activeSteps[index + 1]]
            }
        }
        return [this.steps[this.steps.length - 1], undefined]
    }

    getValue(step: number): number {
        let steps = this.getNearestSteps(step);
        if (steps[1] === undefined || steps[0].value === steps[1].value) {
            this.value = steps[0].value;
            return this.value;
        }
        const stepDifference = steps[1].step - steps[0].step;
        const valueDifference = steps[1].value - steps[0].value;
        const currentDifference = step - steps[0].step;
        this.value = steps[0].value + currentDifference * valueDifference / stepDifference;
        return this.value;
    }
}