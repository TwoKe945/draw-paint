<script setup lang="ts">
// import ContextMenu from '@imengyu/vue3-context-menu';
import { RectangleComponent, CircleComponent, SquareComponent, CanvasRenderer, RenderComponent } from './core'
const containerRef = ref<HTMLDivElement>()
enum ShapeType {
  CIRCLE,
  RECTANGLE,
  SQUARE
}
let canvas:CanvasRenderer|null = null;

onMounted(() => {
  if (!containerRef.value) return
  canvas = new CanvasRenderer(containerRef.value!);
  canvas.addComponent(new RectangleComponent(100, 100, 200, 200, '#00f', true));
  canvas.addComponent(new SquareComponent(100, 100, 200, 200, '#f00', true));
  canvas.addComponent(new CircleComponent(100, 100, 200, 200, '#0f0', true));
  canvas.render();

})

const factory:Map<ShapeType, () => RenderComponent> = new Map()

factory.set(ShapeType.CIRCLE, () => new CircleComponent(100, 100, 200, 200))
factory.set(ShapeType.RECTANGLE, () => new SquareComponent(100, 100, 200, 200))
factory.set(ShapeType.RECTANGLE, () => new RectangleComponent(100, 100, 200, 200))


function handleCreateShape(type: ShapeType) {
  const getter = factory.get(type)
  if (!getter) return
  canvas?.addComponent(getter())
}

</script>

<template>
  <div class="container">
    <el-affix :offset="120" style="pointer-events: none;">
      <el-card style="max-width: 100px; pointer-events: all;">
        <div style="display: flex; flex-direction: column;justify-content: center;gap: 10px; align-items: center;">
          <div><el-button @click="handleCreateShape(ShapeType.RECTANGLE)" >长方形</el-button></div>
          <div><el-button @click="handleCreateShape(ShapeType.SQUARE)" >正方向</el-button></div>
          <div><el-button @click="handleCreateShape(ShapeType.CIRCLE)" >圆形</el-button></div>
        </div>
      </el-card>
    </el-affix>
    <div class="draw-panel" ref="containerRef">
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.draw-panel {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background-color: #fff;
  background-size: 20px 20px;
  background-image: 
  linear-gradient(to right, rgb(203 213 225) 1px, transparent 1px),
  linear-gradient(to bottom, rgb(203 213 225) 1px,transparent 1px)
  ;
  /* background-size: 20px 20px;
  background-image: 
  radial-gradient(circle, rgb(203 213 225) 2px, #fff 2px); */
}
</style>
