<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="banner标题">
        <el-input v-model="banner.title" />
      </el-form-item>
      <el-form-item label="banner排序">
        <el-input-number
          v-model="banner.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="链接地址">
        <el-input v-model="banner.linkUrl" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="Banner">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="banner.imageUrl" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >上传banner
        </el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="800"
          :height="500"
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
import bannerApi from "@/api/cms/banner";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      banner: {
        title:'',
        linkUrl:'',
        sort: 0,
        imageUrl:"https://online-zjl-edu.oss-cn-beijing.aliyuncs.com/2020/12/02/d5f782be0ae94c0192d0f73957105d7dfile.png"
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
      this.banner.imageUrl = data.url;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.getBannerInfo(id);
      } else {
        this.banner = {
            title:'',
            linkUrl:'',
            sort: 0,
            imageUrl:"https://online-zjl-edu.oss-cn-beijing.aliyuncs.com/2020/12/02/d5f782be0ae94c0192d0f73957105d7dfile.png"
        };
      }
    },
    save() {
      bannerApi.addBanner(this.banner).then((response) => {
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //回到列表页面  路由跳转
        this.$router.push({ path: "/banner/list" });
      });
    },
    update() {
      bannerApi.updateBanner(this.banner).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        //回到列表页面  路由跳转
        this.$router.push({ path: "/banner/list" });
      });
    },
    saveOrUpdate() {
      if (!this.banner.id) {
        this.save();
      } else {
        this.update();
      }
    },
    getBannerInfo(id) {
      bannerApi.getBannerById(id).then((response) => {
        this.banner = response.data.banner;
      });
    },
  },
};
</script>
