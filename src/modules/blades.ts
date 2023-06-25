import { Blade } from "./blade";
import paper from "paper";

export class TopBlade extends Blade {


    draw(scope: paper.PaperScope) {
        const bounding = this.drawBounding();
        const base = this.drawBase();
        const blade = this.drawBlade();
        const point = this.drawPoint();
        this.rotateGroup = new paper.Group([base, blade, point]);
        this.rotateGroup.strokeWidth = 2;
        this.slideGroup = new paper.Group([this.rotateGroup, bounding])
        const groupOffset = (this.height + this.offset + this.machine.thickness)
        this.slideGroup.position = new paper.Point(scope.view.center.x, scope.view.center.y - groupOffset)
    }




}
export class BottomBlade extends Blade {

    draw(scope: paper.PaperScope) {
        const bounding = this.drawBounding();
        const base = this.drawBase();
        const blade = this.drawBlade();
        const point = this.drawPoint();
        this.rotateGroup = new paper.Group([base, blade, point]);
        this.rotateGroup.strokeWidth = 2;
        this.slideGroup = new paper.Group([this.rotateGroup, bounding])
        const groupOffset = (this.height + this.offset + this.machine.thickness)
        this.slideGroup.position = new paper.Point(scope.view.center.x, scope.view.center.y + groupOffset)
    }



}