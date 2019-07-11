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
          标题：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.appTitle"></el-input>
          栏目：
          <el-input clearable style="width: 200px;"  size="mini" @keyup.enter.native="search" v-model="searchParams.category"></el-input>
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
            <el-table-column align="center" prop="appPublishTime" label="发布时间"></el-table-column>
            <el-table-column align="center" prop="category" label="栏目"></el-table-column>
            <el-table-column align="center" prop="appTitle" label="标题"></el-table-column>
            <el-table-column align="center" prop="author" label="作者"></el-table-column>
            <el-table-column align="center" prop="wordCount" label="字数"></el-table-column>
            <el-table-column align="center" prop="editor" label="编辑"></el-table-column>
          </el-table>
          <br />
          <div style="justify-content:space-between;">
            <el-pagination background :page-sizes="sizes" :page-size="pageSize" @size-change="sizeChange" :current-page="pageNum" @current-change="currentChange"
              layout="sizes, prev, pager, next, ->, total" :total="total" style="text-align:center"></el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
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
      total: 1
    }
  },
  methods: {
    currentChange (currentChange) {
      this.pageNum = currentChange
      this.load()
    },
    load: function () {
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
    search: function () {
      this.pageNum = 1
      this.load()
    },
    sizeChange (sizeChange) {
      this.pageSize = sizeChange
      this.load()
    }
  },
  mounted: function () {
    this.load()
  }
}
</script>

<style>
</style>
