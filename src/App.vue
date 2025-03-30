<script setup lang="ts">
// import ContextMenu from '@imengyu/vue3-context-menu';
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const locale = ref(zhCn)


import { RectangleComponent, CircleComponent, SquareComponent, CanvasRenderer, RenderComponent } from './core'
const containerRef = ref<HTMLDivElement>()
enum ShapeType {
  CIRCLE,
  RECTANGLE,
  SQUARE
}
let canvas:CanvasRenderer|null = null;

const selectedComponent = ref<RenderComponent>({} as any)

onMounted(() => {
  if (!containerRef.value) return
  canvas = new CanvasRenderer(containerRef.value!);

  canvas.on('selected', (e) => {
    selectedComponent.value = e
  })
  canvas.on('move', (e) => {
    selectedComponent.value!.startX = e.startX;
    selectedComponent.value!.startY = e.startY;
    selectedComponent.value!.endX = e.endX;
    selectedComponent.value!.endY = e.endY;
  })
  canvas.on('resize', (e) => {
    selectedComponent.value!.startX = e.startX;
    selectedComponent.value!.startY = e.startY;
    selectedComponent.value!.endX = e.endX;
    selectedComponent.value!.endY = e.endY;
  })
  canvas.on('un-selected', () => {
    selectedComponent.value = {} as any
  })
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

const isOpenProperties = ref(false)
const isVisibleProperties = ref(false)
function handleToggleMenu() {
  isOpenProperties.value = !isOpenProperties.value;
}
function handlePropertiesTransitionEnd() {
  if (!isOpenProperties.value) {
    isVisibleProperties.value = false
  } else {
    isVisibleProperties.value = true
  }
}

</script>

<template>
  <el-config-provider :locale="locale">
    <div class="container">
      <el-affix :offset="0" :z-index="9999" style="pointer-events: none;">
        <el-card style="pointer-events: all;">
          <div  style="display: flex;justify-content:space-between; align-items: center;">
            <div></div>
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
            <div>
              <el-button :class="{
                'menu-switch': true,
                active: isOpenProperties
              }" link @click="handleToggleMenu()">
                <el-icon size="24">
                  <IconArcticonsHamburgerMenu />
                </el-icon>
              </el-button>
            </div>
          </div>
        </el-card>
      </el-affix>
      <div class="draw-panel" ref="containerRef"></div>
      <div class="shape-properties"
        :class="{
          'is-open': isOpenProperties,
          'is-moving': isVisibleProperties
        }"
        @transitionend="handlePropertiesTransitionEnd"
      >
        <el-form  :disabled="Object.keys(selectedComponent).length === 0" size="small">
          <el-divider content-position="left">布局</el-divider>
          <el-row :gutter="24" style="padding: 0px 20px;">
            <el-col :md="12">
              <el-form-item>
                <el-input-number controls-position="right" v-model="selectedComponent.x" >
                  <template #suffix>X</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item>
                <el-input-number controls-position="right"  v-model="selectedComponent.y" >
                  <template #suffix>Y</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item>
                <el-input-number controls-position="right" v-model="selectedComponent.width" >
                  <template #suffix>W</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item>
                <el-input-number controls-position="right" v-model="selectedComponent.height" >
                  <template #suffix>H</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">填充</el-divider>
          <el-row :gutter="24" style="padding: 0px 20px;">
            <el-col :md="24">
              <el-form-item  label="颜色"  label-width="40px">
                <el-color-picker  show-alpha v-model="(selectedComponent as any).color" />
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item label="填充" label-width="40px">
                <el-checkbox  v-model="(selectedComponent as any).isFill" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </el-config-provider>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .menu-switch {
    &.active {
      background-color: #eee;
    }
  }
  .shape-properties {
    --properties-width: 200px;
    position: absolute;
    z-index: 999;
    background-color: #fff;
    border-left: 1px solid #eee;
    border-top: 1px solid #eee;
    inset-block: 56px 0px;
    inset-inline-end: 0px;
    width: var(--properties-width);
    transition-duration: 200ms;
    transition-property: inset-inline-end;
    transition-timing-function: ease;
    inset-inline-end: calc(var(--properties-width) * -1);
    &.is-open {
      inset-inline-end: 0px;
    }
    &:is(.is-open, .is-moving) {
      visibility: visible;
    }
    :deep(.el-col) {
      padding: 0px 2px !important;
    }
  }
}

.draw-panel {
  position: absolute;
  width: 100%;
  height: calc(100% - 56px);
  top: 56px;
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
width
