<template>
  <div>
    <el-container>
      <el-main style="padding: 0px">
        <template>
          类型：
          <el-select v-model="searchParams.exportType" placeholder="请选择" @change="changeExportType" size="mini" style="width: 150px;">
            <el-option v-for="item in selectExportType" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
          <br style="line-height: 30px;">
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
          <br style="line-height: 30px;">
        </template>
        <template>
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
            <el-table-column align="center" width="100" prop="sourceCount" label="素材数量"></el-table-column>
            <el-table-column align="center" width="80" prop="articleScoreRecord.scoreId" label="等级"></el-table-column>
            <el-table-column align="center" width="100" prop="articleScoreRecord.score" label="文章分数" sortable="custom"></el-table-column>
            <el-table-column align="center" width="100" prop="authorScore" label="作者分数"></el-table-column>
            <el-table-column align="center" width="500" prop="articleScoreRecord.remark" label="备注"></el-table-column>
            <el-table-column align="center" width="150" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button @click="showEditView(scope.row)" size="mini" type="primary">详情</el-button>
                <el-button :disabled="scope.row.canDelete" @click="del(scope.row)" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <div style="justify-content:space-between;">
            <el-pagination background :page-sizes="sizes" :page-size="searchParams.pageSize" @size-change="sizeChange" :current-page="searchParams.pageNum"
              @current-change="currentChange" layout="sizes, prev, pager, next, jumper, ->, total" :total="total" style="text-align:center"></el-pagination>
          </div>
        </template>
      </el-main>
    </el-container>
    <articleEditor :article="article" :outerDialogVisible="outerDialogVisible" :selectExportType="selectExportType"
      :selectNewsType="selectNewsType" :selectScore="selectScore" v-on:closeEdit="closeEdit"></articleEditor>
  </div>
</template>

<script>
import articleEditor from '@/components/form/ArticleEditor'

export default {
  components: {
    articleEditor
  },
  data () {
    return {
      appSearchTime: [],
      articles: [],
      article: {
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
        sourceCount: '',
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
          sourceCount: '',
          remark: ''
        },
        articleScoreRecordAuthors: []
      },
      outerDialogVisible: false,
      paperSearchTime: [],
      sizes: [50, 100, 200, 500],
      searchParams: {
        exportType: 'APP',
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
        pageSize: 50,
        orderBy: ''
      },
      selectIsScore: [{value: '', label: '全部'}, {value: -1, label: '未打分'}, {value: 1, label: '已打分'}],
      selectNewsType: [],
      selectScore: [],
      selectExportType: [],
      tableLoading: false,
      total: 1
    }
  },
  methods: {
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
    closeEdit () {
      this.outerDialogVisible = false
      this.emptyData()
      this.load()
    },
    changeExportType () {
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
      var exportType = _this.searchParams.exportType
      if (!exportType || exportType === 'APP' || exportType === 'APPTOPAPER') {
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
    emptyData () {
      this.article = {
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
        sourceCount: '',
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
          sourceCount: '',
          remark: ''
        },
        articleScoreRecordAuthors: []
      }
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
    getExportType () {
      this.getRequest('/article/exportType').then(resp => {
        if (resp.data && resp.data.data) {
          this.selectExportType = resp.data.data
        }
      })
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
    search () {
      this.searchParams.pageNum = 1
      this.load()
    },
    sizeChange (sizeChange) {
      this.searchParams.pageSize = sizeChange
      this.load()
    },
    showEditView (row) {
      var _this = this
      this.tableLoading = true
      this.getRequest('/article/' + row.id).then(resp => {
        _this.article = resp.data.data
        if (!_this.article.articleScoreRecord) {
          _this.article.articleScoreRecord = {
            id: '',
            scoreId: '',
            score: '',
            remark: ''
          }
        }
      })
      _this.tableLoading = false
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
    this.getExportType()
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
