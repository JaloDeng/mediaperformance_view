<template>
  <div>
    <h2>新媒体绩效考核系统</h2>
    <el-container>
      <el-header>
        <div>
          类型：
          <el-select v-model="searchParams.type" placeholder="请选择" @change="changeType" size="mini" style="width: 150px;">
            <el-option v-for="item in selectType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          打分状态：
          <el-select v-model="searchParams.isScore" placeholder="请选择" @change="search" size="mini" style="width: 90px;">
            <el-option v-for="item in selectIsScore" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          APP时间：
          <el-date-picker v-model="appSearchTime" type="daterange" range-separator="-" :start-placeholder="searchParams.appStartTime" :end-placeholder="searchParams.appEndTime"
            @change="appSearchTimeChange" size="mini" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 210px;">
          </el-date-picker>
          见报日期：
          <el-date-picker v-model="paperSearchTime" type="daterange" range-separator="-" :start-placeholder="searchParams.paperStartTime" :end-placeholder="searchParams.paperEndTime"
            @change="paperSearchTimeChange" size="mini" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 210px;">
          </el-date-picker>
          <el-button type="primary" size="mini" style="" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="success" size="mini" icon="el-icon-download" @click="exportExcel">导出</el-button>
          <br><br>
          文章类型：
          <el-select v-model="searchParams.newsType" clearable placeholder="请选择" @change="search" size="mini" style="width: 100px;">
            <el-option v-for="item in selectNewsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          APP标题：
          <el-input clearable style="width: 330px;" size="mini" @keyup.enter.native="search" v-model="searchParams.appTitle"></el-input>
          纸媒标题：
          <el-input clearable style="width: 330px;" size="mini" @keyup.enter.native="search" v-model="searchParams.paperTitle"></el-input>
          作者：
          <el-input clearable style="width: 160px;" size="mini" @keyup.enter.native="search" v-model="searchParams.author"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 30px">
        <div>
          <el-table :data="articles" v-loading="tableLoading" size="mini" border @sort-change="tableSortChange" :default-sort="{prop: 'appPublishTime', order: 'descending'}">
            <el-table-column align="center" width="50" label="序号" type="index"></el-table-column>
            <el-table-column align="center" width="120" prop="paperPublishTime" label="见报日期" sortable="custom"></el-table-column>
            <el-table-column align="center" width="150" prop="appPublishTime" label="APP发布时间" sortable="custom"></el-table-column>
            <el-table-column align="center" width="100" prop="newsTypeLabel" label="文章类型"></el-table-column>
            <el-table-column align="center" width="350" prop="paperTitle" label="纸媒标题"></el-table-column>
            <el-table-column align="center" width="350" prop="appTitle" label="APP标题"></el-table-column>
            <el-table-column align="center" width="90" prop="author" label="作者" sortable="custom"></el-table-column>
            <el-table-column align="center" width="90" prop="editor" label="编辑" sortable="custom"></el-table-column>
            <el-table-column align="center" width="80" prop="wordCount" label="字数" sortable="custom"></el-table-column>
            <el-table-column align="center" width="90" prop="clickCount" label="浏览量" sortable="custom"></el-table-column>
            <el-table-column align="center" width="80" prop="articleScoreRecord.scoreId" label="等级"></el-table-column>
            <el-table-column align="center" width="100" prop="articleScoreRecord.score" label="文章分数" sortable="custom"></el-table-column>
            <el-table-column align="center" width="100" prop="authorScore" label="作者分数"></el-table-column>
            <el-table-column align="center" width="500" prop="articleScoreRecord.remark" label="备注"></el-table-column>
            <el-table-column align="center" width="150" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button @click="showEditView(scope.row)" size="mini" type="primary">详情</el-button>
                <el-button @click="del(scope.row)" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <br />
          <div style="justify-content:space-between;">
            <el-pagination background :page-sizes="sizes" :page-size="searchParams.pageSize" @size-change="sizeChange" :current-page="searchParams.pageNum"
              @current-change="currentChange" layout="sizes, prev, pager, next, jumper, ->, total" :total="total" style="text-align:center"></el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="outerDialogVisible" :before-close="cancelEdit" width="80%" center>
      <el-dialog width="30%" title="新闻预览" :visible.sync="innerNewPreviewVisible" append-to-body center>
        <el-row type="flex">
          <el-col :span="24">
            <iframe :src="article.url" frameborder="0" width="100%" height="500px"></iframe>
          </el-col>
        </el-row>
      </el-dialog>
      <el-form :model="article" ref="saveForm">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="类别"  label-width="120px">
              <el-select v-model="article.type" placeholder="请选择" size="mini" class="input_width">
                <el-option v-for="item in selectType" :key="item.value" :label="item.label" :value="item.value" :disabled="isDisabledEditArticle"></el-option>
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
              <el-input v-model="article.editor" size="mini" placeholder="请输入编辑" :readonly="isDisabledEditArticle"></el-input>
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
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="等级分" label-width="120px">
              <el-select v-model="articleScoreRecord.scoreId" placeholder="请选择" size="mini" :popper-append-to-body="false" class="select-uplift-height input_width" @change="changeEditScoreId">
                <el-option v-for="item in selectScore" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" label-width="120px">
              <el-input type="number" v-model="articleScoreRecord.score" size="mini" :readonly="banEditScore" class="input_width"></el-input>
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
              <el-input v-model="articleScoreRecord.remark" type="textarea" rows="5" size="mini" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="warning" @click="innerNewPreviewVisible = true">预览</el-button>
        <el-button size="mini" type="primary" @click="save('saveForm')">确认</el-button>
        <el-button size="mini" @click="cancelEdit">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      appSearchTime: [],
      articles: [],
      article: {
        id: '',
        type: '',
        newsType: '',
        newsSourceId: '',
        newsTransferId: '',
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
        articleScoreRecord: {},
        articleScoreRecordAuthors: []
      },
      articleScoreRecord: {
        id: '',
        scoreId: '',
        score: '',
        remark: ''
      },
      innerNewPreviewVisible: false,
      isDisabledEditArticle: true,
      banEditScoreId: false,
      banEditScore: true,
      dialogTitle: '',
      outerDialogVisible: false,
      paperSearchTime: [],
      sizes: [100, 200, 500],
      searchParams: {
        type: 1,
        newsType: '',
        paperStartTime: '',
        paperEndTime: '',
        appStartTime: '',
        appEndTime: '',
        paperTitle: '',
        appTitle: '',
        author: '',
        isScore: '',
        scoreId: '',
        pageNum: 1,
        pageSize: 100,
        orderBy: ''
      },
      selectIsScore: [{value: '', label: '全部'}, {value: -1, label: '未打分'}, {value: 1, label: '已打分'}],
      selectNewsType: [],
      selectScore: [],
      selectType: [{label: '只发APP', value: 1}, {label: '先发APP再发纸媒', value: 2}, {label: '先发纸媒再发APP', value: 3}, {label: '只发报纸', value: 4}],
      tableLoading: false,
      total: 1
    }
  },
  methods: {
    addScoreRecordAuthorRow (tableData, event) {
      tableData.push({
        id: '',
        author: '',
        percent: 0
      })
    },
    appSearchTimeChange () {
      var _this = this
      if (_this.appSearchTime && _this.appSearchTime.length > 0) {
        _this.searchParams.appStartTime = _this.appSearchTime[0].substring(0, 10) + ' 00:00:00'
        _this.searchParams.appEndTime = _this.appSearchTime[1].substring(0, 10) + ' 23:59:59'
      } else {
        _this.searchParams.appStartTime = ''
        _this.searchParams.appEndTime = ''
      }
    },
    cancelEdit () {
      this.outerDialogVisible = false
      this.emptyData()
      this.load()
    },
    changeEditScoreId (scoreId) {
      var _this = this
      if (scoreId === '手动打分') {
        _this.banEditScore = false
        _this.articleScoreRecord.score = ''
      } else {
        var scores = _this.selectScore
        for (let x = 0; x < scores.length; x++) {
          const element = scores[x]
          if (element.value === scoreId) {
            _this.articleScoreRecord.score = element.score
            break
          }
        }
        _this.banEditScore = true
      }
    },
    changeType () {
      this.currentTime()
      this.searchParams.pageNum = 1
      this.load()
    },
    currentChange (currentChange) {
      this.searchParams.pageNum = currentChange
      this.load()
    },
    currentTime () {
      var _this = this
      var now = new Date()
      var preDate = new Date(now.getTime() - 48 * 60 * 60 * 1000)
      var preDateStr = new Date(Date.UTC(preDate.getFullYear(), preDate.getMonth(), preDate.getDate())).toISOString().slice(0, 10)
      var type = _this.searchParams.type
      if (!type || type === 1 || type === 2) {
        _this.appSearchTime = [preDateStr + ' 00:00:00', preDateStr + ' 23:59:59']
        _this.paperSearchTime = []
      } else {
        _this.appSearchTime = []
        _this.paperSearchTime = [preDateStr, preDateStr]
      }
      this.appSearchTimeChange()
      this.paperSearchTimeChange()
    },
    del (row) {
      this.$confirm('此操作将永久删除[' + row.appTitle + ']，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/article/' + row.id).then(resp => {
          if (resp && resp.status === 200 && resp.data.success) {
            this.load()
          }
        })
      }).catch(() => {
      })
    },
    delScoreRecordAuthorRow (index, rows) {
      rows.splice(index, 1)
    },
    emptyData () {
      this.article = {
        id: '',
        type: '',
        newsType: '',
        newsSourceId: '',
        newsTransferId: '',
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
        articleScoreRecord: {},
        articleScoreRecordAuthors: []
      }
      this.articleScoreRecord = {
        id: '',
        scoreId: '',
        score: '',
        remark: ''
      }
      this.isDisabledEditArticle = true
      this.banEditScoreId = false
    },
    exportExcel () {
      var _this = this
      var url = '/article/export/excel?'
      // url = 'http://localhost:8085/article/export/excel?'
      for (var i in _this.searchParams) {
        url = url + i + '=' + _this.searchParams[i] + '&'
      }
      window.open(url)
    },
    formatAuthorScore (row, column, cellValue, index) {
      var _this = this
      if (row.percent && _this.articleScoreRecord.score) {
        var score = parseFloat(row.percent) * parseFloat(_this.articleScoreRecord.score) * 0.01
        return score
      }
      return ''
    },
    getNewsType () {
      this.getRequest('/article/newsType').then(resp => {
        if (resp.data && resp.data.data) {
          this.selectNewsType = resp.data.data
        }
      })
    },
    getScore () {
      this.getRequest('/article/score').then(resp => {
        if (resp.data && resp.data.data) {
          var scores = resp.data.data
          for (let index = 0; index < scores.length; index++) {
            var sid = scores[index].id
            var sscore = scores[index].score
            if (sid === '手动打分') {
              sscore = ''
            }
            var item = {
              'label': sid + ' ' + sscore,
              'value': sid,
              'score': sscore
            }
            this.selectScore.push(item)
          }
        }
      })
    },
    isAuthorPercentSum100 () {
      var _this = this
      var articleScoreRecordAuthors = _this.article.articleScoreRecordAuthors
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
    load () {
      var _this = this
      this.tableLoading = true
      this.getRequest('/article', _this.searchParams).then(resp => {
        this.tableLoading = false
        _this.total = resp.data.total
        _this.articles = resp.data.data
      })
    },
    paperSearchTimeChange () {
      var _this = this
      if (_this.paperSearchTime && _this.paperSearchTime.length > 0) {
        _this.searchParams.paperStartTime = _this.paperSearchTime[0]
        _this.searchParams.paperEndTime = _this.paperSearchTime[1]
      } else {
        _this.searchParams.paperStartTime = ''
        _this.searchParams.paperEndTime = ''
      }
    },
    save (formName) {
      var _this = this
      _this.tableLoading = true
      if (_this.articleScoreRecord.scoreId === '手动打分' && _this.articleScoreRecord.score === '') {
        this.$message('手动打分时请输入分数')
        return
      }
      _this.article.articleScoreRecord = _this.articleScoreRecord
      if (!this.isAuthorPercentSum100()) {
        this.$message('请输入正确的分数占比')
        return
      }
      this.putRequest('/article', _this.article).then(resp => {
        _this.tableLoading = false
        _this.outerDialogVisible = false
        _this.emptyData()
        _this.load()
      })
    },
    search () {
      this.searchParams.pageNum = 1
      this.load()
    },
    sizeChange (sizeChange) {
      this.searchParams.pageSize = sizeChange
      this.load()
    },
    showAddView () {
      this.dialogTitle = '添加'
      this.outerDialogVisible = true
      this.isDisabledEditArticle = false
      this.banEditScoreId = false
    },
    showEditView (row) {
      var _this = this
      this.tableLoading = true
      this.isDisabledEditArticle = true
      this.getRequest('/article/' + row.id).then(resp => {
        _this.article = resp.data.data
        if (_this.article.articleScoreRecord) {
          _this.articleScoreRecord = _this.article.articleScoreRecord
          if (_this.articleScoreRecord.scoreId && _this.articleScoreRecord.scoreId !== '') {
            this.banEditScoreId = true
          }
        }
      })
      _this.tableLoading = false
      _this.dialogTitle = '编辑详情'
      _this.outerDialogVisible = true
    },
    tableSortChange (column) {
      var _this = this
      if (column.order === 'descending') {
        _this.searchParams.orderBy = column.prop + ' DESC'
      } else {
        _this.searchParams.orderBy = column.prop + ' ASC'
      }
      this.load()
    }
  },
  mounted: function () {
    this.currentTime()
    this.load()
    this.getScore()
    this.getNewsType()
  }
}
</script>

<style>
  .select-uplift-height .el-select-dropdown__wrap {
    max-height: initial;
  }
  .input_width {
    width: 200px;
  }
</style>
