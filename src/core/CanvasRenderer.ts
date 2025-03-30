import { RenderComponent } from './component'
import type { MousePosition } from './type'
import { Renderer } from './Renderer'

export class CanvasRenderer  extends Renderer {

  private container:HTMLElement;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private isInited: boolean = false;
  private isClosed: boolean = false;
  public components: RenderComponent[] = [];
  public mousePosition:MousePosition = {
    x: 0,
    y: 0
  };
  public selectedComponent: RenderComponent | null = null;

  constructor(el: HTMLElement) {
    super();
    this.container = el;
    this.install()
  }

  public get position(): MousePosition {
    return this.mousePosition;
  }

  public install():void {
    if (!this.container) throw new Error("容器不存在！")
    // 鼠标信息
    this.mousePosition = {
      x: 0,
      y: 0
    }
    this.selectedComponent = null;
    this.init();
  }

  public addComponent(component: RenderComponent): void {
    console.log('新增组件', component)
    this.components.push(component);

  }

  private init() {
    if (!this.isInited) {
      this.initCanvas();
      // this.
      this.initBindMouseEvents();
      this.isInited = true;
      this.isClosed = false;
    }
  }

  private initCanvas() {
    const rect = this.container.getBoundingClientRect()
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.container.appendChild(this.canvas);
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.adjustForHighDPI()
  }

