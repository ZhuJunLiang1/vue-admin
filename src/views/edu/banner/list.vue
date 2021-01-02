<template>
    <div class="app-container">
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

      <el-table-column prop="title" label="标题" width="200" />

      <el-table-column prop="imageUrl" label="图片地址" />

      <el-table-column prop="linkUrl" label="链接地址" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/banner/edit/'+scope.row.id">
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
import banner from '@/api/cms/banner'

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
            limit:10//每页记录数
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
            banner.getBannerListPage(this.page,this.limit)
                .then(response => {//请求成功
                    //console.log(response)
                    if(response.success === true) {
                        this.list = response.data.items
                        this.total = response.data.total
                    }
                    this.listLoading = false;
                })
        },
        removeDataById(id) {
            this.$confirm('此操作将删除该banner, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
                }).then(() => {
                    banner.deleteBanner(id)
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