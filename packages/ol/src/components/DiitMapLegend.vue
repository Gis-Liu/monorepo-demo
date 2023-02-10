<template>
  <div class="legned map-tools-panel">
    <div class="title">图例</div>
    <div class="group">
      <el-checkbox-group v-if="showCheckBox" v-model="selected">
        <div v-for="item in legends" :key="item.name">
          <el-checkbox :label="item.name">
            <span class="block" :style="{ backgroundColor: item.color }"></span>
            <span class="name">{{ item.name }}</span>
          </el-checkbox>
        </div>
      </el-checkbox-group>
      <template v-else>
        <div v-for="item in legends" :key="item.name" class="legend-item">
          <span
            class="block"
            :style="{
              backgroundColor: item.fill ? item.color : 'transparent',
              border: `solid 2px ${item.color}`,
            }"
          ></span>
          <span class="name">{{ item.name }}</span>
        </div>
      </template>
      <slot name="default"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, withDefaults } from "vue";

interface Props {
  modelValue: string[];
  legends: { name: string; color: string; fill: boolean }[];
  showCheckBox?: boolean;
}

interface Emits {
  (e: "update:modelValue", selected: string[]): void;
  (e: "change", selected: string[]): void;
}

const props = withDefaults(defineProps<Props>(), { showCheckBox: true });

const emit = defineEmits<Emits>();

const selected = computed({
  get() {
    return props.modelValue;
  },
  set(selected: string[]) {
    emit("update:modelValue", selected);
    emit("change", selected);
  },
});
</script>
<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/mixins/function" as *;

::v-deep(.#{$namespace}-checkbox__label) {
  display: inline-flex;
  align-items: center;
}

.legned {
  min-width: 180px;

  left: 10px;
  bottom: 10px;
  padding: 0 4px;

  .title {
    border-bottom: solid 1px getCssVar(border-color-darker);
    padding: 10px 0 5px 0;
    text-align: center;
  }
  .group {
    padding: 10px 16px;
  }
  .block {
    height: 16px;
    width: 24px;
    display: inline-block;
    box-sizing: border-box;
  }
  .name {
    line-height: 16px;
    margin-left: 10px;
    color: getCssVar(text-color-primary);
  }
  .legend-item {
    display: flex;
    font-size: 14px;
    & + .legend-item {
      margin-top: 10px;
    }
  }
}
</style>
