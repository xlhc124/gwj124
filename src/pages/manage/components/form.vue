<template>
  <div>
    <!-- 4.绑定数据到模板 -->
    <!-- 40 绑定closed -->
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="所属角色" label-width="120px" prop="roleid">
          <!-- 9.通过v-model将user绑定到表单上 -->
          <el-select v-model="user.roleid" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :value="item.id"
              :label="item.rolename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px" prop="username">
          <!-- 9.通过v-model将user绑定到表单上 -->
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加管理员'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqRoleList,
  reqUserAdd,
  reqUserDetail,
  reqUserUpdate
} from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  // 3.接收info
  props: ["info"],
  data() {
    return {
      rules: {
        roleid: [
          { required: true, message: "请输入所属角色", trigger: "change" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
          ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          ]
      },
      //7.初始化user
      user: {
        roleid: "",
        username: "",
        password: "",
        status: 1
      },
      //  11.角色列表
      roleList: []
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    //6.点了取消
    cancel() {
      this.info.isshow = false;
    },
    //17.清空数据
    empty() {
      this.user = {
        roleid: "",
        username: "",
        password: "",
        status: 1
      };
    },

    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.roleid === "") {
          errorAlert("所属角色不能为空");
          return;
        }
        if (this.user.username === "") {
          errorAlert("用户名不能为空");
          return;
        }
        if (this.user.password === "") {
          errorAlert("密码不能为空");
          return;
        }
        resolve();
      });
    },
    //10.点了添加按钮
    add() {
      this.check().then(() => {
        reqUserAdd(this.user).then(res => {
          if (res.data.code == 200) {
            //弹成功
            successAlert("添加成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //24 刷新list
            this.$emit("init");
          }
        });
      });
      //16.ajax
    },
    //37 获取详情
    getOne(uid) {
      reqUserDetail(uid).then(res => {
        //此刻user没有id,有uid,而修改要的就是uid
        this.user = res.data.list;
        //处理密码
        this.user.password = "";
      });
    },
    //39 修改
    update() {
      this.check().then(() => {
        reqUserUpdate(this.user).then(res => {
          if (res.data.code == 200) {
            //弹成功
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //刷新list
            this.$emit("init");
          }
        });
      });
    },
    //41.处理消失
    closed() {
      if (this.info.title === "编辑管理员") {
        this.empty();
      }
    }
  },
  mounted() {
    //   12.一进来，先获取菜单列表数据
    reqRoleList().then(res => {
      if (res.data.code == 200) {
        this.roleList = res.data.list;
      }
    });
  }
};
</script>
<style scoped>
</style>