<template>
  <div class="back-bounds map-tools-panel">
    {{ zoomNum }}
  </div>
</template>

<script lang="ts" setup>
import { inject, ShallowRef, ref, onMounted, onUnmounted } from "vue";
import Map from "ol/Map";
import { ObjectEvent } from "ol/Object";

let olMap = inject<ShallowRef<Map>>("olMap");
const zoomNum = ref(0);
const setZoom = (e: ObjectEvent) =>
  (zoomNum.value = Math.round(e.target.getZoom()));
onMounted(() => {
  zoomNum.value = Math.round(olMap?.value.getView().getZoom() ?? 0);
  olMap?.value.getView().on("change:resolution", setZoom);
});
onUnmounted(() => {
  olMap?.value.getView().un("change:resolution", setZoom);
});
</script>

<style lang="scss" scoped>
.back-bounds {
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
