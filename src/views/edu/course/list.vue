<template>
    <div class="app-container">
        <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
            <el-form-item label="课程名称">
                <el-input v-model="courseQuery.title" placeholder="课程名称"></el-input>
            </el-form-item>
            <el-form-item label="课时数">
                <el-input v-model="courseQuery.lessonNum" placeholder="课时数"></el-input>
            </el-form-item>
            <el-form-item label="课程状态">
                <el-select v-model="courseQuery.status" placeholder="课程状态">
                    <el-option label="已发布" :value= "'Normal'"></el-option>
                    <el-option label="未发布" :value= "'Draft'"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="添加时间">
                <el-date-picker
                    v-model="courseQuery.begin"
                    align="right"
                    type="date"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="截止时间">
                <el-date-picker
                    v-model="courseQuery.end"
                    align="right"
                    type="date"
                    placeholder="选择截止时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
                <el-button type="default" icon="el-icon-delete" @click="resetData()">清空</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="100"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="250" align="center" />

      <el-table-column label="课程状态" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" width="150" align="center"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="200" align="center"/>

      <el-table-column prop="buyCount" label="销售数量" width="150" align="center"/>

      <el-table-column label="操作" width="650" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
        background
        :current-page="page"
        :page-size="limit"
        :total="total"
        layout="total,prev, pager, next, jumper"
        @current-change="getList">
    </el-pagination>

    </div>
</template>
<script>
import course from '@/api/edu/course'

export default {
    //核心代码位置
    // data:{
    // },
    data() { //定义变量和初始值
        return {
            listLoading: true, // 是否显示loading信息
            list:null,//数据列表
            total:0,//总记录数
            page:1, //当前页
            limit:10,//每页记录数
            courseQuery:{}//条件封装对象
        }
    },
    created(){//页面渲染之前执行，调用methods定义的方法
        this.getList()
    },
    methods:{//创建具体的方法，调用teacher.js定义的方法
        //讲师列表的方法
        getList(page = 1) {
            this.page = page
            this.listLoading = true
            course.getCourseListPage(this.page,this.limit,this.courseQuery)
                .then(response => {//请求成功
                    //console.log(response)
                    if(response.success === true) {
                        this.list = response.data.list
                        this.total = response.data.total
                    }
                    this.listLoading = false;
                })
        },
        resetData() {
            this.courseQuery = {}
            this.getList()
        },
        removeDataById(id) {
            this.$confirm('此操作将删除该课程所有信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
                }).then(() => {
                    course.deleteCourseById(id)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.getList()
                    })
                }).catch((error) => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
        }
    }
}
</script>