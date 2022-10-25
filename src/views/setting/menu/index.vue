<template>
  <div>
    <el-container>
      <el-aside width="220px" height="500px" style="border-right:1px solid #f1f1f1">
        <el-row>
          <el-col :span="24" style="margin-bottom:20px">
            <el-button type="primary" size="mini" @click="roleAdd">新增</el-button>
            <el-button type="primary" size="mini" @click="roleEdit">编辑</el-button>
            <el-button type="danger" size="mini" @click="roleDeleted">删除</el-button>
          </el-col>
        </el-row>
        <el-menu style="border-right:none!important;" class="el-menu-vertical-demo" background-color="#ffffff00">
          <div v-for="(item,index) in roleList" :key="index">
            <el-row class="tac" style="height:100%;">
              <el-col :span="24">
                <el-menu-item :index="index+''" @click.native="roleClick(item)">
                  <span style="font-size:18px;" slot="title">{{item.roleName}}</span>
                </el-menu-item>
              </el-col>
            </el-row>
          </div>
        </el-menu>
      </el-aside>
      <MenuTree ref="tree" :roleId="roleId"></MenuTree>
    </el-container>
    <RoleForm v-if="dialogAdd" v-model="dialogAdd" :editItem="editItem" :type="selType" @success="getRoleAll"></RoleForm>
  </div>

</template>
<script>
import { getRoleAll, getRoleMenu, deleteRole } from '@/api/index'
import RoleForm from './components/RoleForm.vue'
import MenuTree from './components/MenuTree.vue'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'account',
  components: {
    RoleForm, MenuTree
  },
  data() {
    return {
      roleId: '',              //角色id
      roleList: [],
      dialogAdd: false,
      editItem: {},
      selType: '',

    }
  },
  created() {
    this.getRoleAll();
  },
  methods: {
    getRoleAll() {
      getRoleAll().then((response) => {
        this.roleList = response.data;
        // this.roleClick(response.data[0])
      });
    },
    roleClick(item) {
      this.roleId = item.id;
      this.editItem = Object.assign({}, item)
      this.$refs.tree.setCheckedNodes([]);
      getRoleMenu({ roleId: item.id })
        .then((response) => {
          let list = []
          response.data.forEach(item => {
            if (item.child && item.child.length) {
              item.child.forEach(item2 => {
                list.push(item2)
              })
            } else {
              list.push(item)
            }
          })
          this.$refs.tree.setCheckedNodes(list);
        });
    },


    roleAdd() {
      this.dialogAdd = true
      this.selType = 'add'
    },
    roleEdit() {
      if (!this.roleId) {
        this.$message.warning('请先选择需要修改的角色')
        return
      }
      this.dialogAdd = true
      this.selType = 'edit'
    },
    roleDeleted() {
      if (!this.roleId) {
        this.$message.warning('请先选择需要删除的角色')
        return
      }
      Confirm(`此操作将删除角色：${this.editItem.roleName}, 是否继续?`, () => {
        deleteRole({ roleId: this.roleId }).then(res => {
          this.$refs.tree.setCheckedNodes([]);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getRoleAll()
        }).catch(err => {
          this.$message.error('删除失败')
        })
      })
    },
  },
}
</script>