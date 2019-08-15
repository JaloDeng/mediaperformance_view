<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in $store.state.indexPaths" :key="item.name">{{ item.name }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
}
</script>

<style>
</style>
