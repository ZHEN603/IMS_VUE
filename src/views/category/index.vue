<template>
  <div class="container">
    <div class="app-container">
      <el-row class="operate-tools" type="flex" justify="end">
        <el-button v-per-remove="BTN-CAT-ADD" size="mini" type="primary" @click="btnAdd('0')">Add Category</el-button>
      </el-row>
      <el-table default-expand-all :data="categoryList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="Name" fixed/>
        <el-table-column prop="description" align="center" label="Description" />
        <el-table-column align="center" label="Operations" fixed="right">
          <template v-slot="{ row }">
            <el-button v-per-remove="BTN-CAT-ADD" size="mini" type="text" @click="btnAdd(row.id)">Add</el-button>
            <el-button v-per-remove="BTN-CAT-EDIT" type="text" size="mini" v-if="row.id!='0'" @click="btnEdit(row.id)">Edit</el-button>
            <el-popconfirm
              confirm-button-text="Confirm"
              cancel-button-text="Cancel"
              title="Are you sure to delete the category?"
              v-if="row.id!='0'"
              @onConfirm="btnDel(row.id)"
            >
              <el-button v-per-remove="BTN-CAT-DEL" slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible="showDialog" :fullscreen="isFullScreen" @close="btnCancel">
      <el-form ref="categoryForm" :model="categoryFrom" :rules="rules" label-width="30%">
        <el-form-item label="Name" prop="name">
          <el-input v-model="categoryFrom.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="categoryFrom.description" style="width:90%" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">Confirm</el-button>
          <el-button size="small" @click="btnCancel">Cancel</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getCategoryList, updateCategory, addCategory, getCategoryDetail, delCategory } from '@/api/category'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      isFullScreen: false,
      categoryList: [],
      categoryFrom: {
        name: '',
        description: '',
        pid: ''
      },
      rules: {
        name: [{ required: true, message: 'Name cannot be empty', trigger: 'blur' }]
      },
      showDialog: false,
      title: 'Add New Category'
    }
  },
  created() {
    this.getCategoryList()
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getCategoryList() {
      this.categoryList = transListToTreeData(await getCategoryList(), '0')
    },
    btnAdd(pid) {
      this.title = 'Add New Category'
      this.categoryFrom.pid = pid
      this.showDialog = true
    },
    btnOK() {
      this.$refs.categoryForm.validate(async isOK => {
        if (isOK) {
          if (this.categoryFrom.id) {
            await updateCategory(this.categoryFrom)
            this.$message.success('Successfully updated the category')
          } else {
            await addCategory(this.categoryFrom)
            this.$message.success('Successfully added new category')
          }
          this.getCategoryList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.showDialog = false
      this.categoryFrom = {
        name: '',
        description: '',
        pid: ''
      }
      this.$refs.categoryForm.resetFields()
    },
    async btnEdit(id) {
      this.title = 'Edit Category'
      this.categoryFrom = await getCategoryDetail(id)
      this.showDialog = true
    },
    async btnDel(id) {
      await delCategory(id)
      this.$message.success('Successfully deleted the category')
      this.getCategoryList()
    },
    updateVisibility() {
      this.isFullScreen = window.innerWidth <= 800;
    }
  }
}
</script>
<style>
.operate-tools {
  padding: 10px;
}
</style>
