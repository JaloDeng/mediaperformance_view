<template>
  <el-aside :width="asideWidth">
    <img src="@/assets/logo.png" width="60" height="60" @click="changeCollapse" style="cursor: pointer;">
    <h3 style="color: #fff" :hidden="isCollapse">新媒体绩效考核系统</h3>
    <el-menu router :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
      :collapse="isCollapse" style="text-align: left;" unique-opened collapse-transition>
      <template v-for="route in $router.options.routes">
        <el-menu-item v-if="!route.children && !route.hidden" :key="route.name" :index="route.path">
          <i :class="route.icon"></i>
          <span slot="title">{{ route.name }}</span>
        </el-menu-item>
        <el-submenu v-if="route.children && route.children.length && !route.hidden" :key="route.children.name" :index="route.path">
          <template slot="title">
            <i :class="route.icon"></i>
            <span slot="title">{{ route.name }}</span>
          </template>
          <el-menu-item v-for="item in route.children" :key="item.name" :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  methods: {
    changeCollapse () {
      this.$emit('changeCollapse')
    }
  },
  props: {
    asideWidth: String,
    isCollapse: Boolean
  }
}
</script>

<style>
.el-menu {
  border: 0px;
}
.el-aside {
  background-color: #545c64;
}
</style>
