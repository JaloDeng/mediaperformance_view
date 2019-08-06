<template>
  <el-dialog width="60%" title="添加" :visible.sync="dialogVisible" :before-close="closeDialog" append-to-body center>
    <el-form :model="article" ref="saveForm">
      <el-row type="flex">
        <el-col :span="12">
          <el-row type="flex">
            <el-form-item label="文章类型"  label-width="120px">
              <el-select v-model="article.newsType" placeholder="请选择" size="mini" class="input_width">
                <el-option v-for="item in selectNewsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="作者" label-width="120px">
              <el-input v-model="article.author" size="mini" class="input_width"></el-input>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="素材" label-width="120px">
              <el-select v-model="article.newsTransferId" placeholder="请选择" size="mini" class="input_width" @change="changeNewsTransferId">
                <el-option v-for="item in article.selectNewsTransferId" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="等级分" label-width="120px">
              <el-select v-model="article.articleScoreRecord.scoreId" placeholder="请选择" size="mini" :popper-append-to-body="false" class="select-uplift-height input_width" @change="changeEditScoreId">
                <el-option v-for="item in selectScore" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="分数" label-width="120px">
              <el-input type="number" v-model="article.articleScoreRecord.score" size="mini" :readonly="banEditScore" class="input_width"></el-input>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="备注" label-width="120px">
              <el-input v-model="article.articleScoreRecord.remark" type="textarea" rows="5" size="mini" placeholder="请输入备注" class="input_width"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <iframe :src="article.url" frameborder="0" width="100%" height="500px"></iframe>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="success" @click="save()">保存</el-button>
      <el-button size="mini" @click="closeDialog()">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      banEditScore: true
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeAddView')
    },
    changeEditScoreId (scoreId) {
      if (scoreId === '手动打分') {
        this.banEditScore = false
        this.article.articleScoreRecord.score = ''
      } else {
        var scores = this.selectScore
        for (let x = 0; x < scores.length; x++) {
          const element = scores[x]
          if (element.value === scoreId) {
            this.article.articleScoreRecord.score = element.score
            break
          }
        }
        this.banEditScore = true
      }
    },
    changeNewsTransferId (newsTransferId) {
      this.article.url = 'http://59.38.110.226:8086/ycAppService/preview.do?id=' + newsTransferId
    },
    save () {
      var _this = this
      if (!this.article.newsTransferId || this.article.newsTransferId === '') {
        this.$message('请选择素材')
        return
      }
      this.putRequest('/article', _this.article).then(resp => {
        this.closeDialog()
      })
    }
  },
  props: {
    article: Object,
    dialogVisible: Boolean,
    selectNewsType: Array,
    selectScore: Array
  }
}
</script>

<style>
</style>
