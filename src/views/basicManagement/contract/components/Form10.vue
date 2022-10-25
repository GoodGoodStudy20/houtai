<template>
  <div style="margin:auto;width:1180px;">
    <el-form size="small" inline :disabled="disabled">
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label-width="80px" label="产品分类" prop="name" :rules="[{ required: true, message: '产品分类不可为空', trigger: 'blur' }]">
          <el-select @change="((val)=>{typeIdChange(val,i)})" v-model="item.productTypeId" placeholder="请选择">
            <el-option v-for="typeInfo in productTypeList" :key="typeInfo.id" :label="typeInfo.name" :value="typeInfo.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品" prop="productListId" :rules="[{ required: true, message: '产品不可为空', trigger: 'blur'}]">
          <el-select @change="((val)=>{productChange(val,i)})" v-model="item.productId" placeholder="请选择">
            <el-option v-for="productInfo in item.productList" :key="productInfo.id" :label="productInfo.name" :value="productInfo.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品单价（元）" prop="productPrice" :rules="[{ required: true, message: '产品价格不可为空', trigger: 'blur'}]">
          <el-input v-model="item.price" placeholder="请输入金额" style="width:180px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
          </el-input>
        </el-form-item>
        <el-form-item label=" " style="width:70px">
          <el-button type="primary" @click="addOne" v-show="i==list.length-1">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(i)" v-show="list.length>1">删除</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { deleteProductRelation, getProductTypeList, getProductList, getProductInfo } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import { NumberAdd } from '@/utils/index.js'
export default {
  name: 'Form10',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productTypeList: [],
      options2: [],
      list: [
        {
          productTypeId: '',      //类id
          productId: '',      //产品id
          price: '', //价格
          productList: []
        },
      ],
    }
  },
  created() {
    getProductTypeList({}).then((res) => {
      this.productTypeList = res.data
    })
  },
  computed: {
  },
  methods: {
    typeIdChange(id, index) {
      getProductList({ productTypeId: id }).then((res) => {
        this.list[index].productList = res.data
      })
    },
    onload(list) {
      let _this = this;
      _this.list = [];
      for (let item of list) {
        getProductList({ productTypeId: item.productTypeId }).then((res) => {
          item.productList = res.data
          _this.list.push(item)
        })
      }
    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]))
    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1)
      } else {
        Confirm(`此操作将删除内部往来信息, 是否继续?`, () => {
          deleteProductRelation({ id: this.list[i].id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list.splice(i, 1)
          }).catch(err => {
            this.$message.error('删除失败')
          })
        })
      }
    },
    commit() {
      let list = this.list.filter(item => item.productTypeId && item.productId && item.price).map(item => {
        return {
          productTypeId: item.productTypeId,      //产品分类信息
          productId: item.productId,      //产品信息
          price: item.price,      //价格
          id: item.id
        }
      })
      return list
    }
  }
}
</script>

<style>
</style>