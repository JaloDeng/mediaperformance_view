<template>
  <div>
    <h1>新媒体绩效考核系统</h1>
    <el-container>
      <el-header>
        <div>
          <el-radio-group v-model="searchParams.type" size="small" @change="search">
            <el-radio-button label="1">只发APP</el-radio-button>
            <el-radio-button label="2">先发纸媒再发APP</el-radio-button>
            <el-radio-button label="3">先发APP再发纸媒</el-radio-button>
            <el-radio-button label="4">只发报纸</el-radio-button>
          </el-radio-group>
          &#12288;&#12288;<el-button type="primary" size="mini" style="" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddView">添加</el-button>
          <br><br>APP发布时间：
          <el-date-picker v-model="appSearchTime" type="datetimerange" range-separator="-" :start-placeholder="searchParams.appStartTime" :end-placeholder="searchParams.appEndTime"
            @change="appSearchTimeChange" size="small" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          纸媒发布日期：
          <el-date-picker v-model="paperSearchTime" type="daterange" range-separator="-" :start-placeholder="searchParams.paperStartTime" :end-placeholder="searchParams.paperEndTime"
            @change="paperSearchTimeChange" size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
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
          <el-table :data="articles" v-loading="tableLoading" size="mini" border @sort-change="tableSortChange" :default-sort="{prop: 'appPublishTime', order: 'descending'}">
            <el-table-column align="center" type="index" width="50" prop="no" label="序号"></el-table-column>
            <el-table-column align="center" width="150" prop="paperPublishTime" label="纸媒发布时间" sortable="custom"></el-table-column>
            <el-table-column align="center" width="150" prop="appPublishTime" label="APP发布时间" sortable="custom"></el-table-column>
            <el-table-column align="center" prop="paperTitle" label="纸媒标题"></el-table-column>
            <el-table-column align="center" prop="appTitle" label="APP标题"></el-table-column>
            <el-table-column align="center" width="130" prop="author" label="作者" sortable="custom"></el-table-column>
            <el-table-column align="center" width="130" prop="editor" label="编辑" sortable="custom"></el-table-column>
            <el-table-column align="center" width="130" prop="wordCount" label="字数" sortable="custom"></el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="showEditView(scope.row)" size="small" type="primary">详情</el-button>
                <el-button @click="del(scope.row)" hidden="hidden" size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <div style="justify-content:space-between;">
            <el-pagination background :page-sizes="sizes" :page-size="searchParams.pageSize" @size-change="sizeChange" :current-page="searchParams.pageNum"
              @current-change="currentChange" layout="sizes, prev, pager, next, ->, total" :total="total" style="text-align:center"></el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="cancelEdit" width="80%" center>
      <el-form :model="article" ref="saveForm">
        <el-form-item label="类别"  label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.type" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="纸媒发布时间" label-width="120px">
          <el-input prefix-icon="el-icon-date" v-model="article.paperPublishTime" size="mini" placeholder="请输入纸媒发布时间"></el-input>
        </el-form-item>
        <el-form-item label="APP发布时间" label-width="120px">
          <el-input prefix-icon="el-icon-time" v-model="article.appPublishTime" size="mini" placeholder="请输入APP发布时间"></el-input>
        </el-form-item>
        <el-form-item label="纸媒标题" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.paperTitle" size="mini" placeholder="请输入纸媒标题"></el-input>
        </el-form-item>
        <el-form-item label="APP标题" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.appTitle" size="mini" placeholder="请输入APP标题"></el-input>
        </el-form-item>
        <el-form-item label="作者" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.author" size="mini" placeholder="请输入作者"></el-input>
        </el-form-item>
        <el-form-item label="编辑" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.editor" size="mini" placeholder="请输入编辑"></el-input>
        </el-form-item>
        <el-form-item label="字数" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.wordCount" size="mini" placeholder="请输入字数"></el-input>
        </el-form-item>
        <el-form-item label="浏览量" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.clickCount" size="mini" placeholder="请输入浏览量"></el-input>
        </el-form-item>
        <el-form-item label="链接" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.url" size="mini" placeholder="请输入链接"></el-input>
        </el-form-item>
        <el-form-item label="等级" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.level" size="mini" placeholder="请输入等级"></el-input>
        </el-form-item>
        <el-form-item label="分数" label-width="120px">
          <el-input prefix-icon="el-icon-edit" v-model="article.score" size="mini" placeholder="请输入分数"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <iframe :src="article.url" frameborder="0" width="100%" height="500px"></iframe>
      </div>
      <span slot="footer" class="dialog-footer">
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
        orderBy: '',
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
      total: 1
    }
  },
  methods: {
    appSearchTimeChange () {
      var _this = this
      if (_this.appSearchTime && _this.appSearchTime.length > 0) {
        _this.searchParams.appStartTime = _this.appSearchTime[0]
        _this.searchParams.appEndTime = _this.appSearchTime[1]
      } else {
        _this.searchParams.appStartTime = ''
        _this.searchParams.appEndTime = ''
      }
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
      this.putRequest('/article', _this.article).then(resp => {
        _this.tableLoading = false
        _this.dialogVisible = false
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
      this.dialogVisible = true
    },
    showEditView (row) {
      var _this = this
      this.tableLoading = true
      this.getRequest('/article/' + row.id).then(resp => {
        _this.article = resp.data.data
      })
      _this.tableLoading = false
      _this.dialogTitle = '编辑详情'
      _this.dialogVisible = true
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
    this.load()
  }
}
</script>

<style>
</style>
