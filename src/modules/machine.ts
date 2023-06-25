import { BottomBlade, TopBlade } from "./blades";

import { Blade } from "./blade";
import { MachineConfig } from "./machineConfig";
import paper from "paper";

const CLINE_COLOR = new paper.Color(1, 1, 1, 0.5);

export class Machine {
    isRunning: boolean = false;
    thickness: number = 3;
    depth: number = 52;
    currentStep: number = 0;
    stepCount: number = 200;
    intersects: () => void;
    topBlade: Blade;
    bottomBlade: Blade;
    constructor(config: MachineConfig, intersects: () => void) {
        this.thickness = config.thickness;
        this.intersects = intersects;
        this.depth = config.depth;
        this.topBlade = new TopBlade(config.topConfig, this);
        this.bottomBlade = new BottomBlade(config.bottomConfig, this);
    }
    step() {
        return 10000 / this.stepCount;
    }
    incrementStep() {
        this.currentStep += this.step();
        if (this.currentStep >= 10000) {
            this.currentStep = 0;
        }
    }
    drawCenterLines(scope: paper.PaperScope) {
        const hLine = new paper.Path([new paper.Point(0, scope.view.center.y), new paper.Point(scope.view.viewSize.width, scope.view.center.y)])
        const vLine = new paper.Path([new paper.Point(scope.view.center.x, 0), new paper.Point(scope.view.center.x, scope.view.size.height)])
        const lineGroup = new paper.Group([hLine, vLine]);
        lineGroup.strokeColor = CLINE_COLOR;
        lineGroup.strokeWidth = 1;
        lineGroup.dashArray = [15, 5, 2, 5];

    }
    update(event: any, scope: paper.PaperScope) {
        if (!this.isRunning)
            return;
        this.incrementStep()
        const topBladeLine = this.topBlade.update(this.currentStep, this.stepCount, scope)
        const bottomBladeLine = this.bottomBlade.update(this.currentStep, this.stepCount, scope)
        if (topBladeLine.intersects(bottomBladeLine)) {
            this.intersects();
        }
        topBladeLine.remove()
        bottomBladeLine.remove()
    }
    draw(scope: paper.PaperScope) {

        this.drawCenterLines(scope)
        this.topBlade.draw(scope)
        this.bottomBlade.draw(scope)
        scope.view.zoom = 2.4;
        scope.view.onFrame = (event: any) => {
            this.update(event, scope)
        };
    }

}