<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="课程类型" @change="getTowSubject">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="课程名称">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>


      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/uploadFace'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" width="500px" height="300px">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      teacherList:[],//封装讲师列表
      subjectOneList:[],//一级分类列表
      subjectTwoList:[],//二级分类列表
      courseId:'',
      courseInfo : {
      title: '',
      teacherId: '',
      subjectParentId: '', //一级分类id
      subjectId: '',//二级分类id
      lessonNum: 0,
      description: '',
      cover: 'https://online-zjl-edu.oss-cn-beijing.aliyuncs.com/2020/12/04/cc2370344a5a4c4f9e890071373de0221.png',
      price: 0
      },
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },
  components: { Tinymce },//声明富文本编辑组件
  created(){
    //若有数据则回显
      if(this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getInfo()
      this.getListTeacher()
      }else {
      this.courseInfo = {
      title: '',
      teacherId: '',
      subjectParentId: '', //一级分类id
      subjectId: '',//二级分类id
      lessonNum: 0,
      description: '',
      cover: 'https://online-zjl-edu.oss-cn-beijing.aliyuncs.com/2020/12/04/cc2370344a5a4c4f9e890071373de0221.png',
      price: 0
      }
        //初始化所有讲师
      this.getListTeacher()
      this.getAllSuject()
      }
      
  },

  methods: {
    getInfo() {
      course.getCourseInfo(this.courseId)
        .then(response => {
          this.courseInfo = response.data.courseInfoVo
          subject.getSubjectList()
            .then(response => {
              //获取所有一级分类
              this.subjectOneList = response.data.list
              //遍历寻找和当前id相同的二级分类
              for(var i=0; i<this.subjectOneList.length;i++){
                var oneSubject = this.subjectOneList[i]
                if(this.courseInfo.subjectParentId == oneSubject.id) {
                  this.subjectTwoList = oneSubject.children
                }
              }
            })
        })
    },
    //上传封面成功
    handleAvatarSuccess(res,file) {
      this.courseInfo.cover = res.data.url
    },
    //上传之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    //点击一级分类 改变，显示二级分类
    //value 为一级分类id值
    getTowSubject(value) {
      for(let i = 0; i <this.subjectOneList.length;i++) {
        if(this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children
          //二级分类id值清空
          this.courseInfo.subjectId = ''
        }
      }
    },
    getAllSuject() {
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.list
        })
    },
    //查询所有讲师
    getListTeacher() {
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.items
        })
    },
    addCourse() {
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          //提示
          this.$message({
                    type: 'success',
                    message: '添加课程信息成功！'
                });
          //跳转到第二步
          this.$router.push({ path: '/course/chapter/' + response.data.courseId })
        }).catch((response) => {
          this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    updateCourse() {
        course.updateCourseInfo(this.courseInfo)
          .then(response => {
            //提示
              this.$message({
                        type: 'success',
                        message: '修改课程信息成功！'
                    });
              //跳转到第二步
              this.$router.push({ path: '/course/chapter/' + this.courseId })
            }).catch((response) => {
              this.$message({
              type: 'error',
              message: response.message
            })
          })
    },
    saveOrUpdate() {
      if(!this.courseInfo.id) {
        this.addCourse()
      }else {
        this.updateCourse()
      }

    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>