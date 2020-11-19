<template>
  <div>
    <!-- 绑定info.isshow到模板 -->
    <!-- 弹框消失closed -->
    <el-dialog :title="info.title" :visible.sync="info.isshow" >
      <el-form :model="form" :rules="rules">
        <el-form-item label="手机号" label-width="120px" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="120px" prop="nickname">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>

        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>

        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
     
        <el-button type="primary" @click="update" class="xiugai">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import { reqMemberDetail, reqMemberUpdate } from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  // 接受info
  //   接收list
  props: ["info", "list"],
  data() {
    return {
      //icon集合
            rules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],

            },
      //初始化form,并通过v-model绑定数据到模板
      form: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1
      }
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    //点击了取消
    cancel() {
      this.info.isshow = false;
    },
    //上级菜单发生了修改
    changePid() {
      // 如果上级菜单是 顶级菜单，那么 form.type=1;否则是2
      if (this.form.uid === 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    // form置空
    empty() {
      this.form = {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1
      };
    },


    getOne(uid) {
      reqMemberDetail(uid).then(res => {
        //此时form上是没有id的
        this.form = res.data.list;
        //补id 是为了点击修改的时候有一个id值
        this.form.uid = uid;
      });
    },

            //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.form.nickname === "") {
          errorAlert("昵称不能为空");
          return;
        }
                if (this.form.phone === "") {
          errorAlert("手机号不能为空");
          return;
        }
                if (this.form.password === "") {
          errorAlert("密码不能为空");
          return;
        }

        resolve();
        
      });
      
    },
    //点了修改
    update() {
        this.check().then(() => {
      reqMemberUpdate(this.form).then(res => {
        if (res.data.code === 200) {
          //成功弹框
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //form重置
          this.empty();
          //列表刷新
          this.$emit("init");
        } else {
          errorAlert(res.data.msg);
        }
      });
        })

    },
  // closed(){
  //   if(this.info.title=="会员修改"){
  //     this.state.form.password="";

  //   }
  // },
  },
  mounted() {}
};
</script>
<style scoped>
.xiugai {
  float: left;
  margin-top: -60px;
  margin-left: 100px;
}
</style>