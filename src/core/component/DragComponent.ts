import { RenderComponent } from './RenderComponent'
import { DragPointComponent, DEFAULT_DRAG_COLOR } from './DragPointComponent'
export abstract class DragComponent extends RenderComponent {

  constructor(
    protected component: RenderComponent,
    public dragPoints: DragPointComponent[] = [],
    protected dragPointSize: number = 4
  ) {
    super(component.startX,
      component.startY,
      component.endX,
      component.endY);
    this.initDragPoints()
  }

  abstract initDragPoints(): void;

  render(ctx: CanvasRenderingContext2D): void {
    if (this.component.isMouseDown || this.component.isSelected) {
      ctx.save()
      ctx.beginPath();
      ctx.setLineDash([5,5])
      ctx.rect(this.component.x, this.component.y, this.component.width, this.component.height);
      ctx.strokeStyle = DEFAULT_DRAG_COLOR;
      ctx.stroke();
      ctx.closePath()
      ctx.restore();

      this.dragPoints.forEach(point => {
        point.render(ctx)
      })
    }
  }

  isInside(x: number, y: number): boolean {
    return !!this.dragPoints.find(point => point.isInside(x, y));
  }

  getDragPoint(x: number, y: number): DragPointComponent | null {
    return this.dragPoints.find(point => point.isInside(x, y)) || null;
  }

  

}
