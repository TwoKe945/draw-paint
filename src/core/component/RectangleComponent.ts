import { RenderComponent } from './RenderComponent'
import { DragRectangleComponent } from './DragRectangleComponent'

export class RectangleComponent extends RenderComponent {
  constructor(
    _startX: number,
    _startY: number,
    _endX: number,
    _endY: number,
    public color: string = '#000',
    public isFill: boolean = false
  ) {
    super(_startX, _startY, _endX, _endY);
    this.dragComponent = new DragRectangleComponent(this);
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.startX, this.startY, this.endX - this.startX, this.endY - this.startY);
    if (this.isFill) {
      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
    ctx.closePath();
    this.dragComponent && this.dragComponent.render(ctx)
    this.renderPostion(ctx)
  }

  isInside(x: number, y: number): boolean {
    return x >= this.startX && x <= this.endX && y >= this.startY && y <= this.endY;
  }
}
