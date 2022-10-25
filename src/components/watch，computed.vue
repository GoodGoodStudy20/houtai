<template>
  <div class="hello">

    <p>{{count}}</p>
    <button @click="changeCount">修改count</button>
    <p>{{user.name}}</p>
    <button @click="changeUser">修改user</button>
    <p>{{msg1}}</p>
  </div>
</template>

<script>
import { ref, reactive, watch, watchEffect, computed } from "vue"
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup(props, context) {
    console.log(props);
    console.log(context);

    const count = ref(1)
    const msg1 = ref('123456')
    const user = reactive({
      name: 'zhang',
      age: 16,
      a: computed(() => {
        return msg1.value.split('').reverse().join('')
      })
    })
    const a = computed(() => {
      return msg1.value.split('').reverse().join('')
    })
    console.log(a.value);
    console.log(a.value);

    function changeCount() {
      count.value++
    }
    function changeUser() {
      user.name = 'li'
    }
    watch(count, (newVal, oldVal) => {
      console.log(newVal, oldVal);
    })
    watchEffect(() => {
      console.log(user.name);

    })
    return { ref, user, count, watch, changeCount, changeUser, watchEffect, msg1, computed }
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
