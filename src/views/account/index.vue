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
            placeholder="Enter user name"
            clearable

            @input="changeValue"
          />
        </el-col>
      </el-row>
      <div>
        <el-table :data="userList">
          <el-table-column align="center">
            <template v-slot="{ row }">
              <span class="username">{{ row.name?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" align="center" fixed/>
          <el-table-column prop="companyName" label="Company" sortable align="center" />
          <el-table-column prop="mobile" label="Mobile" sortable align="center" />
          <el-table-column prop="email" label="Email" sortable align="center" />
          <el-table-column prop="state" label="State" align="center" >
            <template v-slot="{ row }">
              <span v-if="row.state === 1">Enable</span>
              <span v-else-if="row.state === 0">Disable</span>
              <span v-else>None</span>
            </template>
          </el-table-column>
          <el-table-column label="Operations" align="center" fixed="right">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="btnEdit(row.id)">Edit</el-button>
              <el-popconfirm
                confirm-button-text="Confirm"
                cancel-button-text="Cancel"
                title="Are you sure to delete the user?"
                v-if="row.level=='user'"
                @onConfirm="btnDel(row.id)"
              >
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
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
      <el-dialog :title="dialogTitle" :visible="showDialog" :fullscreen="isFullScreen" @close="btnCancel">
        <el-form ref="userDialog" :model="userForm" :rules="rules" label-width="30%">
          <el-form-item prop="name" label="Name">
            <el-input v-model="userForm.name" placeholder="Please enter the user name" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item prop="mobile" label="Mobile">
            <el-input v-model="userForm.mobile" placeholder="Please enter the mobile number" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item prop="email" label="Email">
            <el-input v-model="userForm.email" placeholder="Please enter the Email address" style="width: 90%" size="mini" />
          </el-form-item>
          <el-form-item prop="state" label="State">
            <el-switch v-model="userForm.state" :active-value="1" :inactive-value="0" size="mini" />
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
import { getUserList, getUser, delUser, addUser, updateUser } from '@/api/user'
export default {
  name: 'Account',
  data() {
    return {
      isFullScreen: false,
      roleList: [],
      userList: [],
      dialogTitle: 'Add New User',
      pageParams: {
        page: 1,
        pagesize: 8,
        total: 0,
        keyword: ''
      },
      showDialog: false,
      userForm: {
        name: '',
        mobile: '',
        email: '',
        state: 0
      },
      rules: {
        name: [{ required: true, message: 'Name cannot be empty.', trigger: 'blur' }],
        description: [{ required: false, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getUserList() {
      const { rows, total } = await getUserList(this.pageParams)
      this.userList = rows
      this.pageParams.total = total
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getUserList()
    },
    selectNode(node) {
      this.pageParams.roleId = node.id
      this.pageParams.page = 1
      this.getUserList()
    },
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.pageParams.page = 1
        this.getUserList()
      }, 300)
    },
    btnAdd() {
      this.showDialog = true
    },
    async btnEdit(id) {
      this.userForm = await getUser(id)
      this.showDialog = true
    },
    btnOK() {
      this.$refs.userDialog.validate(async isOK => {
        if (isOK) {
          if (this.userForm.id) {
            await updateUser(this.userForm.id, this.userForm)
            this.$message.success('Update user successed')
          } else {
            await addUser(this.userForm)
            this.$message.success('Add new user successed')
          }
          this.getUserList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.userForm = {
        name: '',
        mobile: '',
        email: '',
        password: '',
        state: 0
      }
      this.$refs.userDialog.resetFields()
      this.showDialog = false
    },
    async btnDel(id) {
      await delUser(id)
      this.$message.success('Delete user successed')
      if (this.userList.length === 1) this.pageParams.page--
      this.getUserList()
    },
    updateVisibility() {
      this.isFullScreen = window.innerWidth <= 800;
    }
  }
}
</script>
<style scoped>
.app-container {
  background: #fff;
  padding: 30px;
  .username {
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
</style>
