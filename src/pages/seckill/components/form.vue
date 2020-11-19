<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="活动名称" label-width="120px" prop="title">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="120px">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            @blur="change"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" label-width="120px">
          <el-select v-model="user.first_cateid" placeholder="请选择一级分类" @change="changeFirst">
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px">
          <el-select v-model="user.second_cateid" placeholder="请选择二级分类" @change="changesecond">
            <el-option
              v-for="item in changeList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="120px">
          <el-select v-model="user.goodsid" placeholder="请选择商品">
            <el-option
              v-for="item in secondList"
              :key="item.id"
              :value="item.id"
              :label="item.goodsname"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加活动'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import {
  reqcateList,
  reqgoodsList,
  reqseckAdd,
  reqseckDetail,
  reqseckUpdate
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "change" }
        ]
      },
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },
      //初始时间
      value1: [],
      //二级分类列表
      changeList: [],

      secondList: []
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      goodsList: "goods/list"
    })
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqList",
      reqgoodsList: "goods/reqList",
      reqseckList: "seck/reqList"
    }),
    //验证
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.title === "") {
          errorAlert("活动名称不能为空");
          return;
        }
        if (this.user.begintime === "" || this.user.endtime === "") {
          errorAlert("活动期限不能为空");
          return;
        }
        if (this.user.first_cateid === "") {
          errorAlert("一级分类不能为空");
          return;
        }
        if (this.user.second_cateid === "") {
          errorAlert("二级分类不能为空");
          return;
        }
        if (this.user.goodsid === "") {
          errorAlert("商品不能为空");
          return;
        }
        resolve();
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.user = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      };
      //初始时间
      this.value1 = [];

      this.changeList = [];
      this.secondList = [];
    },
    //根据一级分类id，得到二级分类list
    changeFirst() {
      //二级分类的id重置
      this.user.second_cateid = "";
      this.getSecondList();
    },
    //获取二级分类list
    getSecondList() {
      reqcateList({ pid: this.user.first_cateid }).then(res => {
        this.changeList = res.data.list;
      });
    },
    //根据二级分类的id，得到商品list
    changesecond() {
      //商品分类的id重置
      this.user.goodsid = "";
      this.getgoodsList();
    },
    getgoodsList() {
      let arr = this.goodsList.filter((item, index, array) => {
        return item.second_cateid === this.user.second_cateid;
      });
      this.secondList = arr;
    },
  // 对应的开始和结束时间
    change() {
      this.user.begintime = this.value1[0];
      this.user.endtime = this.value1[1];
    },

    //点击编辑弹出弹框
    getOne(id) {
      reqseckDetail(id).then(res => {
        this.user = res.data.list;
        this.user.id = id;
        //请二级list
        this.getSecondList();
        //请商品list
        this.getgoodsList();
        //对应时间
        this.value1 = [
          new Date(parseInt(res.data.list.begintime)),
          new Date(parseInt(res.data.list.endtime))
        ];
        console.log(this.value1);
      });
    },
    add() {
      this.check().then(() => {
        reqseckAdd(this.user).then(res => {
          successAlert("添加成功");
          this.cancel();
          this.empty();
          //刷新list
          this.reqseckList();
        });
      });
    },
    //点击编辑
    update() {
      this.check().then(() => {
        reqseckUpdate(this.user).then(res => {
          if (res.data.code == 200) {
            successAlert("更新成功");
            this.cancel();
            this.empty();
            this.reqseckList();
          }
        });
      });
    },
    //点击取消弹框消失
    closed() {
      if (this.info.title === "编辑活动") {
        this.empty();
      }
    }
  },
  mounted() {
    // 一进来就请求
    this.reqCateList();
    this.reqgoodsList(true);
  }
};
</script>
<style scoped>
</style>