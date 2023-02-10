<template>
  <div class="map-wrap">
    <div class="ol-map" ref="mapEl"></div>
    <slot v-if="olMap"></slot>
  </div>
</template>

<script lang="ts" setup>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import {
  onMounted,
  provide,
  shallowRef,
  onBeforeMount,
  ref,
  inject,
  watch,
  nextTick,
  unref,
} from "vue";
import { getBaseLayer } from "../layers/baseLayer";

type BaseLayerType = "img" | "vec";
type Props = {
  defaultBaseLayerType?: BaseLayerType;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: "map-init", map: Map): void;
}>();

const mapEl = ref();
const olMap = shallowRef<Map | null>(null);
provide("olMap", olMap);

// const bodySize = inject("bodySize");
// watch(
//   () => bodySize,
//   () => nextTick(() => olMap.value?.updateSize()),
//   { deep: true }
// );

const baseLayerType = ref(
  props.defaultBaseLayerType ?? window.ENV.defaultBaseLayer
);
let baseLayer = getBaseLayer(baseLayerType.value);
const changeBaseLayer = (type: BaseLayerType) => {
  const map = unref(olMap);
  if (map !== null) {
    baseLayerType.value = type;
    baseLayer.forEach((l) => map.removeLayer(l));
    baseLayer = getBaseLayer(type);
    baseLayer.forEach((l, i) => {
      map.addLayer(l);
      l.setZIndex(-1);
    });
  }
};
provide("baseLayerType", baseLayerType);
provide("mapMethods", { changeBaseLayer });

onMounted(() => {
  const map = new Map({
    layers: baseLayer,
    target: mapEl.value,
    view: new View({
      center: [12700365.3627596, 3472154.39951391],
      zoom: 12,
      constrainResolution: true,
    }),
    controls: [],
  });
  olMap.value = map;
  map.on("click", () => {
    const zoom = map.getView().getZoom();
    console.log(zoom);
  });
  emit("map-init", map);
});

onBeforeMount(() => (olMap.value = null));
</script>

<style lang="scss" scoped>
.ol-map {
  height: 100%;
  width: 100%;
  position: absolute;
}

.map-wrap {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>

<style lang="scss">
@use "element-plus/theme-chalk/src/mixins/function" as *;

.map-tools-panel {
  position: absolute;
  z-index: 10;
  border-radius: 4px;
  box-shadow: getCssVar(box-shadow-lighter);
}

.dark {
  .map-tools-panel {
    background-color: rgba(#242f37, 0.8);
  }
}

.light {
  .map-tools-panel {
    background-color: rgba(#fff, 0.8);
  }
}
</style>
