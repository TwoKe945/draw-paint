import type { MousePosition } from '../type';
import { RenderComponent } from './RenderComponent'
export const DEFAULT_DRAG_COLOR = '#067BEF'

export enum DragCursorType {
  LEFT_OR_RIGHT = 'ew-resize',
  TOP_OR_BOTTOM = 'ns-resize',
  NONE = 'default',
  RIGHT_TOP_OR_LEFT_BOTTOM = 'nesw-resize',
  LEFT_TOP_OR_RIGHT_BOTTOM = 'nwse-resize'
}

export class DragPointComponent extends RenderComponent {
  render(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.getStartX(), this.getStartY(), this.getEndX() - this.getStartX(), this.getEndY() - this.getStartY());
    ctx.fillStyle = '#fff'
    ctx.fill();
    ctx.closePath();
    if (this.isFill || this.isSelected) {
      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
    ctx.closePath();
  }

  isInside(x: number, y: number): boolean {
    return x >= this.getStartX() && x <= this.getEndX() && y >= this.getStartY() && y <= this.getEndY();
  }

  constructor(
    public getStartX: () => number,
    public getStartY: () => number,
    public getEndX: () => number,
    public getEndY: () => number,
    public cursor: DragCursorType = DragCursorType.NONE,
    private handler: (_position: MousePosition, _e: MouseEvent) => void,
    public hoverColor: string = DEFAULT_DRAG_COLOR,
    public color: string = DEFAULT_DRAG_COLOR,
    public isFill: boolean = false
  ) {
    super(getStartX(), getStartY(), getEndX(), getEndY());
  }

  public handle(_position: MousePosition, _e: MouseEvent): void {
    this.handler.bind(this)(_position, _e);
  }
}
