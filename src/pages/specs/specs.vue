<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- .传递list数据 给list 组件 -->
    <!-- 绑定自定义事件init -->
    <!-- 绑定edit事件 -->
    <v-list @edit="edit"></v-list>

    <!-- 传递info给form  -->
    <!-- 绑定自定义事件init -->
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list.vue"
import vForm from "./components/form.vue"
// import {reqRoleList} from "../../utils/http"
export default {
  components:{
    vList,
    vForm
  },
  data(){
    return {
      // 初始值 弹框数据
      info:{
        isshow:false,
        title:"添加规格"
      },

    }
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    //点击了添加按钮
    willAdd(){
      this.info={
        isshow:true,
        title:"添加规格"
      }
    },

    //编辑
    edit(id){
      this.info={
        isshow:true,
        title:"编辑规格"
      }
      this.$refs.form.getOne(id)
    }
  },
  mounted() {

  }
};
</script>
<style scoped>
</style>