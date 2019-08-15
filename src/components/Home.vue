<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      <verticalNav :asideWidth="asideWidth" :isCollapse="isCollapse" v-on:changeCollapse="changeCollapse"></verticalNav>
      <el-container>
        <el-header>
          <horizontalNav :collapseIcon="collapseIcon"></horizontalNav>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import horizontalNav from '@/components/navigation/HorizontalNav'
import verticalNav from '@/components/navigation/VerticalNav'

export default {
  components: {
    horizontalNav,
    verticalNav
  },
  data () {
    return {
      asideWidth: '64px',
      collapseIcon: 'el-icon-s-unfold',
      isCollapse: true
    }
  },
  methods: {
    changeCollapse () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.collapseIcon = 'el-icon-s-unfold'
        this.asideWidth = '64px'
      } else {
        this.collapseIcon = 'el-icon-s-fold'
        this.asideWidth = '250px'
      }
    }
  }
}
</script>

<style>
.el-main {
  background-color: #f5f7f9;
}
.el-header {
  padding: 0px;
}
</style>
