<template>
  <div>
    <el-dialog :title="'编辑'" :close-on-click-modal="false" :visible.sync="outerDialogVisible" :before-close="closeEdit" width="80%" center>
      <newsPreview :dialogVisible="innerNewPreviewVisible" :url="article.url" v-on:closeNewsPreview="closeNewsPreview"></newsPreview>
      <el-form :model="article" ref="saveForm">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="类别"  label-width="120px">
              <el-select v-model="article.exportType" placeholder="请选择" size="mini" class="input_width">
                <el-option v-for="item in selectExportType" :key="item.value" :label="item.label" :value="item.value" :disabled="isDisabledEditArticle"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章类型"  label-width="120px">
              <el-select v-model="article.newsType" placeholder="请选择" size="mini" class="input_width">
                <el-option v-for="item in selectNewsType" :key="item.value" :label="item.label" :value="item.value" :disabled="isDisabledEditArticle"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="纸媒标题" label-width="120px">
              <el-input v-model="article.paperTitle" size="mini" placeholder="请输入纸媒标题" :readonly="isDisabledEditArticle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="APP标题" label-width="120px">
              <el-input v-model="article.appTitle" size="mini" placeholder="请输入APP标题" :readonly="isDisabledEditArticle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="作者" label-width="120px">
              <el-input v-model="article.author" size="mini" placeholder="请输入作者"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编辑" label-width="120px">
              <el-input v-model="article.editor" size="mini"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="纸媒发布时间" label-width="120px">
              <el-date-picker v-model="article.paperPublishTime" type="date" size="mini" placeholder="选择日期" value-format="yyyy-MM-dd"
                :readonly="isDisabledEditArticle" style="width: 200px;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="APP发布时间" label-width="120px">
              <el-date-picker v-model="article.appPublishTime" type="datetime" size="mini" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"
                :readonly="isDisabledEditArticle" style="width: 200px;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="字数" label-width="120px">
              <el-input type="number" v-model="article.wordCount" :min="0" size="mini" :readonly="isDisabledEditArticle" class="input_width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浏览量" label-width="120px">
              <el-input type="number" v-model="article.clickCount" size="mini" :readonly="isDisabledEditArticle" class="input_width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="链接" label-width="120px">
              <el-input v-model="article.url" size="mini" placeholder="请输入链接" :readonly="isDisabledEditArticle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :hidden="article.newsType === 'IMAGE' ? false : true">
            <el-form-item label="图片数量" label-width="120px">
              <el-input type="number" v-model="article.articleScoreRecord.imageCount" size="mini" class="input_width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="等级分" label-width="120px">
              <el-select v-model="article.articleScoreRecord.scoreId" placeholder="请选择" size="mini" :popper-append-to-body="false" class="select-uplift-height input_width" @change="changeEditScoreId">
                <el-option v-for="item in selectScore" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" label-width="120px">
              <el-input type="number" v-model="article.articleScoreRecord.score" size="mini" :readonly="banEditScore" class="input_width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="分数占比" label-width="120px">
              <el-button size="mini" type="primary" @click="addScoreRecordAuthorRow(article.articleScoreRecordAuthors)">添加</el-button>
              <el-table :data="article.articleScoreRecordAuthors" size="mini" border>
                <el-table-column align="center" width="50" label="序号" type="index"></el-table-column>
                <el-table-column align="center" prop="author" label="作者">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.author"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="percent" label="占比(%)">
                  <template slot-scope="scope">
                    <el-input style="width: 50%" size="mini" v-model="scope.row.percent" max="100" min="0"></el-input> %
                  </template>
                </el-table-column>
                <el-table-column align="center" label="分数" :formatter="formatAuthorScore"></el-table-column>
                <el-table-column align="center" width="150" label="操作" fixed="right">
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="delScoreRecordAuthorRow(scope.$index, article.articleScoreRecordAuthors)" size="mini" type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" label-width="120px">
              <el-input v-model="article.articleScoreRecord.remark" type="textarea" rows="5" size="mini" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="warning" @click="innerNewPreviewVisible = true">预览</el-button>
        <el-button size="mini" type="success" @click="showAddView()">添加素材</el-button>
        <el-button size="mini" type="primary" @click="save('saveForm')">保存</el-button>
        <el-button size="mini" @click="closeEdit">取消</el-button>
      </span>
    </el-dialog>
    <articleAdd :article="newArticle" :dialogVisible="addVisible" :selectNewsType="selectNewsType" :selectScore="selectScore" v-on:closeAddView="closeAddView"></articleAdd>
  </div>
</template>

<script>
import newsPreview from '@/components/dialog/NewsPreview'
import articleAdd from '@/components/dialog/ArticleAdd'

