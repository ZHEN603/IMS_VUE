<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="40%">
          <el-row>
            <el-col :span="12">
              <el-form-item label="Name" prop="name">
                <el-input v-model="userInfo.name" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Mobile" prop="mobile">
                <el-input
                  v-model="userInfo.mobile"
                  size="mini"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="userInfo.email"
                  size="mini"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="New Password" prop="password">
                <el-input
                  v-model="userInfo.password"
                  autocomplete="off"
                  show-password
                  size="mini"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary" @click="saveData">Confirm</el-button>
              <el-button size="mini" @click="btnCancel">Cancel</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from '@/api/user'
import store from '../../store'
export default {
  data() {
    return {
      userInfo: {
        name: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [{ required: true, message: 'please enter your name', trigger: 'blur' }, {
          min: 1, max: 10, message: 'Name should be between 1-4 letters'
        }],
        password: [{
          trigger: 'blur',
          min: 6,
          max: 16,
          message: 'The length of the new password should be between 6-16 characters'
        }]
      }

    }
  },
  created() {
    this.getUser()
  },
  methods: {
    async getUser() {
      this.userInfo = await getUser(store.state.user.userInfo?.userId)
    },
    saveData() {
      this.$refs.userForm.validate(async isOK => {
        if (isOK) {
          if (this.userInfo.id) {
            await updateUser(this.userInfo.id,this.userInfo)
            this.$message.success('Update profile successful.')
          }
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.userInfo = {
        name: '',
        mobile: '',
        email: '',
        password: ''
      }
      this.$refs.userForm.resetFields()
      this.$router.go(-1)
    },
  }
}
</script>

<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 90%
  }
}
@media (max-width: 800px) {
  .edit-form {
  .inputW {
    width: 70vw
  }
}
}

</style>

