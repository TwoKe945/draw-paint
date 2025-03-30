import { DragComponent } from './DragComponent'
import { DragCursorType, DragPointComponent } from './DragPointComponent'

export class DragRectangleComponent extends DragComponent {


  initDragPoints(): void {
    this.dragPoints = [
      // 左上方
      new DragPointComponent(
        () => this.component.startX - this.dragPointSize,
        () => this.component.startY - this.dragPointSize,
        () => this.component.startX + this.dragPointSize,
        () => this.component.startY + this.dragPointSize,
        DragCursorType.LEFT_TOP_OR_RIGHT_BOTTOM,
        (position) => {
          this.component.startX = position.x;
          this.component.startY = position.y;
        }
      ),
      // 左下方
      new DragPointComponent(
        () => this.component.startX - this.dragPointSize,
        () => this.component.endY - this.dragPointSize,
        () => this.component.startX + this.dragPointSize,
        () => this.component.endY + this.dragPointSize,
        DragCursorType.RIGHT_TOP_OR_LEFT_BOTTOM,
        (position) => {
          this.component.endY = position.y;
          this.component.startX = position.x;
        }
      ),
      // 右上方
      new DragPointComponent(
        () => this.component.endX - this.dragPointSize,
        () => this.component.startY - this.dragPointSize,
        () => this.component.endX + this.dragPointSize,
        () => this.component.startY + this.dragPointSize,
        DragCursorType.RIGHT_TOP_OR_LEFT_BOTTOM,
        (position) => {
          this.component.endX = position.x;
          this.component.startY = position.y;
        }
      ),
         // 右下方
      new DragPointComponent(
        () => this.component.endX - this.dragPointSize,
        () => this.component.endY - this.dragPointSize,
        () => this.component.endX + this.dragPointSize,
        () => this.component.endY + this.dragPointSize,
        DragCursorType.LEFT_TOP_OR_RIGHT_BOTTOM,
        (position) => {
          this.component.endX = position.x;
          this.component.endY = position.y
        }
      ),
      // 上方
      new DragPointComponent(
        () => this.component.startX + this.component.width / 2 - this.dragPointSize,
        () => this.component.startY - this.dragPointSize,
        () => this.component.startX + this.component.width / 2 + this.dragPointSize,
        () => this.component.startY + this.dragPointSize,
        DragCursorType.TOP_OR_BOTTOM,
        (position) => {
          this.component.startY = position.y;
        }
      ),
        // 下方
      new DragPointComponent(
        () => this.component.startX + this.component.width / 2 - this.dragPointSize,
        () => this.component.endY - this.dragPointSize,
        () => this.component.startX + this.component.width / 2 + this.dragPointSize,
        () => this.component.endY + this.dragPointSize,
        DragCursorType.TOP_OR_BOTTOM,
        (position) => {
          this.component.endY = position.y
        }),
        // 左方
        new DragPointComponent(
          () => this.component.startX - this.dragPointSize,
          () => this.component.startY + this.component.height / 2 - this.dragPointSize,
          () => this.component.startX + this.dragPointSize,
          () => this.component.startY + this.component.height / 2 + this.dragPointSize,
          DragCursorType.LEFT_OR_RIGHT,
          (position) => {
            this.component.startX = position.x;
          }),
          // 右方
          new DragPointComponent(
          () => this.component.endX - this.dragPointSize,
          () => this.component.startY + this.component.height / 2  - this.dragPointSize,
          () => this.component.endX + this.dragPointSize,
          () => this.component.startY + this.component.height / 2  + this.dragPointSize,
          DragCursorType.LEFT_OR_RIGHT,
          (position) => {
            this.component.endX = position.x;
          }),
    ]

  }

}
