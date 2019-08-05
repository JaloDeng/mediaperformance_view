<template>
  <el-dialog width="30%" title="新闻预览" :visible.sync="dialogVisible" :before-close="closeDialog" append-to-body center>
    <el-row type="flex">
      <el-col :span="24">
        <iframe :src="url" frameborder="0" width="100%" height="500px"></iframe>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  methods: {
    closeDialog () {
      this.$emit('closeNewsPreview')
    }
  },
  props: {
    dialogVisible: Boolean,
    url: String
  }
}
</script>

<style>
</style>