  private initBindMouseEvents() {
    if (!this.canvas) return
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  protected handleMouseDown(_e: MouseEvent) {
    this.handleComponetsOnMouseDown(_e);
    this.handleComponetOnMouseDown(_e);
    this.handleClickBlank();
  }
  private isClickBlank: boolean = false;
  protected handleClickBlank() {
    if (!this.selectedComponent) return
    const component = this.find((component) => {
      const isInside = component.isInside(this.mousePosition.x, this.mousePosition.y);
      if (component.dragComponent) {
        return component.dragComponent.isInside(this.mousePosition.x, this.mousePosition.y) || isInside
      }
      return isInside;
    }) as RenderComponent;
    this.isClickBlank = !component
  }

  protected handleComponetsOnMouseDown(_e: MouseEvent){
    this.selectedComponent?.onMouseDown(this, _e)
  }

  protected mouseOffsetX: number = 0;
  protected mouseOffsetY: number = 0;
  protected mouseOffsetWidth: number = 0;
  protected mouseOffsetHeight: number = 0;
  protected handleComponetOnMouseDown(_e: MouseEvent) {
    const component = this.find((component) => component.isInside(this.mousePosition.x, this.mousePosition.y)) as RenderComponent;
    if (!component) return
    this.clearSelectedComponent();
    if (!component.isMouseDown) {
      component.isMouseDown = true;
      component.isSelected = true;
      this.selectedComponent = component;
      this.mouseOffsetX = this.mousePosition.x - component.x;
      this.mouseOffsetY = this.mousePosition.y - component.y;
      this.mouseOffsetWidth = component.width;
      this.mouseOffsetHeight = component.height;
      this.canvas!.style.cursor = component.defaultCursor;
      this.emit('selected', component)
    }
  }

  protected handleMouseUp(_e: MouseEvent) {
    this.handleComponetsOnMouseUp(_e);
    // 
    this.handleSelectedComponentOnMouseUp(_e);
    // 点击空白区域清空选中
    this.handleClearSelectedComponent();
  }

  protected handleClearSelectedComponent() {
    if (this.isClickBlank) {
      this.clearSelectedComponent()
      this.isClickBlank = false;
    }
  }

  protected handleSelectedComponentOnMouseUp(_e: MouseEvent) {
    if (!this.selectedComponent) return
    this.selectedComponent.isMouseDown = false
    this.handleComponetOnHover(_e)
  }

  protected handleComponetsOnMouseUp(_e: MouseEvent) {
    this.selectedComponent?.onMouseUp(this, _e)
  }


  protected handleMouseMove(e: MouseEvent) {
    this.setMousePosition(e);
    this.handleComponetsOnMouseMove(e);
    this.handleComponetOnHover(e);
    this.handleComponetOnMoving();
  }

  protected handleComponetsOnMouseMove(e: MouseEvent) {
    this.selectedComponent?.onMouseMove(this, e)
  }

  public forEach(handle: (component: RenderComponent) => void) {
    for (let i = this.components.length - 1; i >= 0 ; i--) {
      const component = this.components[i];
      handle(component);
    }
  }

  public find(filter: (component: RenderComponent) => boolean) {
    for (let i = this.components.length - 1; i >= 0 ; i--) {
      const component = this.components[i];
      if (filter(component)) {
        return component;
      }
    }
    return null;
  }

  protected handleComponetOnHover(_e: MouseEvent) {
    if (this.selectedComponent && this.selectedComponent.isMouseDown) return
    const rectangle = this.find((component) => component.isInside(this.mousePosition.x, this.mousePosition.y) && component.enableHover) as RenderComponent;
    if (!rectangle) {
      if (!this.selectedComponent) {
        this.canvas!.style.cursor = 'default';
      }
      return
    }
    this.canvas!.style.cursor = rectangle.hoverCursor;
  }

  protected handleComponetOnMoving() {
    if (!this.selectedComponent || !this.selectedComponent.isMouseDown || !this.selectedComponent.enableMove) return
    const rectangle = this.selectedComponent;
    if (!rectangle) return
    let startX = this.mousePosition.x - this.mouseOffsetX;
    let startY =this. mousePosition.y - this.mouseOffsetY;
    if (this.mousePosition.x - this.mouseOffsetX < 0) {
      startX = 0;
    }
    if (this.mousePosition.y - this.mouseOffsetY < 0) {
      startY = 0;
    }
    if (this.mousePosition.x - this.mouseOffsetX  + this.mouseOffsetWidth > this.canvas!.width) {
      startX = this.canvas!.width - this.mouseOffsetWidth;
    }
    if (this.mousePosition.y - this.mouseOffsetY  + this.mouseOffsetHeight >  this.canvas!.height) {
      startY = this.canvas!.height - this.mouseOffsetHeight;
    }
    rectangle.startX = startX;
    rectangle.startY = startY;
    rectangle.endX = startX + this.mouseOffsetWidth;
    rectangle.endY = startY + this.mouseOffsetHeight;
    this.emit('move', rectangle)
  }

  protected handleMouseLeave(_e: MouseEvent) {
    this.clearMousePosition()
    this.handleSelectedComponentOnMouseUp(_e)
  }

  protected clearSelectedComponent() {
    if (!this.selectedComponent) return
    this.selectedComponent.isSelected = false;
    this.selectedComponent = null
    this.emit('un-selected', null as any)
  }

  public clean() {
    // 清空组件
    this.components.length = 0;
  }

  protected clearCanvas() {
    if (!this.canvas || !this.ctx) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  protected renderMousePosition() {
    if (!this.canvas || !this.ctx) return
    this.ctx.strokeStyle = '#000'
    const info = `(${this.mousePosition.x},${this.mousePosition.y})`;
    this.ctx.beginPath()
    this.ctx.strokeText(info, this.canvas.width - this.ctx.measureText(info).width - 10,
    this.canvas.height - 10)
  }

  protected renderComponents() {
    if (!this.canvas || !this.ctx) return
    this.components.forEach((component) => {
      component.render(this.ctx!);
    });
  }

  public render() {
    // 清除画板
    this.clearCanvas();
    // 绘制组件
    this.renderComponents();
    // 绘制鼠标位置信息
    this.renderMousePosition();
    // 请求下一帧
    if (this.isClosed) return;
    requestAnimationFrame(this.render.bind(this));
  }

  public uninstall(): void {
    if (!this.isInited) return
    if (this.container && this.canvas) {
      this.container.removeChild(this.canvas)
    }
    this.isClosed = true;
    this.isInited = false
  }

  private adjustForHighDPI() {
    if (!this.canvas || !this.ctx) return
    const rect = this.canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio;
    this.canvas.width = rect.width * ratio;
    this.canvas.height = rect.height * ratio;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(ratio, ratio);
  }

  protected getMousePosition(e: MouseEvent) {
    const canvas =  this.canvas!;
    const rect = canvas.getBoundingClientRect();
      return {
          x: Math.round((e.clientX - rect.left) * (canvas.width / rect.width / window.devicePixelRatio)),
          y: Math.round((e.clientY - rect.top) * (canvas.height / rect.height / window.devicePixelRatio))
      };
  }

  // 设置鼠标位置信息
  protected setMousePosition(e: MouseEvent) {
    const { x,y } = this.getMousePosition(e)
    this.mousePosition.x = x;
    this.mousePosition.y = y;
  }
  // 清除鼠标位置信息
  protected clearMousePosition() {
    this.mousePosition.x = 0;
    this.mousePosition.y = 0;
  }


}
