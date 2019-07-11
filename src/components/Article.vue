<template>
  <div>
    <h1>新媒体绩效考核系统</h1>
    <el-container>
      <el-header style="padding: 0px;justify-content:space-between;align-items: center">
        <div style="display: inline; text-align:center">
          见报日期：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.paperPublishTimeStart"></el-input>
          至
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.paperPublishTimeEnd"></el-input>
          APP标题：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.appTitle"></el-input>
          作者：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.author"></el-input>
          打分状态：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.isScore"></el-input>
          <el-button type="primary" size="mini" style="" icon="el-icon-search" @click="search"></el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table :data="articles" v-loading="tableLoading" size="mini" border>
            <el-table-column align="center" type="selection" width="30"></el-table-column>
            <el-table-column align="center" width="150" prop="appPublishTime" label="APP发布时间"></el-table-column>
            <el-table-column align="center" prop="appTitle" label="APP标题"></el-table-column>
            <el-table-column align="center" width="130" prop="author" label="作者"></el-table-column>
            <el-table-column align="center" width="130" prop="editor" label="编辑"></el-table-column>
            <el-table-column align="center" width="130" prop="wordCount" label="字数"></el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="viewUrl(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">新闻预览</el-button>
                <el-button @click="del(scope.row)" size="mini" type="danger" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <div style="justify-content:space-between;">
            <el-pagination background :page-sizes="sizes" :page-size="pageSize" @size-change="sizeChange" :current-page="pageNum" @current-change="currentChange"
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      article: {
        id: '',
        paperPublishTime: '',
        page: '',
        category: '',
        paperTitle: '',
        author: '',
        articleType: '',
        editor: '',
        appTitle: '',
        appPublishTime: '',
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
      pageNum: 1,
      pageSize: 100,
      sizes: [100, 200, 500],
      searchParams: {
        appTitle: '',
        author: '',
        category: '',
        isScore: '',
        paperPublishTimeStart: '',
        paperPublishTimeEnd: '',
        pageNum: '',
        pageSize: ''
      },
      tableLoading: false,
      total: 1,
      urlSrc: ''
    }
  },
  methods: {
    cancelEdit () {
      this.dialogVisible = false
      this.emptyData()
      this.load()
    },
    currentChange (currentChange) {
      this.pageNum = currentChange
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
        paperPublishTime: '',
        page: '',
        category: '',
        paperTitle: '',
        author: '',
        articleType: '',
        editor: '',
        appTitle: '',
        appPublishTime: '',
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
      _this.searchParams.pageNum = _this.pageNum
      _this.searchParams.pageSize = _this.pageSize
      this.postRequest('/article/app', _this.searchParams).then(resp => {
        this.tableLoading = false
        _this.total = resp.data.total
        _this.articles = resp.data.data
      })
    },
    search () {
      this.pageNum = 1
      this.load()
    },
    sizeChange (sizeChange) {
      this.pageSize = sizeChange
      this.load()
    },
    viewUrl (row) {
      var _this = this
      _this.urlSrc = row.url
      _this.dialogTitle = '新闻预览'
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
