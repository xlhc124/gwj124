import { reqspecsList,reqspecsCount  } from "../../utils/http"
const state = {
    //分类list
    list: [],
    total:0,
    size:2,
    page:1
}

const mutations = {
    //修改list
    changeList(state, arr) {
        state.list = arr;
    },
    changeTotal(state,num){
        state.total=num
    },
    changePage(state,page){
        state.page=page
    }
}

const actions = {
    //发起请求
    reqList(context,bools) {
        let parmes=bools?{}:{ page: context.state.page, size: context.state.size }
        reqspecsList(parmes).then(res => {
            let list = res.data.list ? res.data.list : []
            if(list.length==0&&context.state.page>1){
                context.commit("changePage",context.state.page-1)
                // 重新获取reqList数据
                context.dispatch("reqList")
                return
            }
            list.forEach(item=>{
                item.attrs=JSON.parse(item.attrs)
            })
            context.commit("changeList", list)
        })
    },
    reqCount(context){
        reqspecsCount().then(res=>{
            context.commit("changeTotal", res.data.list[0].total)

        })
    },
    changePage(context,page){
        context.commit("changePage",page)
        context.dispatch("reqList")
    }
}

const getters = {
    list(state) {
        return state.list
    },
    total(state){
        return state.total
    },
    size(state){
        return state.size
    },
}

export default {
    state, mutations, getters, actions,
    namespaced: true
}