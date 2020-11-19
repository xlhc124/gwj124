<template>
  <div>

    <v-list :list="list" @init="init" @edit="edit($event)"></v-list>

    <v-form :info="info" :list="list" @init="init" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list.vue";
import vForm from "./components/form.vue";
import { reqMemberList } from "../../utils/http";
export default {
  data() {
    return {
      //弹框的状态
      info: {
        isshow: false,
        title:"会员修改"
      },
      
      list: []
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    //点了添加按钮
    // willAdd() {
    //   this.info.isshow = true;
    //   this.info.title="添加菜单"
    // },
    //26 处理
    init() {
      reqMemberList().then(res => {
        this.list = res.data.list;
      });
    },
    //处理编辑
    edit(uid){
      //弹框出现
      this.info.isshow=true
      // 给info补了一个字段，用来判断是添加还是编辑打开的弹框
      this.info.title="会员修改"
      //父组件调用子组件 form.vue 的getOne()
      this.$refs.form.getOne(uid)
    }
  },
  mounted() {
    //一进来就要请求数据
    this.init()
  },
  components: {
    vList,
    vForm
  }
};
</script>
<style scoped>
</style>