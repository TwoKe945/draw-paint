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
  canvas.render();
  installed.value = true;
})


onUnmounted(() => {
  canvas?.uninstall()
  installed.value = false;
})

const factory:Map<ShapeType, () => RenderComponent> = new Map()

factory.set(ShapeType.CIRCLE, () => new CircleComponent(400, 400, 500, 500, '#00f', true))
factory.set(ShapeType.SQUARE, () => new SquareComponent(
  400, 400, 500, 500, '#f00', true))
factory.set(ShapeType.RECTANGLE, () => new RectangleComponent(400, 400, 500, 450, '#0f0', true))


function handleCreateShape(type: ShapeType) {
  const getter = factory.get(type)
  if (!getter) return
  canvas?.addComponent(getter())
}

function handleClear(){
  canvas?.clean()
}

// 卸载
function handleUninstall() {
  canvas?.uninstall()
  installed.value = false;
}

// 安装
function handleInstall() {
  canvas?.install();
  canvas?.render()
  installed.value = true;
}

const installed = ref(false)

</script>

<template>
  <div class="container">
    <el-affix :offset="0" style="pointer-events: none;">
      <el-card style="pointer-events: all;">
        <div style="display: flex;justify-content: center; gap: 10px; align-items: center;">
          <div title="长方形"><el-button link @click="handleCreateShape(ShapeType.RECTANGLE)" >
            <el-icon size="24">
              <IconArcticonsRectangleHorizontal />
            </el-icon>
          </el-button></div>
          <div title="正方形"><el-button link @click="handleCreateShape(ShapeType.SQUARE)" >
            <el-icon size="24">
              <IconArcticonsSquare />
            </el-icon>
          </el-button></div>
          <div title="圆形"><el-button link  @click="handleCreateShape(ShapeType.CIRCLE)" >
            <el-icon size="24">
              <IconArcticonsCircle />
            </el-icon>
          </el-button></div>
          <div title="清空"><el-button link @click="handleClear()" >
            <el-icon  size="24">
              <IconArcticonsNoxcleaner />
            </el-icon>
          </el-button></div>
          <div title="安装"><el-button link type="warning" @click="handleInstall()" :disabled="installed">
            <el-icon  size="24">
              <IconArcticonsWearInstaller />
            </el-icon>
          </el-button></div>
          <div title="卸载"><el-button link type="danger" @click="handleUninstall()" :disabled="!installed">
            <el-icon  size="24">
              <IconArcticonsMultiAppUninstaller />
            </el-icon>
          </el-button></div>
        </div>
      </el-card>
    </el-affix>
    <div class="draw-panel" ref="containerRef">
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  height: 100vh;
  width: 100vw;
}
.draw-panel {
  position: absolute;
  width: 100%;
  height: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
width
