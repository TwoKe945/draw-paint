import { RenderComponent } from './RenderComponent'
import { DrageScaleComponent } from './DrageScaleComponent'

export class ImageComponent extends RenderComponent {
  constructor(
    private _image: HTMLImageElement,
    _startX: number,
    _startY: number,
    public color: string = '#000',
    public isFill: boolean = false
  ) {
    super(_startX, _startY, Math.round(_startX + 200), Math.round(_startY + 200 * _image.height / _image.width));
    this.dragComponent = new DrageScaleComponent(this, _image.height / _image.width);
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
