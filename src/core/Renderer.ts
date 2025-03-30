import { RenderComponent } from './component'
import type { MousePosition } from './type'
import Mitt,{type Emitter } from 'mitt'

type RenderEvents = {
  selected: RenderComponent;
  'un-selected': void,
  move: RenderComponent,
  resize: RenderComponent,
};

export abstract class Renderer {
  protected emitter:Emitter<RenderEvents>;

  constructor() {
    this.emitter = Mitt<RenderEvents>()
  }

  public abstract render(): void;
  public abstract uninstall(): void;
  public abstract install(): void;
  public abstract clean(): void;
  public abstract get position(): MousePosition;

  public on<K extends keyof RenderEvents>(event: K, handler: (data: RenderEvents[K]) => void): void {
    this.emitter.on(event as any, handler)
  }

  public off<K extends keyof RenderEvents>(event: K, handler: (data: RenderEvents[K]) => void): void {
    this.emitter.off(event as any, handler)
  }

  public emit<K extends keyof RenderEvents>(event: K, data: RenderEvents[K]) {
    this.emitter.emit(event, data as any);
  }
}

