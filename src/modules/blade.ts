import { BladeConfig } from "./machineConfig";
import { BottomBlade } from "./blades";
import { Config } from "./config";
import { Machine } from "./machine";
import paper from "paper";
const BLADE_COLOR = new paper.Color(1, 1, 1);
const POINT_COLOR = new paper.Color(1, 0.2, .2, 1.0);
const TRACE_COLOR = new paper.Color(1, 0.89, .27, 0.9);
const TEMP_COLOR = new paper.Color(1, 0.2, .2, 0.0);
interface IBlade {
    height: number;
    offset: number;
    position: number;
    rotation: number;
    rotateGroup?: paper.Group;
    slideGroup?: paper.Group;
    zeroPoint?: paper.Point;
    previousAngle: number;
    previousPosition: number;
    positionConfig: Config;
    rotationConfig: Config;
    machine: Machine;
    mark?: paper.Path;
    draw(scope: paper.PaperScope): void;
    update(step: number, stepCount: number, scope: paper.PaperScope): void;
    rotate(): void;
    slide(): void;
}
export class Blade implements IBlade {
    height: number = 46;
    offset: number = 16.5;
    position: number = 0;
    rotation: number = 0;
    previousAngle: number = 0;
    previousPosition: number = 0;
    rotateGroup?: paper.Group;
    slideGroup?: paper.Group;
    zeroPoint?: paper.Point;
    positionConfig: Config;
    rotationConfig: Config;
    machine: Machine;
    mark?: paper.Path;

    constructor(config: BladeConfig, machine: Machine) {
        this.positionConfig = config.positionConfig;
        this.rotationConfig = config.rotationConfig;
        this.machine = machine;

    }
    drawBase() {
        const rect = new paper.Rectangle(
            new paper.Point(-this.offset, -this.offset),
            new paper.Size(this.offset * 2, this.offset * 2)
        );
        const p = new paper.Path.Rectangle(rect);
        p.strokeColor = BLADE_COLOR;
        const point = new paper.Path.Circle(new paper.Point(0, 0), 3);
        point.fillColor = BLADE_COLOR;
        return new paper.Group([p, point])
    }

    drawBounding() {
        const bounding = new paper.Rectangle(
            new paper.Point(-(this.offset + this.height + this.machine.thickness / 2), -(this.offset + this.height + this.machine.thickness / 2)),
            new paper.Size((this.offset + this.height + this.machine.thickness / 2) * 2, (this.offset + this.height + this.machine.thickness / 2) * 2)
        );
        const b = new paper.Path.Rectangle(bounding);
        b.strokeColor = TEMP_COLOR;
        return b;
    }
    isBottomBlade() {
        return this instanceof BottomBlade;
    }
    drawBlade() {
        const direction = this.isBottomBlade() ? -1 : 1;
        const blade = new paper.Path([new paper.Point(this.offset, direction * this.offset), new paper.Point(this.offset, direction * (this.offset + this.height))]);
        blade.strokeColor = BLADE_COLOR;
        return blade;
    }
    drawPoint() {
        const direction = this.isBottomBlade() ? -1 : 1;
        const point = new paper.Path.Circle(new paper.Point(this.offset, direction * (this.offset + this.height)), 2);
        point.fillColor = POINT_COLOR;
        return point;
    }
    draw(scope: paper.PaperScope): void { }
    rotate() {
        const delta = this.rotation - this.previousAngle;
        this.previousAngle = this.rotation;
        this.slideGroup?.rotate(delta, this.zeroPoint)
    }
    slide() {
        const depthRatio = this.machine.depth / 1000;
        let delta = this.position - this.previousPosition;
        if (this.isBottomBlade()) {
            delta *= -1;
        }
        this.previousPosition = this.position;
        this.slideGroup?.translate(new paper.Point(0, depthRatio * delta))
    }
    trace(scope: paper.PaperScope) {
        if (!this.mark) {
            this.mark = new paper.Path({
                strokeColor: TRACE_COLOR,
                strokeWidth: 1,
                strokeCap: 'round'
            });
        }
        const depthRatio = this.machine.depth / 1000;
        const direction = this.isBottomBlade() ? -1 : 1;
        const bladeCenter = new paper.Point(scope.view.center.x,
            scope.view.center.y - direction * (this.height + this.offset + this.machine.thickness - this.position * depthRatio))
        const bladeEnd = new paper.Point(bladeCenter.x + this.offset,
            bladeCenter.y + direction * (this.height + this.offset))

        this.mark.add(bladeEnd.rotate(this.rotation, bladeCenter))
    }
    bladeLine(scope: paper.PaperScope) {
        const depthRatio = this.machine.depth / 1000;
        const direction = this.isBottomBlade() ? -1 : 1;
        const bladeCenter = new paper.Point(scope.view.center.x,
            scope.view.center.y - direction * (this.height + this.offset + this.machine.thickness - this.position * depthRatio))
        const bladeStart = new paper.Point(bladeCenter.x + this.offset,
            bladeCenter.y - direction * (this.offset))
        const bladeEnd = new paper.Point(bladeCenter.x + this.offset,
            bladeCenter.y + direction * (this.height + this.offset))
        return new paper.Path([bladeStart.rotate(this.rotation, bladeCenter), bladeEnd.rotate(this.rotation, bladeCenter)])


    }
    update(step: number, stepCount: number, scope: paper.PaperScope): paper.Path {
        this.rotation = this.rotationConfig.getValue(step);
        this.position = this.positionConfig.getValue(step);

        this.rotate()
        this.slide()
        if (step % 5 == 0) {
            this.trace(scope)

        }

        if (this.mark && this.mark.length > stepCount + 5) {
            this.mark?.removeSegment(0)
        }
        return this.bladeLine(scope);
    }
}