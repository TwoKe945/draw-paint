import { RenderComponent } from './RenderComponent'
import { DragSquareComponent } from './DragSquareComponent'

export class SquareComponent extends RenderComponent {
  constructor(
    _startX: number,
    _startY: number,
    _endX: number,
    _endY: number,
    public color: string = '#000',
    public isFill: boolean = false
  ) {
    super(_startX, _startY, _endX, _endY);
    this.dragComponent = new DragSquareComponent(this);
  }

  protected doSetWidth(val: number): void {
    this._endX = this._startX + val;
    this._endY = this._startY + val;
  }

  protected doSetHiehgt(val: number): void {
    this._endX = this._startX + val;
    this._endY = this._startY + val;
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
