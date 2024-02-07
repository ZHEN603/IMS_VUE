<template>
  <div class="container">
    <div class="app-container">
      <el-row class="operate-tools" type="flex" justify="end">
        <el-button v-per-remove="BTN-ROLE-ADD" size="mini" type="primary" @click="showDialog = true">Add Role</el-button>
      </el-row>
      <el-table :data="list">
        <el-table-column prop="name" align="center" label="Name" fixed>
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" label="State">
          <template v-slot="{ row }">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>  {{ row.state === 1 ? "Enable" : row.state === 0 ? "Disable" : "None" }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="Description">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations" fixed="right">
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="btnEditOK(row)">Confirm</el-button>
              <el-button size="mini" @click="row.isEdit = false">Cancel</el-button>
            </template>
            <template v-else>
              <el-button v-per-remove="BTN-ROLE-ASSIGN" size="mini" type="text" @click="btnPermission(row.id)">Assign</el-button>
              <el-button v-per-remove="BTN-ROLE-EDIT" size="mini" type="text" @click="btnEditRow(row)">Edit</el-button>
              <el-popconfirm
                confirm-button-text="Confirm"
                cancel-button-text="Cancel"
                title="Are you sure to delete the role?"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button v-per-remove="BTN-ROLE-DEL" slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
              </el-popconfirm>
            </template>
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
    <el-dialog :fullscreen="isFullScreen" title="Add New Role" :visible.sync="showDialog" @close="btnCancel">
      <el-form ref="roleForm" label-width="30%" :model="roleForm" :rules="rules">
        <el-form-item prop="name" label="Name">
          <el-input v-model="roleForm.name" style="width:90%" size="mini" />
        </el-form-item>
        <el-form-item label="Enable/Disable">
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="Description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:90%" size="mini" />
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
    <el-dialog :visible.sync="showPermissionDialog"  :fullscreen="isFullScreen" title="Assign Permission">
      <el-tree
        ref="permTree"
        check-strictly
        auto-expand-parent=true
        node-key="id"
        :data="permissionData"
        :props="{ label: 'name' }"
        show-checkbox
        :default-checked-keys="permIds"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="btnPermissionOK">Confirm</el-button>
          <el-button size="mini" @click="showPermissionDialog = false">Cancel</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, delRole, getRoleDetail, assignPerm } from '@/api/role'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Role',
  data() {
    return {
      isFullScreen: false,
      list: [],
      pageParams: {
        page: 1,
        pagesize: 8,
        total: 0
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: '',
        state: 0,
        companyId: ''
      },
      rules: {
        name: [{ required: true, message: 'Role name cannot be empty.', trigger: 'blur' }],
        description: [{ required: false, trigger: 'blur' }]
      },
      showPermissionDialog: false,
      permissionData: [],
      currentRoleId: null,
      permIds: []
    }
  },
  created() {
    this.getRoleList()
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      this.list.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description,
          companyId: item.companyId
        })
      })
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('Add new role successed')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: '',
        state: 0
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    btnEditRow(row) {
      row.isEdit = true
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async  btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('Successfully updated the role')
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })
      } else {
        this.$message.warning('Name cannot be empty')
      }
    },
    async  confirmDel(id) {
      await delRole(id)
      this.$message.success('Successfully deleted the role')
      if (this.list.length === 1) this.pageParams.page--
      this.getRoleList()
    },
    async  btnPermission(id) {
      this.currentRoleId = id
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      this.permissionData = transListToTreeData(await getPermissionList({state:1}), '0')
      this.showPermissionDialog = true
    },
    async  btnPermissionOK() {
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('Successfully assigned the role permissions')
      this.showPermissionDialog = false
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
