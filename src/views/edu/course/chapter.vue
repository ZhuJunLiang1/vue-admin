<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <!-- 章节 -->
    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
  <ul class="chanpterList">
      <li
          v-for="chapter in chapterVideoList"
          :key="chapter.id">
          <p>
              {{ chapter.title }}

              <span class="acts">
                  <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                  <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                  <el-button type="text" @click="deleteChapter(chapter.id)" >删除</el-button>
              </span>
          </p>

          <!-- 视频 -->
          <ul class="chanpterList videoList">
              <li
                  v-for="video in chapter.children"
                  :key="video.id">
                  <p>{{ video.title }}
                      <span class="acts">
                          <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                          <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                      </span>
                  </p>
              </li>
          </ul>
      </li>
  </ul>
  <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
  </div>
  <!-- 添加和修改章节表单 -->
  <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
          <el-form-item label="章节标题">
              <el-input v-model="chapter.title"/>
          </el-form-item>
          <el-form-item label="章节排序">
              <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
                :on-success="handleVodUploadSuccess"
                :on-remove="handleVodRemove"
                :before-remove="beforeVodRemove"
                :on-exceed="handleUploadExceed"
                :file-list="fileList"
                :action="BASE_API+'/eduvod/video/uploadVideo'"
                :limit="1"
                class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
                <div slot="content">最大支持1G，<br>
                    支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                    GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                    MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                    SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [],
      courseId:'',
      dialogChapterFormVisible:false,//章节弹框
      saveVideoBtnDisabled: false,// 课时按钮是否禁用
      dialogVideoFormVisible:false, //课时弹窗
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
      video:{
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: '',
        videoOriginalName:''
      },
      chapterId:'',
      chapter:{
        title:'',
        sort:0
      }
    }
  },
  created() {
    //获取路由的id值
    if(this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
    }
    this.getChapterVideo()
  },
  methods: {
    //上传视频成功调用
    handleVodUploadSuccess(response,file,fileList) {
      //ID赋值
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginalName = file.name
    },
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    beforeVodRemove(file,fileList) {//点击文件后 的X号执行方法
      return this.$confirm(`确认删除 ${file.name} ?`);
    },
    handleVodRemove() {//点击确定后执行的方法
      //调用接口删除视频
      video.deleteAliVideo(this.video.videoSourceId)
        .then(response => {
          this.$message({
                        type: 'success',
                        message: '删除视频成功！'
          });
          this.fileList = []
          //将video视频id和视频名称都清空
          this.video.videoSourceId=''
          this.video.videoOriginalName=''
        })
    },
    //=========================小节操作=================================
    //添加小节弹窗
    openVideo(chapterId) {
      this.video={
        title: '',
        sort: 0,
        isFree: 0
      }
       this.fileList = []
          //将video视频id和视频名称都清空
      this.video.videoSourceId=''
      this.video.videoOriginalName=''
      this.dialogVideoFormVisible=true
      //设置章节ID
      this.video.chapterId = chapterId
      //设置courseId
      this.video.courseId = this.courseId

    },
    addVideo() {
      video.addVideo(this.video)
        .then(response => {
          //关闭弹框
          this.dialogVideoFormVisible=false
          //提示信息
          this.$message({
                        type: 'success',
                        message: '添加小节成功！'
                    });
          //刷新页面
          this.getChapterVideo()
        })
    },
    deleteVideo(videoId) {
      this.$confirm('此操作将删除该小节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
                }).then(() => {
                    video.deleteVideo(videoId)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        //刷新页面
                      this.getChapterVideo()
                    })
                }).catch((error) => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
    },
    updateVideo(){
        video.updateVideo(this.video)
        .then(response => {
          //关闭弹框
          this.dialogVideoFormVisible=false
          //提示信息
          this.$message({
                        type: 'success',
                        message: '修改小节成功！'
                    });
          //刷新页面
          this.getChapterVideo()
        })
    },

    openEditVideo(videoId) {
        this.dialogVideoFormVisible = true
      video.getVideo(videoId)
        .then(response => {
            this.video = response.data.video
        })
    },
    
    saveOrUpdateVideo() {
      if(!this.video.id) {
          this.addVideo()
      }else {
          this.updateVideo()
      }
    },
    
    //=========================章节操作=================================
    //删除
    deleteChapter(chapterId) {
      this.$confirm('此操作将删除该章节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
                }).then(() => {
                    chapter.deleteChapter(chapterId)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        //刷新页面
                      this.getChapterVideo()
                    })
                }).catch((error) => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
    },
    //修改章节弹框数据回显
    openEditChapter(chapterId) {
      this.dialogChapterFormVisible = true
      chapter.getChapter(chapterId)
        .then(response => {
            this.chapter = response.data.chapter
        })
    },
    updateChapter() {
        chapter.updateChapter(this.chapter)
        .then(response => {
          //关闭弹框
          this.dialogChapterFormVisible=false
          //提示信息
          this.$message({
                        type: 'success',
                        message: '修改章节成功！'
                    });
          //刷新页面
          this.getChapterVideo()
        })
    },
    saveChapter() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          //关闭弹框
          this.dialogChapterFormVisible=false
          //提示信息
          this.$message({
                        type: 'success',
                        message: '添加章节成功！'
                    });
          //刷新页面
          this.getChapterVideo()
        })
    },
    saveOrUpdate() {
      if(!this.chapter.id) {
          this.saveChapter()
      }else {
          this.updateChapter()
      }
    },
    getChapterVideo() {
        chapter.getChapterByCourseId(this.courseId)
          .then(response => {
            this.chapterVideoList = response.data.allChapterVideo
          })
    },
    previous() {
      this.$router.push({ path: '/course/info/'+this.courseId })
    },

    next() {
      this.$router.push({ path: '/course/publish/'+this.courseId })
    },
    //弹出添加章节
    openChapterDialog() {
      this.dialogChapterFormVisible=true
      //表单数据清空
      this.chapter.title = ''
      this.chapter.sort = ''
      this.chapter.id=''
    }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>