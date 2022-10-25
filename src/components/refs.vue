<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>{{num}}</p>
    <p>{{name}}:{{age}}</p>
    <div @click="edit">点击修改</div>
  </div>
</template>

<script>
import { ref, reactive, toRefs } from "vue"
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    const num = ref(0)
    const obj = reactive({ name: '一', age: 16 })
    obj.count++
    function edit() {
      obj.name = '二';
      obj.age++
    }
    // console.log(props.msg);
    console.log(obj);
    let { name, age } = toRefs(obj)

    num.value = 5
    // ...toRefs(obj),
    return { num, edit, name, age }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
