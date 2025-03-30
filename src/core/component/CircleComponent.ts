import { RenderComponent } from './RenderComponent'
import { DragSquareComponent } from './DragSquareComponent'

export class CircleComponent extends RenderComponent {
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

  public render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const radius = (this.endX - this.startX) / 2
    ctx.arc(this.startX + radius, this.startY + radius, radius, 0, Math.PI * 2);
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

  public isInside(x: number, y: number): boolean {
    const radius = (this.endX - this.startX) / 2
    return Math.hypot(x - (this.startX + radius), y - (this.startY + radius)) <= radius;
  }

  protected doSetWidth(val: number): void {
    this._endX = this._startX + val;
    this._endY = this._startY + val;
  }

  protected doSetHiehgt(val: number): void {
    this._endX = this._startX + val;
    this._endY = this._startY + val;
  }

}