export default {
  components: {
    newsPreview,
    articleAdd
  },
  data () {
    return {
      newArticle: {
        id: '',
        parentId: '',
        exportType: '',
        newsType: '',
        newsSourceId: '',
        newsTransferId: '',
        newsTransferIds: '',
        paperPublishTime: '',
        appPublishTime: '',
        pageName: '',
        category: '',
        paperTitle: '',
        appTitle: '',
        author: '',
        editor: '',
        wordCount: '',
        url: '',
        authorScore: '',
        createUser: '',
        createTime: '',
        updateUser: '',
        updateTime: '',
        articleScoreRecord: {
          id: '',
          parentId: '',
          scoreId: '',
          score: '',
          imageCount: '',
          remark: ''
        }
      },
      addVisible: false,
      banEditScore: true,
      innerNewPreviewVisible: false,
      isDisabledEditArticle: true
    }
  },
  props: {
    article: Object,
    outerDialogVisible: Boolean,
    selectExportType: Array,
    selectNewsType: Array,
    selectScore: Array
  },
  methods: {
    addScoreRecordAuthorRow (tableData, event) {
      tableData.push({
        id: '',
        author: '',
        percent: 0
      })
    },
    closeAddView () {
      this.addVisible = false
      this.emptyNewArticle()
    },
    closeEdit () {
      this.$emit('closeEdit')
    },
    closeNewsPreview () {
      this.innerNewPreviewVisible = false
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
    emptyNewArticle () {
      this.newArticle = {
        id: '',
        parentId: '',
        exportType: '',
        newsType: '',
        newsSourceId: '',
        newsTransferId: '',
        newsTransferIds: '',
        paperPublishTime: '',
        appPublishTime: '',
        pageName: '',
        category: '',
        paperTitle: '',
        appTitle: '',
        author: '',
        editor: '',
        wordCount: '',
        url: '',
        authorScore: '',
        createUser: '',
        createTime: '',
        updateUser: '',
        updateTime: '',
        articleScoreRecord: {
          id: '',
          parentId: '',
          scoreId: '',
          score: '',
          imageCount: '',
          remark: ''
        }
      }
    },
    delScoreRecordAuthorRow (index, rows) {
      rows.splice(index, 1)
    },
    formatAuthorScore (row, column, cellValue, index) {
      var _this = this
      if (row.percent && _this.article.articleScoreRecord.score) {
        var score = parseFloat(row.percent) * parseFloat(_this.article.articleScoreRecord.score) * 0.01
        return score
      }
      return ''
    },
    isAuthorPercentSum100 () {
      var articleScoreRecordAuthors = this.article.articleScoreRecordAuthors
      var num = 0.0
      if (articleScoreRecordAuthors.length === 0) {
        return true
      }
      for (let x = 0; x < articleScoreRecordAuthors.length; x++) {
        const articleScoreRecordAuthor = articleScoreRecordAuthors[x]
        num = num + parseFloat(articleScoreRecordAuthor.percent)
      }
      if (num === 100.0) {
        return true
      } else {
        return false
      }
    },
    save (formName) {
      var _this = this
      if (_this.article.articleScoreRecord.scoreId === '手动打分' && _this.article.articleScoreRecord.score === '') {
        this.$message('手动打分时请输入分数')
        return
      }
      if (!this.isAuthorPercentSum100()) {
        this.$message('请输入正确的分数占比')
        return
      }
      this.putRequest('/article', _this.article).then(resp => {
        this.closeEdit()
      })
    },
    showAddView () {
      this.emptyNewArticle()
      if (this.article.parentId && this.article.parentId !== '' && this.article.parentId > 0) {
        this.$message('该记录为稿件素材，请从主稿件记录添加')
      } else if (!this.article.articleScoreRecord || this.article.articleScoreRecord.id === '') {
        this.$message('请完成主稿件打分再添加稿件素材')
      } else {
        this.newArticle.parentId = this.article.id
        this.newArticle.exportType = this.article.exportType
        this.newArticle.newsSourceId = this.article.newsSourceId
        this.newArticle.newsTransferId = this.article.newsTransferId
        this.newArticle.newsTransferIds = this.article.newsTransferIds
        this.newArticle.paperPublishTime = this.article.paperPublishTime
        this.newArticle.appPublishTime = this.article.appPublishTime
        this.newArticle.pageName = this.article.pageName
        this.newArticle.category = this.article.category
        this.newArticle.paperTitle = this.article.paperTitle
        this.newArticle.appTitle = this.article.appTitle
        this.newArticle.editor = this.article.editor
        this.newArticle.wordCount = 0
        this.newArticle.url = this.article.url

        this.newArticle.articleScoreRecord.parentId = this.article.articleScoreRecord.id

        this.addVisible = true
      }
    }
  }
}
</script>

<style>
</style>
