<script setup lang="ts">
import { inject, ShallowRef, onMounted, onUnmounted, ref } from "vue";
import Map from "ol/Map";
import { FullScreen as FullScreenIcon } from "@element-plus/icons-vue";
import { FullScreen, defaults as defaultControls } from "ol/control";

let olMap = inject<ShallowRef<Map>>("olMap");
let ctl: null | FullScreen = null;
const el = ref();
onMounted(() => {
  ctl = new FullScreen({
    tipLabel: "切换全屏",
    target: el.value,
    className: "full-ctl",
    source: olMap!.value.getTargetElement().parentElement!,
  });
  olMap?.value.addControl(ctl);
});
onUnmounted(() => {
  if (ctl && olMap) {
    olMap.value.removeControl(ctl);
  }
});
</script>

<style lang="scss" scoped>
.map-full-screen {
  position: absolute;
  z-index: 1000;
  height: 40px;
  width: 40px;
  right: 10px;
  bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>

<style lang="scss">
.full-ctl {
  height: 100%;
  width: 100%;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 26px;
    background-color: rgba(255, 255, 255, 0.8);
    color: #000;
    cursor: pointer;
  }
}
.dark .full-ctl button {
  background-color: rgba(36, 47, 55, 0.8);
  color: #fff;
}
</style>

<template>
  <div class="map-full-screen" ref="el">&nbsp;</div>
</template>
