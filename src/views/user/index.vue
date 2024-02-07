<template>
  <div class="container">
    <div class="app-container">
      <div class="toggle-button" @click="toggleSidebar" :style="{ left: isSidebarVisible ? '40vw' : '0px' }">
        <i :class="isSidebarVisible ? 'el-icon-s-fold' : 'el-icon-s-unfold'" ></i>
      </div>
      <div class="left"  v-show="isSidebarVisible">
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
          ref="roleTree"
          node-key="id"
          indent="0"
          :data="roleList"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          :current-node-key="pageParams.roleId"
          @current-change="selectNode"
        >
          <span slot-scope="{ data }" class="custom-tree-node">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-per-remove="BTN-USER-ADD" size="mini" type="primary" @click="btnAdd">Add User</el-button>
        </el-row>
        <el-table :data="userList">
          <el-table-column align="center">
            <template v-slot="{ row }">
              <span class="username">{{ row.name?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" align="center" fixed/>
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
              <el-button v-per-remove="BTN-USER-EDIT" size="mini" type="text" @click="btnEdit(row.id)">Edit</el-button>
              <el-button v-per-remove="BTN-USER-ASSIGN" size="mini" type="text" @click="btnRole(row.id)">Role</el-button>
              <el-popconfirm
                confirm-button-text="Confirm"
                cancel-button-text="Cancel"
                title="Are you sure to delete the role?"
                v-if="row.level=='user'"
                @onConfirm="btnDel(row.id)"
              >
                <el-button v-per-remove="BTN-USER-DEL" slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
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
      <el-dialog title="Assign Roles" :visible="showRoleDialog"  :fullscreen="isFullScreen" @close="btnRoleCancel">
        <el-checkbox-group v-model="roleIds">
          <el-checkbox
            v-for="item in roleList[0].children"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-checkbox>
        </el-checkbox-group>
        <el-row slot="footer" type="flex" justify="center" style="margin-top: 30px;">
          <el-col :span="6">
            <el-button size="mini" type="primary" @click="btnRoleOK">Confirm</el-button>
            <el-button size="mini" @click="btnRoleCancel">Cancel</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getRoles, getRolesByUserId } from '@/api/role'
import { getUserList, getUser, delUser, addUser, assignRoles, updateUser } from '@/api/user'
export default {
  name: 'User',
  data() {
    return {
      isSidebarVisible: true,
      isFullScreen: false,
      roleList: [],
      userList: [],
      dialogTitle: 'Add New User',
      pageParams: {
        page: 1,
        pagesize: 8,
        total: 0,
        roleId: '0',
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
      },
      roleIds: [],
      showRoleDialog: false,
      assignId: ''
    }
  },
  created() {
    this.getRoles()
    this.getUserList()
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getRoles() {
      const result = await getRoles()
      this.roleList = [
        { 'name': 'All Users', 'id': '0', 'children': result }
      ]
    },
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
    async btnRole(id) {
      this.assignId = id
      this.roleIds = await getRolesByUserId(id)
      this.showRoleDialog = true
    },
    async btnRoleOK() {
      await assignRoles({
        id: this.assignId,
        roleIds: this.roleIds
      })
      this.$message.success('Successfully assign roles to user')
      this.showRoleDialog = false
    },
    btnRoleCancel() {
      this.roleIds = []
      this.showRoleDialog = false
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
  padding: 30px;
  .left {
    position: none;
    width: 25%;
    padding: 20px;
    border-right: 1px solid #eaeef4;
    font-size: 14px;
    z-index: 1;
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
}
@media (max-width: 800px) {
  .app-container {
    padding: 20px 0px;
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
