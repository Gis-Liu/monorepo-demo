<template>
  <div class="split-bar" :style="leftStyle"></div>
  <input
    type="range"
    :max="100"
    :min="0"
    v-model="range"
    class="diit-sbs-range"
    @input="handleChange"
  />
</template>
<script lang="ts" setup>
import {
  onMounted,
  ref,
  inject,
  ShallowRef,
  computed,
  withDefaults,
  watch,
  triggerRef,
  onUnmounted,
} from "vue";
import Map from "ol/Map";
import Layer from "ol/layer/Layer";
import { getRenderPixel } from "ol/render";

type Props = {
  leftLayers: Layer[];
  rightLayers: Layer[];
};
const props = withDefaults(defineProps<Props>(), {
  leftLayers: () => [],
  rightLayers: () => [],
});

const padding = 20; //滑块的大小是40px，所以padding为 40/2,后续的计算中都要用到
const olMap = inject<ShallowRef<Map>>("olMap");
const range = ref(50);
const left = computed(() => {
  if (olMap) {
    const mapSize = olMap.value.getSize()!;
    return (mapSize[0] - padding * 2) * (range.value / 100) + padding;
  } else {
    return 0;
  }
});
const leftStyle = computed(() => ({ left: left.value + "px" }));

olMap?.value.on("change:size", () => triggerRef(range));

const handlePrerender = function (event: any, right: boolean) {
  const ctx = event.context;
  const mapSize = olMap!.value.getSize()!;
  const width = left.value;
  const t = 0;
  const l = right ? width : 0;
  const b = mapSize[1];
  const r = right ? mapSize[0] : width;
  const tl = getRenderPixel(event, [l, t]);
  const tr = getRenderPixel(event, [r, t]);
  const bl = getRenderPixel(event, [l, b]);
  const br = getRenderPixel(event, [r, b]);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tl[0], tl[1]);
  ctx.lineTo(bl[0], bl[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(tr[0], tr[1]);
  ctx.closePath();
  ctx.clip();
};

const handlePrerenderLeft = (event: any) => handlePrerender(event, false);
const handlePrerenderRight = (event: any) => handlePrerender(event, true);

const handlePostrender = function (event: any) {
  const ctx = event.context as any;
  ctx.restore();
};

function layersAddEvent(layers: Layer[], right: boolean, destory = false) {
  layers
    .filter((r) => !!r)
    .forEach((layer) => {
      layer.un("prerender", handlePrerenderRight);
      layer.un("prerender", handlePrerenderLeft);
      layer.un("postrender", handlePostrender);
    });
  if (!destory) {
    layers
      .filter((r) => !!r)
      .forEach((layer) => {
        if (right) {
          layer.on("prerender", handlePrerenderRight);
        } else {
          layer.on("prerender", handlePrerenderLeft);
        }
        layer.on("postrender", handlePostrender);
      });
  }
}

function handleChange() {
  olMap?.value.render();
}

onMounted(() => {
  olMap?.value.render();
});

onUnmounted(() => {
  layersAddEvent(props.leftLayers, false, true);
  layersAddEvent(props.rightLayers, true, true);
  handleChange();
});

watch(
  [() => props.leftLayers, () => props.rightLayers],
  () => {
    layersAddEvent(props.leftLayers, false);
    layersAddEvent(props.rightLayers, true);
    olMap?.value.render();
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.split-bar {
  position: absolute;
  z-index: 20;
  height: 100%;
  width: 1px;
  left: 400px;
  background-color: #ddd;
}
</style>

<style scoped>
.diit-sbs-range {
  -webkit-appearance: none;
  display: inline-block !important;
  vertical-align: middle;
  height: 0;
  padding: 0;
  margin: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.25);
  min-width: 100px;
  cursor: pointer;
  pointer-events: none;
  z-index: 999;
}
.diit-sbs-range::-ms-fill-upper {
  background: transparent;
}
.diit-sbs-range::-ms-fill-lower {
  background: rgba(255, 255, 255, 0.25);
}
/* Browser thingies */

.diit-sbs-range::-moz-range-track {
  opacity: 0;
}
.diit-sbs-range::-ms-track {
  opacity: 0;
}
.diit-sbs-range::-ms-tooltip {
  display: none;
}
/* For whatever reason, these need to be defined
 * on their own so dont group them */

.diit-sbs-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
  background: #fff;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: ew-resize;
  pointer-events: auto;
  border: 1px solid #ddd;
  background-image: url(../assets/swipe-btn.png);
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 40px 40px;
}
.diit-sbs-range::-ms-thumb {
  margin: 0;
  padding: 0;
  background: #fff;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: ew-resize;
  pointer-events: auto;
  border: 1px solid #ddd;
  background-image: url(../assets/swipe-btn.png);
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 40px 40px;
}
.diit-sbs-range::-moz-range-thumb {
  padding: 0;
  right: 0;
  background: #fff;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: ew-resize;
  pointer-events: auto;
  border: 1px solid #ddd;
  background-image: url(../assets/swipe-btn.png);
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 40px 40px;
}
.diit-sbs-range:disabled::-moz-range-thumb {
  cursor: default;
}
.diit-sbs-range:disabled::-ms-thumb {
  cursor: default;
}
.diit-sbs-range:disabled::-webkit-slider-thumb {
  cursor: default;
}
.diit-sbs-range:disabled {
  cursor: default;
}
.diit-sbs-range:focus {
  outline: none !important;
}
.diit-sbs-range::-moz-focus-outer {
  border: 0;
}

.diit-sbs-range {
  position: absolute;
  top: 50%;
  width: 100%;
  z-index: 999;
}
</style>
