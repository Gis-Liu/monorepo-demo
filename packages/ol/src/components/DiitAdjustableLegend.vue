<template>
  <div class="legned map-tools-panel">
    <div class="title">图例</div>
    <div class="group">
      <div
        v-for="(item, index) in legends"
        :key="item.name"
        class="legend-item"
      >
        <el-checkbox
          v-if="showCheckbox"
          v-model="item.checked"
          :true-label="true"
          :false-label="false"
        ></el-checkbox>
        <span
          class="block"
          :style="getStyle(item)"
          @click="openAdjustDlg(item, index)"
        ></span>
        <span class="name">{{ item.name }}</span>
      </div>
      <slot name="default"></slot>
    </div>
  </div>
  <el-dialog :title="form?.name + '样式调整'" v-model="visible" width="260px">
    <el-form v-if="form" :model="form" label-width="85px" label-suffix="：">
      <el-form-item label="是否填充">
        <el-radio-group v-model="form.fill">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="边框颜色">
        <el-color-picker show-alpha color-format="hex" v-model="form.color" />
      </el-form-item>
      <el-form-item label="填充颜色">
        <el-color-picker
          show-alpha
          color-format="hex"
          v-model="form.fillColor"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align: center">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="change()">确 认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { LegendItem } from "@/api/model/olMapModel";
import { ElMessage } from "element-plus";
import { computed, ref, withDefaults } from "vue";

interface Props {
  modelValue: LegendItem[];
  showCheckbox?: boolean;
}

interface Emits {
  (
    e: "update:modelValue",
    selected: { name: string; color: string; fill: boolean }[]
  ): void;
  (
    e: "change",
    selected: { name: string; color: string; fill: boolean }[]
  ): void;
}

const props = withDefaults(defineProps<Props>(), { showCheckbox: true });

const emit = defineEmits<Emits>();

function getStyle(item: LegendItem) {
  return {
    border: "solid thin " + item.color,
    backgroundColor: item.fill ? item.fillColor || item.color : "transparent",
  };
}

const legends = computed({
  get() {
    return props.modelValue;
  },
  set(val: LegendItem[]) {
    emit("update:modelValue", val);
    emit("change", val);
  },
});

const form = ref<LegendItem>();
const active = ref<number>();
const visible = ref(false);
function openAdjustDlg(item: LegendItem, index: number) {
  if (item.readonly) {
    ElMessage.warning(item.name + "样式不可修改");
    return;
  }
  active.value = index;
  form.value = {
    checked: item.checked,
    name: item.name,
    color: item.color,
    fill: item.fill,
    fillColor: item.fillColor || item.color,
  };
  visible.value = true;
}
function change() {
  legends.value[active.value!] = form.value as LegendItem;
  visible.value = false;
}
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
    margin-left: 5px;
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
    align-items: center;
    font-size: 14px;
    & + .legend-item {
      margin-top: 10px;
    }
  }
}
</style>
