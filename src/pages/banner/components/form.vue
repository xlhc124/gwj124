<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="标题" label-width="120px" prop="title">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px" v-if="user.id!==0">
          <!-- element-ui 上传文件 -->
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeFile2"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeFile3"
          >
            <img v-if="imgUrl" :src="imgUrl2" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加轮播图'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import path from "path";
import { mapGetters, mapActions } from "vuex";
import {
  reqbannerList,
  reqbannerAdd,
  reqbannerDetail,
  reqbannerUpdate
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ]
      },
      user: {
        title: "",
        img: null,
        status: 1
      },
      // 2.初始化图片路径
      imgUrl: "",
      imgUrl2: ""
    };
  },
  computed: {
    ...mapGetters({
      cateList: "banner/list"
    })
  },
  methods: {
    // 3.选择了文件
    changeFile(e) {
      let file = e.target.files[0];

      //判断文件大小 file.size B ，1M=1024KB 1KB=1024B
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件大小不能超过2M");
        return;
      }

      //判断文件类型
      let extname = path.extname(file.name); //'.jpg'
      let arr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!arr.includes(extname)) {
        errorAlert("请上传正确的图片格式！");
        return;
      }

      //URL.createObjectURL(file) 将一个文件生成一个URL地址
      this.imgUrl = URL.createObjectURL(file);
      //给user.img赋值
      this.user.img = file;
    },

    changeFile3(e) {
      console.log(e);
      // raw获取文件
      let a = e.raw;
      this.imgUrl2 = URL.createObjectURL(a);
      this.imgUrl = this.imgUrl2;
      this.imgUrl2 = "";
    },
    //element-ui的上传文件
    changeFile2(e) {
      let file = e.raw;

      this.imgUrl = URL.createObjectURL(file);

      this.user.img = file;
    },

    ...mapActions({
      reqList: "banner/reqList"
    }),
    //6.点了取消
    cancel() {
      this.info.isshow = false;
    },
    //17.清空数据
    empty() {
      this.user = {
        title: "",
        img: null,
        status: 1
      };
      this.imgUrl = "";
    },
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.title === "") {
          errorAlert("标题不能为空");
          return;
        }
        resolve();
        
      });
      
    },
    add() {
         this.check().then(() => {
      reqbannerAdd(this.user).then(res => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          this.cancel();
          this.empty();
          this.reqList();
        }
      });
         })

    },

    getOne(id) {
      reqbannerDetail(id).then(res => {
        //此刻user没有id
        this.user = res.data.list;
        this.imgUrl = this.$imgPre + this.user.img;
        //补id
        this.user.id = id;
      });
    },
    //39 修改
    update() {
         this.check().then(() => {
      reqbannerUpdate(this.user).then(res => {
        if (res.data.code == 200) {
          //弹成功
          successAlert("修改成功");
          this.cancel();
          this.empty();
          this.reqList();
        }
      });
         })

    },
    //41.处理消失
    closed() {
      if (this.info.title === "编辑轮播图") {
        this.empty();
      }
    }
  },
  mounted() {
    //   12.一进来，先获取菜单列表数据
    reqbannerList().then(res => {
      if (res.data.code == 200) {
        this.bannerList = res.data.list;
      }
    });
  }
};
</script>
<style scoped lang="stylus">
.myupload {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}

.myupload h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}

.myupload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.myupload .img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}

.add >>> .el-upload {
  float: left;
  margin-left: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>