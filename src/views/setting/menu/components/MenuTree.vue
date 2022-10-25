<template>
  <el-container style="flex-direction: column;">
    <el-button size="mini" class="btn" type="primary" @click="addMenu({},'add')">新增</el-button>
    <el-tree ref="tree" :data="menuTree" show-checkbox node-key="id" :default-expanded-keys="defaultShow" :props="defaultProps">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{data.label}}</span>
        <span>
          <el-button type="text" size="mini" @click.stop="addMenu(data,'add')">
            新增
          </el-button>
          <el-button type="text" size="mini" @click.stop="addMenu(data,'edit')">
            修改
          </el-button>
          <el-button type="text" size="mini" @click.stop="delMenu(data)">
            删除
          </el-button>
        </span>
      </div>
    </el-tree>
    <el-button style="width:200px;margin:40px;" type="primary" v-debounce="saveMenu">保存</el-button>
    <MenuForm v-if="dialogMenu" v-model="dialogMenu" :menuType="menuType" :menuRow="menuRow" @success="getList"></MenuForm>
  </el-container>
</template>

<script>
import { getMenuList, setRoleMenu, deleteMenu } from '@/api/index'
import MenuForm from './MenuForm.vue'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'MenuTree',
  props: ['roleId'],
  components: {
    MenuForm
  },
  data() {
    return {
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      menuTree: [],
      defaultShow: [],
      menuRow: {},
      menuType: '',
      dialogMenu: false
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getMenuList().then((response) => {
        if (response.code == 200) {
          this.menuTree = response.data;
          this.defaultShow = response.data.map(v => v.id)
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    addMenu(row, type) {
      this.menuRow = row
      this.menuType = type
      this.dialogMenu = true
    },
    delMenu(row) {
      Confirm(`此操作将删除菜单：${row.label}, 是否继续?`, () => {
        deleteMenu({ id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        }).catch(err => {
          this.$message.error('删除失败')
        })
      })
    },
    saveMenu() {
      let menuIdArrs = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys());
      setRoleMenu({ menuIds: menuIdArrs, roleId: this.roleId })
        .then((response) => {
          this.$message({
            type: response.code == 200 ? 'success' : 'error',
            message: response.msg || response.error_msg || response.message,
            duration: 1500
          });
        });
    },
    setCheckedNodes(list = []) {
      this.$refs.tree.setCheckedNodes(list);
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
.btn {
  width: 70px;
  margin-left: 40px;
  margin-bottom: 20px;
}
</style>