<template>
  <div>
    <!-- 展示list -->
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="uid"
      border
      :tree-props="{children: 'children'}"
    
    >
      <el-table-column prop="id" label="用户编号" sortable></el-table-column>
      <el-table-column prop="nickname" label="昵称" sortable></el-table-column>

      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
          <!-- <el-button type="danger" @click="del(scope.row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// import {reqMenuDel} from "../../../utils/http"
import {successAlert,errorAlert} from "../../../utils/http"
export default {
  // 接收list
  props: ["list"],
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    // // 28.删除
    // del(id) {
    //   this.$confirm("你确定要删除吗？", "删除提示", {
    //     confirmButtonText: "删除",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       //删除的请求
    //       reqMenuDel(id).then(res=>{
    //         if(res.data.code==200){
    //           //成功的弹框
    //           successAlert(res.data.msg)
    //           //29.通知父组件刷新list 
    //           this.$emit("init")
    //         }else{
    //           errorAlert(res.data.msg)
    //         }
    //       })
    //     })
    //     .catch(() => {
    //       console.log(" 你点了取消");
    //     });
    // },
    //31.点了编辑按钮
    edit(uid){
      //通知父组件，要编辑了
      this.$emit("edit",uid)
    }
  },
  mounted() {}
};
</script>
<style scoped>
</style>