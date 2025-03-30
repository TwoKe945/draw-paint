import { RenderComponent } from './RenderComponent'
import { DragRectangleComponent } from './DragRectangleComponent'

export class ImageComponent extends RenderComponent {
  private precent: number
  constructor(
    private _image: HTMLImageElement,
    _startX: number,
    _startY: number,
    _endX: number,
    _endY: number,
    public color: string = '#000',
    public isFill: boolean = false
  ) {
    super(_startX, _startY, _endX, _endY);
    this.dragComponent = new DragRectangleComponent(this);
    this.precent = this._image.width / this._image.height;
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.drawImage(this._image, this.startX, this.startY, this.width, this.height);
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
