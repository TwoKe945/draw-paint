import type { DragComponent } from "./DragComponent";
import type { MousePosition } from '../type'
import type { DragPointComponent } from "./DragPointComponent";
import type { Renderer } from "../Renderer";

export abstract class RenderComponent {
  public dragComponent?: DragComponent;
  private selectedDragPointComponent: DragPointComponent | null;
  constructor(
    private _startX: number,
    private _startY: number,
    private _endX: number,
    private _endY: number,
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
    if (this._endX - value <= 20) {
      this._startX = this._endX - 20;
      return;
    }
    this._startX = value;
  }

  public set startY(value: number) {
    if (this.endY - value <= 20) { 
      this._startY = this._endY - 20;
      return;
    }
    this._startY = value;
  }

  public set endX(value: number) {
    if (value - this._startX <= 20) {
      this._endX = this._startX + 20;
      return;
    }
    this._endX = value;
  }

  public set endY(value: number) {
    if (value - this._startY <= 20) { 
      this._endY = this._startY + 20;
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

  get y(): number {
    return this.startY;
  }

  get width(): number {
    return this.endX - this.startX;
  }

  get height(): number {
    return this.endY - this.startY;
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
