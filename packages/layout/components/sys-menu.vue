<template>
  <div :class="['nav-bar-' + mode, 'sys-menu', backgroundImg]">
    <div v-if="mode !== 'vertical'" style="flex: 1" />
    <el-menu
      :default-active="activeIndex"
      class="sys-menu"
      :collapse="isCollapse"
      :mode="mode"
      :ellipsis="false"
      :collapse-transition="false"
      @select="handleSelect"
    >
      <template v-for="group in menus" :key="group.title">
        <el-menu-item v-if="!group.children" :index="group.route">
          <el-icon>
            <Location />
          </el-icon>
          <span>{{ group.title }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="group.route">
          <template #title>
            <el-icon><Location /></el-icon>
            <span>{{ group.title }}</span>
          </template>
          <el-menu-item
            v-for="item in group.children"
            :key="item.title"
            :index="item.route"
          >
            <span class="menu-child-item">
              {{ item.title }}
            </span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
    <div v-if="mode === 'vertical'" style="flex: 1" />
    <div v-if="mode === 'vertical'" class="collapse-btn-part">
      <el-icon
        class="collapse-btn"
        :class="{ isCollapse }"
        size="16px"
        @click="toggleIsCollapse()"
      >
        <Expand />
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, toRef, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Expand, Location } from "@element-plus/icons-vue";
import { useToggle, useCssVar } from "@vueuse/core";
import { useSysInfo } from "@/stores/sysInfo";

const sysInfoStore = useSysInfo();

defineProps({
  mode: { type: String },
});

const router = useRouter();
const route = useRoute();
const menus = toRef(sysInfoStore, "menus");

const [isCollapse, toggleIsCollapse] = useToggle(false, {
  truthyValue: true,
  falsyValue: false,
});

const backgroundImg = computed(() => {
  const index =
    menus.value.findIndex((r) => {
      return (
        r.route === activeIndex.value ||
        (r.children &&
          r.children.find((m: any) => m.route === activeIndex.value))
      );
    }) % 5;
  return `menu-bg-${index + 1}`;
});

const asideWidth = useCssVar(
  "--diit-aside-width",
  document.querySelector("html")
);

watch(isCollapse, (val) => (asideWidth.value = val ? "48px" : "240px"), {
  immediate: true,
});

const activeIndex = computed(() => route.meta.menuPath);
const handleSelect = (val: string) => {
  router.push(val);
};
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/mixins/function" as *;
.nav-bar-vertical {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
  #{getCssVarName(menu-base-level-padding)}: 12px;
  #{getCssVarName(menu-bg-color)}: transparent;
  #{getCssVarName(menu-item-height)}: 40px;
  .diit-menu--vertical {
    border-right-color: transparent;

    .diit-sub-menu + .diit-sub-menu {
      margin-top: 8px;
    }
    &.diit-menu--collapse {
      .is-active {
        .diit-sub-menu__title {
          #{getCssVar(-menu-active-color)}: #fff;
        }
      }
    }

    .diit-menu-item.is-active {
      .menu-child-item {
        &::before {
          background-image: linear-gradient(
            0deg,
            var(--sub-menu-line) 0,
            var(--sub-menu-line) 30%,
            getCssVar(menu-active-color) 30%,
            getCssVar(menu-active-color) 70%,
            var(--sub-menu-line) 70%,
            var(--sub-menu-line)
          );
        }
      }
    }
  }

  .menu-child-item {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      display: inline-block;
      width: 1px;
      height: getCssVar(menu-sub-item-height);
      margin-right: 6px;
      background: var(--sub-menu-line);
    }
  }
  ::v-deep(.is-active .diit-sub-menu__title) {
    border-right: solid 2px getCssVar(menu-active-color);
  }
}

.nav-bar-horizontal {
  display: flex;
  flex-direction: row;
  #{getCssVarName(menu, item, height)}: 46px;
  .diit-menu--horizontal {
    border-bottom-color: transparent;
  }
}
.collapse-btn-part {
  border-top: solid thin var(--primary-border-color);
  padding: 4px;
  text-align: right;
  padding-right: 10px;

  .collapse-btn {
    transform: scale(-1, 1);
    background: var(--sys-btn-bg-color);
    border-radius: 2px;
    height: 28px;
    width: 28px;
    cursor: pointer;
  }
  .isCollapse {
    transform: scale(1, 1);
  }
}

.light {
  .nav-bar-vertical.sys-menu {
    background-color: rgb(241, 242, 246);
    --sub-menu-line: #00000010;
  }
}

.dark {
  .nav-bar-vertical.sys-menu {
    --sub-menu-line: #ffffff10;
    background-color: #19232a;
  }
}

.nav-bar-vertical.sys-menu {
  background-repeat: no-repeat;
  background-position: 50% 100%;
}

.menu-bg-1 {
  background-image: url("@/assets/menus/m-bg-1.png");
}
.menu-bg-2 {
  background-image: url("@/assets/menus/m-bg-2.png");
}
.menu-bg-3 {
  background-image: url("@/assets/menus/m-bg-3.png");
}
.menu-bg-4 {
  background-image: url("@/assets/menus/m-bg-4.png");
}
.menu-bg-5 {
  background-image: url("@/assets/menus/m-bg-5.png");
}
</style>
