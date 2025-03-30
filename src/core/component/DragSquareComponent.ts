import { DragComponent } from './DragComponent'
import { DragCursorType, DragPointComponent } from './DragPointComponent'

export class DragSquareComponent extends DragComponent {

  initDragPoints(): void {
    let distance = 0;
    this.dragPoints = [
      // 左上方
      new DragPointComponent(
        () => this.component.startX - this.dragPointSize,
        () => this.component.startY - this.dragPointSize,
        () => this.component.startX + this.dragPointSize,
        () => this.component.startY + this.dragPointSize,
        DragCursorType.LEFT_TOP_OR_RIGHT_BOTTOM,
        (renderer) => {
          this.component.startX = renderer.position.x;
          distance = this.component.startX - this.component.endX;
          this.component.startY = distance + this.component.endY;
        }
      ),
      // 左下方
      new DragPointComponent(
        () => this.component.startX - this.dragPointSize,
        () => this.component.endY - this.dragPointSize,
        () => this.component.startX + this.dragPointSize,
        () => this.component.endY + this.dragPointSize,
        DragCursorType.RIGHT_TOP_OR_LEFT_BOTTOM,
        (renderer) => {
          this.component.startX = renderer.position.x;
          distance = this.component.endX - this.component.startX;
          this.component.endY = this.component.startY + distance;
        }
      ),
      // 右上方
      new DragPointComponent(
        () => this.component.endX - this.dragPointSize,
        () => this.component.startY - this.dragPointSize,
        () => this.component.endX + this.dragPointSize,
        () => this.component.startY + this.dragPointSize,
        DragCursorType.RIGHT_TOP_OR_LEFT_BOTTOM,
        (renderer) => {
          this.component.endX = renderer.position.x;
          distance = this.component.endX - this.component.startX;
          this.component.startY = this.component.endY - distance;
        }
      ),
         // 右下方
      new DragPointComponent(
        () => this.component.endX - this.dragPointSize,
        () => this.component.endY - this.dragPointSize,
        () => this.component.endX + this.dragPointSize,
        () => this.component.endY + this.dragPointSize,
        DragCursorType.LEFT_TOP_OR_RIGHT_BOTTOM,
        (renderer) => {
          this.component.endX = renderer.position.x;
          distance = this.component.endX - this.component.startX;
          this.component.endY = this.component.startY + distance;
        }
      ),
      // 上方
      new DragPointComponent(
        () => this.component.startX + this.component.width / 2 - this.dragPointSize,
        () => this.component.startY - this.dragPointSize,
        () => this.component.startX + this.component.width / 2 + this.dragPointSize,
        () => this.component.startY + this.dragPointSize,
        DragCursorType.TOP_OR_BOTTOM,
        (renderer) => {
          this.component.startY = renderer.position.y;
          distance = this.component.endY - this.component.startY;
          this.component.endX = this.component.startX + distance;
        }
      ),
        // 下方
      new DragPointComponent(
        () => this.component.startX + this.component.width / 2 - this.dragPointSize,
        () => this.component.endY - this.dragPointSize,
        () => this.component.startX + this.component.width / 2 + this.dragPointSize,
        () => this.component.endY + this.dragPointSize,
        DragCursorType.TOP_OR_BOTTOM,
        (renderer) => {
          this.component.endY = renderer.position.y;
          distance = this.component.endY - this.component.startY;
          this.component.endX = this.component.startX + distance;
        }),
        // 左方
        new DragPointComponent(
          () => this.component.startX - this.dragPointSize,
          () => this.component.startY + this.component.height / 2 - this.dragPointSize,
          () => this.component.startX + this.dragPointSize,
          () => this.component.startY + this.component.height / 2 + this.dragPointSize,
          DragCursorType.LEFT_OR_RIGHT,
          (renderer) => {
            this.component.startX = renderer.position.x;
            distance = this.component.endX - this.component.startX;
            this.component.endY = this.component.startY + distance;
          }),
        // 右方
        new DragPointComponent(
        () => this.component.endX - this.dragPointSize,
        () => this.component.startY + this.component.height / 2  - this.dragPointSize,
        () => this.component.endX + this.dragPointSize,
        () => this.component.startY + this.component.height / 2  + this.dragPointSize,
        DragCursorType.LEFT_OR_RIGHT,
        (renderer) => {
          this.component.endX = renderer.position.x;
          distance = this.component.endX - this.component.startX;
          this.component.endY = this.component.startY + distance;
        }),
    ]

  }

}
