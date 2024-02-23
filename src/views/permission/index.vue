<template>
  <div class="container">
    <div class="app-container">
      <el-row class="operate-tools" type="flex" justify="end">
        <el-button size="mini" type="primary" @click="btnAdd('0', 0)">Add Permission</el-button>
      </el-row>
      <el-table :data="permissionList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="Name" width="120px" fixed/>
        <el-table-column prop="code" align="center" label="Code" />
        <el-table-column prop="description" align="center" label="Description" />
        <el-table-column prop="State" align="center" label="State">
          <template v-slot="{ row }">
            <el-switch v-model="row.state" :active-value="1" :inactive-value="0" @change="changeState(row.id, $event)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations" fixed="right">
          <template v-slot="{ row }">
            <el-button size="mini" type="text" @click="btnAdd(row.id, row.type)">Add</el-button>
            <el-button type="text" size="mini" @click="btnEdit(row.id, row.type)">Edit</el-button>
            <el-popconfirm
              confirm-button-text="Confirm"
              cancel-button-text="Cancel"
              title="Are you sure to delete the permission?"
              @onConfirm="btnDel(row.id)"
            >
              <el-button slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :fullscreen="isFullScreen" :title="title" :visible="showDialog" @close="btnCancel">
      <el-form ref="permissionForm" :model="permissionFrom" :rules="rules" label-width="30%">
        <el-form-item label="Name" prop="name">
          <el-input v-model="permissionFrom.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input v-model="permissionFrom.code" style="width:90%" />
        </el-form-item>
        <template v-if="currentNodeType != 0">
          <el-form-item v-if="currentNodeType > 1||(currentNodeType === 1 && title == 'Add New Permission')" label="Permission Type" prop="code">
              <el-radio-group v-model="permissionFrom.type">
              <el-radio :label=2>Button</el-radio>
              <el-radio :label=3>Api</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item label="Description">
          <el-input v-model="permissionFrom.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="State">
          <el-switch
            v-model="permissionFrom.state"
            :active-value="1"
            :inactive-value="0"
          />
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
import { getPermissionList, updatePermission, addPermission, getPermissionDetail, delPermission, updatePermissionState } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      isFullScreen: false,
      permissionList: [],
      permissionFrom: {
        name: '',
        code: '',
        description: '',
        type: 1,
        pid: '',
        state: 0
      },
      rules: {
        name: [{ required: true, message: 'Name cannot be empty', trigger: 'blur' }],
        code: [{ required: true, message: 'Code cannot be empty', trigger: 'blur' }]
      },
      showDialog: false,
      title: 'Add New Permission',
      currentNodeType: 1
    }
  },
  created() {
    this.getPermissionList()
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getPermissionList() {
      this.permissionList = transListToTreeData(await getPermissionList(), '0')
    },
    btnAdd(pid, type) {
      this.title = 'Add New Permission'
      this.permissionFrom.pid = pid
      if(type === 0) {
        this.permissionFrom.type = 1
        this.currentNodeType = 0
      } else {
        this.currentNodeType = type
        this.permissionFrom.type = 2
      }
      this.showDialog = true
    },
    btnOK() {
      this.$refs.permissionForm.validate(async isOK => {
        if (isOK) {
          if (this.permissionFrom.id) {
            await updatePermission(this.permissionFrom)
            this.$message.success('Successfully updated the permission')
          } else {
            await addPermission(this.permissionFrom)
            this.$message.success('Successfully added new permission')
          }
          this.getPermissionList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.showDialog = false
      this.permissionFrom = {
        name: '',
        code: '',
        description: '',
        type: 1,
        pid: '',
        state: 0
      }
      this.$refs.permissionForm.resetFields()
    },
    async btnEdit(id, type) {
      this.title = 'Edit Permission'
      this.currentNodeType = type
      this.permissionFrom = await getPermissionDetail(id)
      console.log(this.permissionFrom)
      this.showDialog = true
    },
    async btnDel(id) {
      await delPermission(id)
      this.$message.success('Successfully deleted the permission')
      this.getPermissionList()
    },
    async changeState(id, $event) {
      console.log(id,$event)
      await updatePermissionState(id,$event)
      this.$message.success('Successfully updated the permission sate')
      this.getPermissionList()
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
