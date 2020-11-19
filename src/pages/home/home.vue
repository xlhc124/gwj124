<template>
  <div>
    <div class="main" id="wrap"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import echarts from "echarts";
export default {
  computed: {
    ...mapGetters({
      list: "cate/list"
    })
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList"
    })
  },
  watch: {
    list: {
      handler() {
        if (this.list.length > 0) {
          let myChart = echarts.init(document.getElementById("wrap"));

          // 指定图表的配置项和数据
          var option = {
            title: {
              text: "月消费"
            },
            tooltip: {},
            legend: {
              data: ["日用品"]
            },
            xAxis: {
              data: this.list.map(item => item.catename)
            },
            yAxis: {},
            // series 数据
            series: [
              {
                name: "化妆品",
                type: "line",
                data: this.list.map(item =>
                  item.children ? item.children.length : 0
                )
              },
              {
                name: "香水",
                type: "bar",
                data: this.list.map(item =>
                  item.children ? item.children.length : 0
                )
              }
            ]
          };

          myChart.setOption(option);
        }
      },
      deep: true
    }
  },
  mounted() {
    //触发请求
    this.reqList();
  }
};
</script>
<style scoped>
.main {
  width: 80%;
  margin: 20px auto;
  height: 500px;
}
</style>