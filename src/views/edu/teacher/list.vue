<template>
    <div class="app-container">
        <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
            <el-form-item label="讲师名称">
                <el-input v-model="teacherQuery.name" placeholder="讲师名称"></el-input>
            </el-form-item>
            <el-form-item label="讲师头衔">
                <el-select v-model="teacherQuery.region" placeholder="讲师头衔">
                    <el-option label="高级讲师" :value="1"></el-option>
                    <el-option label="首席讲师" :value="2"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="添加时间">
                <el-date-picker
                    v-model="teacherQuery.begin"
                    align="right"
                    type="date"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="截止时间">
                <el-date-picker
                    v-model="teacherQuery.end"
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
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="career" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
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
import teacher from '@/api/edu/teacher'

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
            teacherQuery:{}//条件封装对象
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
            teacher.getTeacherListPage(this.page,this.limit,this.teacherQuery)
                .then(response => {//请求成功
                    //console.log(response)
                    if(response.success === true) {
                        this.list = response.data.rows
                        this.total = response.data.total
                    }
                    this.listLoading = false;
                })
        },
        resetData() {
            this.teacherQuery = {}
            this.getList()
        },
        removeDataById(id) {
            this.$confirm('此操作将删除该讲师, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
                }).then(() => {
                    teacher.deleteTeacherById(id)
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