import type { DragComponent } from "./DragComponent";
import type { DragPointComponent } from "./DragPointComponent";
import type { Renderer } from "../renderer";


const MIN_WIDTH = 20;
const MIN_HEIGHT = 20;

export abstract class RenderComponent {
  public dragComponent?: DragComponent;
  private selectedDragPointComponent: DragPointComponent | null;
  constructor(
    protected _startX: number,
    protected _startY: number,
    protected _endX: number,
    protected _endY: number,
    public isMouseDown: boolean = false,
    public isSelected: boolean = false,
    public showComponentInfo: boolean = false,
    public enableHover: boolean = true,
    public enableMove: boolean = true,
    public hoverCursor: string = 'move',
    public defaultCursor: string = 'default'
  ) {

    this.selectedDragPointComponent = null;
  }

  public set startX(value: number) {
    if (this._endX - value <= MIN_WIDTH) {
      this._startX = this._endX - MIN_WIDTH;
      return;
    }
    this._startX = value;
  }

  public set startY(value: number) {
    if (this.endY - value <= MIN_HEIGHT) {
      this._startY = this._endY - MIN_HEIGHT;
      return;
    }
    this._startY = value;
  }

  public set endX(value: number) {
    if (value - this._startX <= MIN_WIDTH) {
      this._endX = this._startX + MIN_WIDTH;
      return;
    }
    this._endX = value;
  }

  public set endY(value: number) {
    if (value - this._startY <= MIN_HEIGHT) {
      this._endY = this._startY + MIN_HEIGHT;
      return;
    }
    this._endY = value;
  }

  public get startX(): number {
    return this._startX;
  }

  public get startY(): number {
    return this._startY;
  }

  public get endX(): number {
    return this._endX;
  }

  public get endY(): number {
    return this._endY;
  }




  get x(): number {
    return this.startX;
  }

  set x(val: number) {
    const distance = this._startX - this._endX;
    this._startX = val;
    this._endX = val - distance;
  }

  get y(): number {
    return this.startY;
  }

  set y(val: number) {
    const distance = this._startY - this._endY;
    this._startY = val;
    this._endY = val - distance;
  }

  get width(): number {
    return this.endX - this.startX;
  }

  set width(val: number) {
    if (val <= MIN_WIDTH) {
      val = MIN_WIDTH;
    }
    this.doSetWidth(val);
  }

  protected doSetWidth(val: number) {
    this._endX = this._startX + val;
  }

  protected doSetHiehgt(val: number) {
    this._endY = this._startY + val;
  }

  get height(): number {
    return this.endY - this.startY;
  }

  set height(val: number) {
    if (val <= MIN_HEIGHT) {
      val = MIN_HEIGHT;
    }
    this.doSetHiehgt(val);
  }


  abstract render(ctx: CanvasRenderingContext2D): void;
  abstract isInside(x: number, y: number): boolean;

  protected renderPostion(ctx: CanvasRenderingContext2D) {
    if (this.isMouseDown || this.showComponentInfo) {
      ctx.beginPath()
      const pos = `X:${this.x} Y:${this.y} W:${this.width} H: ${this.height}`;
      const width = ctx.measureText(pos).width
      ctx.strokeStyle = '#000'
      ctx.font = '12px Arial';
      ctx.strokeText(pos,
      this.x + (this.width - width - 20)  / 2 + 10,
      this.y + this.height + 30)
      ctx.stroke()
      ctx.closePath()
    }
  }
  public onMouseMove(_renderer: Renderer, _e: MouseEvent) {
    this.handleDragComponentOnHover(_renderer, _e)
    this.handleDragComponentOnMoving(_renderer, _e)
  }

  protected handleDragComponentOnHover(_renderer: Renderer, _e: MouseEvent) {
    if (this.selectedDragPointComponent && this.selectedDragPointComponent.isSelected) return
    if (!this.dragComponent) {
      (_e.target as HTMLCanvasElement).style.cursor = this.defaultCursor
      return;
    }
    const dragPoint = this.dragComponent.getDragPoint(_renderer.position.x, _renderer.position.y)
    if (!this.isSelected || !dragPoint) {
      this.dragComponent.dragPoints.forEach(item => {
        item.isFill = false;
      });
      this.enableHover = true;
      (_e.target as HTMLCanvasElement).style.cursor = this.defaultCursor
      return
    };
    this.enableHover = false;
    dragPoint.isFill = true;
    (_e.target as HTMLCanvasElement).style.cursor = dragPoint.cursor;
  }

  protected handleDragComponentOnMoving(_renderer: Renderer, _e: MouseEvent) {
    if (!this.dragComponent || !this.selectedDragPointComponent) {
      this.enableMove = true;
      this.showComponentInfo = false
      return;
    }
    this.enableMove = false;
    this.showComponentInfo = true
    this.selectedDragPointComponent.handle(_renderer, _e);
    _renderer.emit('resize', this)
  }

  public onMouseDown(_renderer: Renderer, _e: MouseEvent) {
    this.handleComponetOnMouseDown(_renderer, _e);
  }

  protected handleComponetOnMouseDown(_renderer: Renderer, _e: MouseEvent) {
    const dragPoint = this.dragComponent?.getDragPoint(_renderer.position.x, _renderer.position.y)
    if (!dragPoint) {
      return
    }
    this.selectedDragPointComponent = dragPoint;
    this.selectedDragPointComponent.isSelected = true
  }

  public onMouseUp(_renderer: Renderer, _e: MouseEvent) {
    if (!this.dragComponent || !this.selectedDragPointComponent) return
    this.enableMove = true;
    if (this.selectedDragPointComponent.isSelected) {
      (_e.target as HTMLCanvasElement).style.cursor = this.defaultCursor;
    }
    this.selectedDragPointComponent.isSelected = false
    this.selectedDragPointComponent = null;
    this.showComponentInfo = false
  }
}
