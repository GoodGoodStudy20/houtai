<template>
  <div>
    <div v-for="(item,i) in list" :key='i'>
      <el-submenu :index="index+'-'+i" v-if="!item.path && item.child && item.child.length">
        <template slot="title">
          <i :class="item.menuIcon?item.menuIcon:'el-icon-s-unfold'" style="color:#fff;padding-right:15px"></i>
          <span>{{item.label}}</span>
        </template>
        <div v-for="(item2,k) in item.child" :key="k">
          <el-menu-item :index="item2.path" v-if="item2.path">
            <i :class="item2.menuIcon?item2.menuIcon:' '" style="color:#fff;padding-right:15px"></i>
            <span>{{item2.label}}</span>
          </el-menu-item>
        </div>
        <Submenu :list='item.child' v-if="item.child && item.child.length" :index="index+'-'+i"></Submenu>
      </el-submenu>
      <el-menu-item :index="item.path" v-if="item.path && item.parentId==0">
        <i :class="item.menuIcon?item.menuIcon:' '" style="color:#fff;padding-right:15px"></i>
        <span>{{item.label}}</span>
      </el-menu-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Submenu',
  props: ['list', 'index', 'collapse'],
}
</script>

<style>
</style>