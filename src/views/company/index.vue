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
            placeholder="Enter company name"
            clearable

            @input="changeValue"
          />
        </el-col>
        <el-col :span="18" >
          <el-button size="mini" type="primary" style="float: inline-end;" @click="btnAdd">Add Company</el-button>
        </el-col>
      </el-row>
      <el-table :data="companyList">
        <el-table-column prop="name" label="Name" align="center" fixed width="130px"/>
        <el-table-column prop="type" label="Type" align="center"/>
        <el-table-column prop="mobile" label="Mobile" sortable align="center" />
        <el-table-column prop="email" label="Email" sortable align="center" />
        <el-table-column prop="address" label="Address" sortable align="center" />
        <el-table-column prop="managerId" label="Manager ID" sortable align="center" />
        <el-table-column label="State" align="center" >
          <template v-slot="{ row }">
            <el-switch v-model="row.state" :active-value="1" :inactive-value="0" @change="changeState(row.id, $event)"/>
          </template>
        </el-table-column>
        <el-table-column label="Operations" align="center" fixed="right">
          <template v-slot="{ row }">
            <el-button size="mini" type="text" @click="btnEdit(row.id)">Edit</el-button>
            <el-popconfirm
              confirm-button-text="Confirm"
              cancel-button-text="Cancel"
              title="Are you sure to delete the company?"
              @onConfirm="btnDel(row.id)"
            >
              <el-button slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
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
      <el-form ref="companyForm" label-width="30%" :model="companyForm" :rules="rules">
        <el-form-item prop="name" label="Name">
          <el-input v-model="companyForm.name" style="width:90%" size="mini" />
        </el-form-item>
        <el-form-item prop="type" label="Type">
          <el-select
            v-model="companyForm.type"
            filterable
            allow-create
            default-first-option
            placeholder="Please select type">
            <el-option
              v-for="item in types"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="mobile" label="Moblie">
          <el-input v-model="companyForm.mobile" style="width:90%" size="mini" />
        </el-form-item>
        <el-form-item prop="email" label="Email">
          <el-input v-model="companyForm.email" style="width:90%" size="mini" />
        </el-form-item>
        <el-form-item label="State">
          <el-switch v-model="companyForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="address" label="Address">
          <el-input v-model="companyForm.address" style="width:90%" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="Description">
          <el-input v-model="companyForm.description" type="textarea" :rows="3" style="width:90%" size="mini" />
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
import { getCompanyList, addCompany, updateCompany, delCompany, getCompanyDetail, updateCompanyState, getCompanyType } from '@/api/company'
export default {
  name: 'Company',
  data() {
    return {
      isFullScreen: false,
      companyList: [],
      pageParams: {
        page: 1,
        pagesize: 8,
        total: 0,
        keyword: ''
      },
      types: [],
      showDialog: false,
      title: 'Add New Company',
      companyForm: {
        name: '',
        mobile: '',
        email: '',
        description: '',
        state: 0,
        type: '',
        address: ''
      },
      rules: {
        name: [{ required: true, message: 'Company name cannot be empty.', trigger: 'blur' }],
        description: [{ required: false, trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getCompanyList()
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getCompanyList() {
      const { rows, total } = await getCompanyList(this.pageParams)
      this.companyList = rows
      this.pageParams.total = total
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getCompanyList()
    },
    async btnAdd() {
      this.title = 'Add New Company'
      this.types = await getCompanyType()
      this.showDialog = true
    },
    async btnEdit(id) {
      this.title = 'Edit Company'
      this.companyForm = await getCompanyDetail(id)
      this.types = await getCompanyType()
      this.showDialog = true
    },
    btnOK() {
      this.$refs.companyForm.validate(async isOK => {
        if (isOK) {
          if (this.companyForm.id) {
            await updateCompany(this.companyForm)
            this.$message.success('Successfully updated the company')
          } else {
            await addCompany(this.companyForm)
            this.$message.success('Successfully added new company')
          }
          this.getCompanyList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.companyForm = {
        name: '',
        mobile: '',
        email: '',
        description: '',
        state: 0,
        type: '',
        address: ''
      },
      this.$refs.companyForm.resetFields()
      this.showDialog = false
    },
    async btnDel(id) {
      await delCompany(id)
      this.$message.success('Successfully deleted the company')
      if (this.companyList.length === 1) this.pageParams.page--
      this.getCompanyList()
    },
    async changeState(id, $event) {
      console.log(id,$event)
      await updateCompanyState(id,$event)
      this.$message.success('Successfully updated the company sate')
      this.getCompanyList()
    },
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.pageParams.page = 1
        this.getCompanyList()
      }, 300)
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
