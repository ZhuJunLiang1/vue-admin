<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/fileoss/uploadFace'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate()"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        sort: 0,
        avatar:"https://online-zjl-edu.oss-cn-beijing.aliyuncs.com/2020/12/02/d5f782be0ae94c0192d0f73957105d7dfile.png"
      },
      imagecropperShow: false, //上传头像组件是否显示
      imagecropperKey: 0, //上传组件唯一标识
      saveBtnDisabled: false,
      BASE_API: process.env.BASE_API, //接口API地址
    };
  },
  watch: {
    $route(to, from) {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    close() {
      //关闭上传弹窗
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    cropSuccess(data) {
      //上传成功  将url传给前端
      this.imagecropperShow = false;
      this.teacher.avatar = data.url;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.getTeacherInfo(id);
      } else {
        this.teacher = {
          sort: 0,
          avatar:"https://online-zjl-edu.oss-cn-beijing.aliyuncs.com/2020/12/02/d5f782be0ae94c0192d0f73957105d7dfile.png"
        };
      }
    },
    save() {
      teacherApi.addTeacher(this.teacher).then((response) => {
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //回到列表页面  路由跳转
        this.$router.push({ path: "/teacher/list" });
      });
    },
    update() {
      teacherApi.updateTeacher(this.teacher).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        //回到列表页面  路由跳转
        this.$router.push({ path: "/teacher/list" });
      });
    },
    saveOrUpdate() {
      if (!this.teacher.id) {
        this.save();
      } else {
        this.update();
      }
    },
    getTeacherInfo(id) {
      teacherApi.getTeacherInfo(id).then((response) => {
        this.teacher = response.data.teacher;
      });
    },
  },
};
</script>
