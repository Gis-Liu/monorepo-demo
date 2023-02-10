<template>
  <el-container class="base-layout">
    <el-header class="layout-header">
      <div class="logo">
        <img :src="require(`@/assets/logo-${theme}.png`)" alt="" />
        <span class="sys-name">样本闭环系统</span>
      </div>
      <div class="menu-wap">
        <SysMenu v-if="menuPosition === 'top'" mode="horizontal"></SysMenu>
      </div>
      <div class="user-config">
        <el-icon class="theme-toggle" size="16px" @click="toggleTheme()">
          <Sunny v-if="sysInfoStore.isDark" />
          <Moon v-else />
        </el-icon>
        <el-icon
          class="theme-toggle"
          size="16px"
          style="margin-left: 10px"
          @click="changeMenuPosition()"
        >
          <Tools></Tools>
        </el-icon>
        <el-avatar style="margin-left: 20px" :icon="UserFilled" />
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <span class="user-name">admin Gis</span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userCenter">
                用户中心
              </el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container class="layout-body">
      <el-aside v-if="menuPosition === 'aside'" class="layout-aside">
        <SysMenu mode="vertical"></SysMenu>
      </el-aside>
      <el-main style="padding: 0">
        <div id="container" style="height: 100%">
          <RouterView v-slot="{ Component }">
            <keep-alive :include="keepAliveComponentNames">
              <component :is="Component" :key="$route.fullPath" />
            </keep-alive>
          </RouterView>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import SysMenu from "./sys-menu.vue";
import {
  Sunny,
  Moon,
  Tools,
  UserFilled,
  ArrowDown,
} from "@element-plus/icons-vue";
import { useToggle, useSessionStorage } from "@vueuse/core";
import { useSysInfo } from "@/stores/sysInfo";

defineProps<{
  keepAliveComponentNames: string[];
}>();

const sysInfoStore = useSysInfo();
const theme = computed(() => (sysInfoStore.isDark ? "dark" : "light"));
function toggleTheme() {
  sysInfoStore.toggleTheme();
}
const menuPosition = useSessionStorage("user-perfer-menupotion", "top");
const changeMenuPosition = useToggle(menuPosition, {
  truthyValue: "top",
  falsyValue: "aside",
});

function handleCommand(cmd: "userCenter" | "logout") {
  if (cmd === "userCenter") {
    console.log("用户中心");
  } else if (cmd === "logout") {
    console.log("退出登录");
  }
}
</script>

<style lang="scss" scoped>
div {
  box-sizing: border-box;
}

.logo {
  line-height: 42px;
  display: flex;
  align-items: flex-start;

  img {
    height: 32px;
  }
  .sys-name {
    font-size: 20px;
    font-weight: 700;
    margin-left: 10px;
  }
}
.menu-wap {
  flex: 1;
}
.user-config {
  width: 200px;
  display: flex;
  align-items: center;
  margin-left: 10px;
  .user-name {
    font-size: 16px;
    margin-left: 5px;
    display: inline-block;
    width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.layout-header {
  display: flex;
  --diit-header-height: 50px;
  align-items: center;
  border-bottom: solid 1px var(--primary-border-color);
}

.layout-body {
  height: calc(100vh - 50px);
}
.layout-aside {
  border-right: solid 1px var(--primary-border-color);
}

::v-deep(.base-menu) {
  border-right: none;
  border-bottom: none;
}
.theme-toggle {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: var(--sys-btn-bg-color);
  cursor: pointer;
}
</style>
