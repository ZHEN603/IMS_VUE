<template>
  <div class="container">
    <div class="app-container">
      <el-row class="operate-tools" type="flex" justify="space-between">
        <el-col :span="6">
          <el-input
            v-model="pageParams.keyword"
            style="margin-bottom:10px"
            type="text"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="Enter supplier name"
            clearable

            @input="changeValue"
          />
        </el-col>
        <el-col :span="18" >
          <el-button v-per-remove="BTN-SU-ADD" size="mini" type="primary" style="float: inline-end;" @click="btnAdd">Add Supplier</el-button>
        </el-col>
      </el-row>
      <el-table :data="supplierList">
        <el-table-column prop="name" label="Name" align="center" fixed/>
        <el-table-column prop="mobile" label="Mobile" sortable align="center" />
        <el-table-column prop="email" label="Email" sortable align="center" />
        <el-table-column prop="description" label="Description" sortable align="center" />
        <el-table-column label="Operations" align="center" fixed="right">
          <template v-slot="{ row }">
            <el-button v-per-remove="BTN-SU-EDIT" size="mini" type="text" @click="btnEdit(row.id)">Edit</el-button>
            <el-popconfirm
              confirm-button-text="Confirm"
              cancel-button-text="Cancel"
              title="Are you sure to delete the supplier?"
              @onConfirm="btnDel(row.id)"
            >
              <el-button v-per-remove="BTN-SU-DEL" slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <el-dialog :fullscreen="isFullScreen" :title="title" :visible="showDialog" @close="btnCancel">
      <el-form ref="supplierForm" label-width="30%" :model="supplierForm" :rules="rules">
        <el-form-item prop="name" label="Name">
          <el-input v-model="supplierForm.name" size="mini" style="width: 90%"/>
        </el-form-item>
        <el-form-item prop="mobile" label="Moblie">
          <el-input v-model="supplierForm.mobile" size="mini" style="width: 90%"/>
        </el-form-item>
        <el-form-item prop="email" label="Email">
          <el-input v-model="supplierForm.email" size="mini" style="width: 90%"/>
        </el-form-item>
        <el-form-item prop="description" label="Description">
          <el-input v-model="supplierForm.description" type="textarea" :rows="3" size="mini" style="width: 90%"/>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK">Comfirm</el-button>
              <el-button size="mini" @click="btnCancel">Cancel</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getSupplierList, addSupplier, updateSupplier, delSupplier, getSupplierDetail, updateSupplierState } from '@/api/supplier'
export default {
  name: 'Supplier',
  data() {
    return {
      supplierList: [],
      isFullScreen: false,
      pageParams: {
        page: 1,
        pagesize: 8,
        total: 0,
        keyword: ''
      },
      showDialog: false,
      title: 'Add New Supplier',
      supplierForm: {
        name: '',
        mobile: '',
        email: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: 'Supplier name cannot be empty.', trigger: 'blur' }],
        description: [{ required: false, trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getSupplierList()
    window.addEventListener('resize', this.updateVisibility)
    this.updateVisibility()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getSupplierList() {
      const { rows, total } = await getSupplierList(this.pageParams)
      this.supplierList = rows
      this.pageParams.total = total
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getSupplierList()
    },
    btnAdd() {
      this.title = 'Add New Supplier'
      this.showDialog = true
    },
    async btnEdit(id) {
      this.title = 'Edit Supplier'
      this.supplierForm = await getSupplierDetail(id)
      console.log(this.supplierForm)
      this.showDialog = true
    },
    btnOK() {
      this.$refs.supplierForm.validate(async isOK => {
        if (isOK) {
          if (this.supplierForm.id) {
            await updateSupplier(this.supplierForm)
            this.$message.success('Successfully updated the supplier')
          } else {
            await addSupplier(this.supplierForm)
            this.$message.success('Successfully added new supplier')
          }
          this.getSupplierList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.supplierForm = {
        name: '',
        mobile: '',
        email: '',
        description: ''
      },
      this.$refs.supplierForm.resetFields()
      this.showDialog = false
    },
    async btnDel(id) {
      await delSupplier(id)
      this.$message.success('Successfully deleted the supplier')
      if (this.supplierList.length === 1) this.pageParams.page--
      this.getSupplierList()
    },
    async changeState(id, $event) {
      console.log(id,$event)
      await updateSupplierState(id,$event)
      this.$message.success('Successfully updated the supplier sate')
      this.getSupplierList()
    },
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.pageParams.page = 1
        this.getSupplierList()
      }, 300)
    },
    updateVisibility() {
      this.isFullScreen = window.innerWidth <= 800;
    },
  }
}
</script>
<style>
.operate-tools {
  padding: 10px;
}
</style>
