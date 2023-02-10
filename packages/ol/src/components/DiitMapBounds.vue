<template>
  <div class="back-bounds map-tools-panel" @click="fitBounds">
    <el-icon size="24px"><MapLocation /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { inject, ShallowRef } from "vue";
import { Extent } from "ol/extent";
import { MapLocation } from "@element-plus/icons-vue";
import Map from "ol/Map";

const props = defineProps<{ bounds: Extent | null }>();
let olMap = inject<ShallowRef<Map>>("olMap");
function fitBounds() {
  if (props.bounds) olMap!.value.getView().fit(props.bounds);
}
</script>

<style lang="scss" scoped>
.back-bounds {
  height: 40px;
  width: 40px;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
