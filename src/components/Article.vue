<template>
  <div>
    <h1>新媒体绩效考核系统</h1>
    <el-container>
      <el-header style="padding: 0px;justify-content:space-between;align-items: center">
        <div style="display: inline; text-align:center">
          <el-radio-group v-model="searchParams.type" size="small" @change="search">
            <el-radio-button label="1">只发APP</el-radio-button>
            <el-radio-button label="2">先发纸媒再发APP</el-radio-button>
            <el-radio-button label="3">先发APP再发纸媒</el-radio-button>
            <el-radio-button label="4">只发报纸</el-radio-button>
          </el-radio-group>
          &#12288;&#12288;<el-button type="primary" size="mini" style="" icon="el-icon-search" @click="search">搜索</el-button>
          <br><br>APP日期：
          <el-date-picker v-model="appSearchTime" type="datetimerange" range-separator="-" :start-placeholder="searchParams.appStartTime" :end-placeholder="searchParams.appEndTime"
            @change="appSearchTimeChange" size="small">
          </el-date-picker>
          见报日期：
          <el-date-picker v-model="paperSearchTime" type="daterange" range-separator="-" :start-placeholder="searchParams.paperStartTime" :end-placeholder="searchParams.paperEndTime"
            @change="paperSearchTimeChange" size="small">
          </el-date-picker>
          <br><br>APP标题：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.appTitle"></el-input>
          纸媒标题：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.paperTitle"></el-input>
          作者：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.author"></el-input>
          打分状态：
          <el-select v-model="searchParams.isScore" placeholder="请选择" @change="search">
            <el-option v-for="item in selectIsScore" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 100px">
        <div>
          <el-table :data="articles" v-loading="tableLoading" size="mini" border>
            <el-table-column align="center" type="selection" width="30"></el-table-column>
            <el-table-column align="center" width="150" prop="paperPublishTime" label="纸媒发布时间"></el-table-column>
            <el-table-column align="center" width="150" prop="appPublishTime" label="APP发布时间"></el-table-column>
            <el-table-column align="center" prop="paperTitle" label="纸媒标题"></el-table-column>
            <el-table-column align="center" prop="appTitle" label="APP标题"></el-table-column>
            <el-table-column align="center" width="130" prop="author" label="作者"></el-table-column>
            <el-table-column align="center" width="130" prop="editor" label="编辑"></el-table-column>
            <el-table-column align="center" width="130" prop="wordCount" label="字数"></el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="showEditView(scope.row)" size="small" type="primary">详情</el-button>
                <el-button @click="del(scope.row)" hidden="hidden" size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <div style="justify-content:space-between;">
            <el-pagination background :page-sizes="sizes" :page-size="searchParams.pageSize" @size-change="sizeChange" :current-page="searchParams.pageNum" @current-change="currentChange"
              layout="sizes, prev, pager, next, ->, total" :total="total" style="text-align:center"></el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="dialogTitle" style="padding: 0px" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="cancelEdit" width="80%">
      <el-form :model="article" ref="saveForm" style="margin: 0px;padding: 0px;">
      </el-form>
      <div>
        <iframe :src="urlSrc" frameborder="0" width="90%" height="500px"></iframe>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center; display: block;">
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
        newsSourceId: '',
        paperPublishTime: '',
        appPublishTime: '',
        page: '',
        category: '',
        articleType: '',
        paperTitle: '',
        appTitle: '',
        author: '',
        editor: '',
        wordCount: '',
        clickCount: '',
        url: '',
        level: '',
        score: '',
        createUser: '',
        createTime: '',
        updateUser: '',
        updateTime: ''
      },
      dialogTitle: '',
      dialogVisible: false,
      paperSearchTime: [],
      sizes: [100, 200, 500],
      searchParams: {
        appTitle: '',
        paperTitle: '',
        author: '',
        isScore: '',
        appStartTime: '',
        appEndTime: '',
        paperStartTime: '',
        paperEndTime: '',
        pageNum: 1,
        pageSize: 100,
        type: 1
      },
      selectIsScore: [{
        value: '',
        label: '全部'
      }, {
        value: 0,
        label: '未打分'
      }, {
        value: 1,
        label: '已打分'
      }],
      tableLoading: false,
      total: 1,
      urlSrc: ''
    }
  },
  methods: {
    appSearchTimeChange () {
      var _this = this
      _this.searchParams.appStartTime = _this.moment(_this.appSearchTime[0]).format('YYYY-MM-DD HH:mm:ss')
      _this.searchParams.appEndTime = _this.moment(_this.appSearchTime[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    cancelEdit () {
      this.dialogVisible = false
      this.emptyData()
      this.load()
    },
    currentChange (currentChange) {
      this.searchParams.pageNum = currentChange
      this.load()
    },
    del (row) {
      this.$confirm('此操作将永久删除[' + row.appTitle + ']，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        alert('点击删除')
      }).catch(() => {
      })
    },
    emptyData () {
      this.article = {
        id: '',
        type: '',
        newsSourceId: '',
        paperPublishTime: '',
        appPublishTime: '',
        page: '',
        category: '',
        articleType: '',
        paperTitle: '',
        appTitle: '',
        author: '',
        editor: '',
        wordCount: '',
        clickCount: '',
        url: '',
        level: '',
        score: '',
        createUser: '',
        createTime: '',
        updateUser: '',
        updateTime: ''
      }
    },
    load () {
      var _this = this
      this.tableLoading = true
      this.postRequest('/article/find', _this.searchParams).then(resp => {
        this.tableLoading = false
        _this.total = resp.data.total
        _this.articles = resp.data.data
      })
    },
    paperSearchTimeChange () {
      var _this = this
      _this.searchParams.paperStartTime = _this.moment(_this.paperSearchTime[0]).format('YYYY-MM-DD')
      _this.searchParams.paperEndTime = _this.moment(_this.paperSearchTime[1]).format('YYYY-MM-DD')
    },
    save (formName) {
      console.log(formName)
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
      _this.urlSrc = row.url
      _this.dialogTitle = '详情'
      _this.dialogVisible = true
    }
  },
  mounted: function () {
    this.load()
  }
}
</script>

<style>
</style>
