<template>
  <div class="container">
    <div class="app-container">
      <div class="toggle-button" :style="{ left: isSidebarVisible ? '40vw' : '0px' }" @click="toggleSidebar">
        <i :class="isSidebarVisible ? 'el-icon-s-fold' : 'el-icon-s-unfold'" ></i>
      </div>
      <div class="left" v-show="isSidebarVisible">
        <el-input
          v-model="pageParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="Enter keyword"
          clearable
          @input="changeValue"
        />
        <el-tree
          ref="categoryTree"
          node-key="id"
          indent="10"
          :data="categoryList"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          :current-node-key="pageParams.categoryId"
        >
          <span slot-scope="{ data }" class="custom-tree-node" @click="selectNode(data.id)">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>

      <div class="right">

        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-per-remove="BTN-PRO-ADD" size="mini" type="primary" @click="btnAdd">Add Product</el-button>
        </el-row>
        <el-table :data="productList">
          <el-table-column prop="name" label="Name" align="center" fixed/>
          <el-table-column prop="price" label="Price" sortable align="center" />
          <el-table-column prop="discount" label="Discount" sortable align="center" />
          <el-table-column prop="cost" label="Cost" sortable align="center" />
          <el-table-column prop="code" label="Code" sortable align="center" />
          <el-table-column prop="categoryName" label="Category" sortable align="center" />
          <el-table-column prop="description" label="Description" sortable align="center" />
          <el-table-column label="Operations" align="center" fixed="right">
            <template v-slot="{ row }">
              <el-button v-per-remove="BTN-PRO-EDIT" size="mini" type="text" @click="btnEdit(row.id)">Edit</el-button>
              <el-popconfirm
                confirm-button-text="Confirm"
                cancel-button-text="Cancel"
                title="Are you sure to delete the role?"
                @onConfirm="btnDel(row.id)"
              >
                <el-button v-per-remove="BTN-PRO-DEL" slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="pageParams.total"
            :current-page="pageParams.page"
            :page-size="pageParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
      <el-dialog :title="dialogTitle" :fullscreen="isFullScreen" :visible="showDialog" @close="btnCancel">
        <el-form ref="productDialog" :model="productForm" :rules="rules" label-width="30%">
          <el-form-item prop="name" label="Name">
            <el-input v-model="productForm.name" placeholder="Please enter the product name" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item prop="price" label="Price">
            <el-input v-model="productForm.price" placeholder="Please enter the price" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item prop="discount" label="Discount">
            <el-input v-model="productForm.discount" placeholder="Please enter the discount" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item prop="cost" label="Cost">
            <el-input v-model="productForm.cost" placeholder="Please enter the cost" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item prop="code" label="Code">
            <el-input v-model="productForm.code" placeholder="Please enter the code" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item prop="categoryId" label="Category">
            <el-cascader
              v-model="productForm.categoryId"
              placeholder="Please enter the price"
              style="width: 90%"
              size="mini"
              ref="cascaderLabel"
              :options="categoryList"
              separator="/"
              :props="{label:'name',value:'id',checkStrictly: true}"
              :show-all-levels="false"
              clearable
              filterable
            />
          </el-form-item>
          <el-form-item prop="description" label="Description">
            <el-input v-model="productForm.description" type="textarea" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item v-if="this.dialogTitle=='Add New product'" prop="quantity" label="Quantity">
            <el-input v-model.number="productForm.quantity" placeholder="Please enter the price" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item v-if="this.dialogTitle=='Add New product'" prop="lowStock" label="Low Stock">
            <el-input v-model.number="productForm.lowStock" placeholder="Please enter the price" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-button size="mini" type="primary" @click="btnOK">Confirm</el-button>
                <el-button size="mini" @click="btnCancel">Cancel</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getCategoryList } from '@/api/category'
import { getProductList, getProductDetail, delProduct, addProduct, updateProduct } from '@/api/product'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Product',
  data() {
    return {
      isSidebarVisible: true,
      isFullScreen: false,
      categoryList: [],
      productList: [],
      dialogTitle: 'Add New product',
      pageParams: {
        page: 1,
        pagesize: 8,
        total: 0,
        categoryId: '0',
        keyword: ''

      },
      showDialog: false,
      productForm: {
        name: '',
        price: '',
        discount: '',
        cost: '',
        categoryId: '',
        categoryName: '',
        description: '',
        code: '',
        quantity: 0,
        lowStock: 10
      },
      rules: {
        name: [{ required: true, message: 'Product name cannot be empty.', trigger: 'blur' }],
        description: [{ required: false, trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getCategory()
    this.getProductList()
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getCategory() {
      const result = transListToTreeData(await getCategoryList(), '0')
      this.categoryList = [
        { 'name': 'All Products', 'id': '0', 'children': result }
      ]
    },
    async getProductList() {
      const { rows, total } = await getProductList(this.pageParams)
      this.productList = rows
      this.pageParams.total = total
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getProductList()
    },
    selectNode(id) {
      this.pageParams.categoryId = id
      this.pageParams.page = 1
      this.getProductList()
    },
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.pageParams.page = 1
        this.getProductList()
      }, 300)
    },
    btnAdd() {
      this.showDialog = true
    },
    async btnEdit(id) {
      this.productForm = await getProductDetail(id)
      this.dialogTitle='Edit product'
      this.showDialog = true
    },
    btnOK() {
      if(typeof this.productForm.categoryId != 'string'){
        this.productForm.categoryId = this.productForm.categoryId[this.productForm.categoryId.length - 1]
      }
      this.productForm.categoryName = this.$refs['cascaderLabel'].getCheckedNodes()[0].label
      this.$refs.productDialog.validate(async isOK => {
        if (isOK) {
          if (this.productForm.id) {
            await updateProduct(this.productForm)
            this.$message.success('Update product successed')
          } else {
            await addProduct(this.productForm)
            this.$message.success('Add new product successed')
          }
          this.getProductList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.showDialog = false
      this.dialogTitle='Add New product'
      this.productForm = {
        name: '',
        price: '',
        discount: '',
        cost: '',
        categoryId: '',
        categoryName: '',
        description: '',
        code: '',
        quantity: 0,
        lowStock: 10
      }
      this.$refs.productDialog.resetFields()
    },
    async btnDel(id) {
      await delProduct(id)
      this.$message.success('Delete product successed')
      if (this.productList.length === 1) this.pageParams.page--
      this.getProductList()
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    updateVisibility() {
      this.isSidebarVisible = window.innerWidth > 800;
      this.isFullScreen = window.innerWidth <= 800;
    }
  }
}
</script>
<style scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    position: none;
    width: 25%;
    padding: 20px;
    border-right: 1px solid #eaeef4;
    font-size: 14px;
    z-index: 0;
    background-color: #fff;

  }
  .toggle-button {
    position: fixed;
    display: none;
    left: 0;
    bottom: 20px;
    height: 30px;
    width: 30px;
    border-radius: 15%;
    background-color: #1890ff;
    color: #fff;
    cursor: pointer;
    z-index: 1000;
    font-size: 30px;
  }
  .right {
    width: 75%;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .productname {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

@media (max-width: 800px) {
  .app-container {
    .left {
      position: fixed;
      height: 100vh;
      width: 40vw;
      z-index: 999;
      left: 0;
      top: 0;
    }
    .right {
      width: 100%;
      padding: 0px;
    }
    .toggle-button {
      display: block;
    }
  }
}
</style>
