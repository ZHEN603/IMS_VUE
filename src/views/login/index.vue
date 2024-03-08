<template>
  <div class="login-container">
    <div class="logo" v-show="isVisible"/>
    <div class="form">
      <h1>IMS</h1>
      <h2>Login</h2>
      <el-card shadow="never" class="login-card">
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="Please enter your email" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="Please enter your password" />
          </el-form-item>
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="login">Login</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      isVisible: window.innerWidth >800,
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [{
          required: true,
          message: 'Please enter your Email',
          trigger: 'blur'
        }, {
          message: 'Incorrect Email',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: 'Please enter your password',
          trigger: 'blur'
        }, {
          min: 6,
          max: 50,
          message: 'Password error',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    login() {
      this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          await this.$store.dispatch('user/login', this.loginForm)
          if(this.loginForm.password=='password'){
            this.$router.push('/profile')
          }else{
            this.$router.push('/')
          }

        }
      })
    },
    updateVisibility() {
      this.isVisible = window.innerWidth > 800;
    }
  }
}
</script>
<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h2 {
      padding-left: 20px;
      font-size: 24px;
    }
    h1 {
      padding-left: 20px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
@media (max-width: 800px) {
  .login-container {
    .logo {
      flex: 0;
    }
    div.form {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0px !important;
      padding-left: 0px !important;
      .el-card {
        border: none;
        padding: 0;
      }
      h2 {
        font-size: 24px;
      }
      h1 {
        padding-left: 0px;
        text-align: center;
      }
    }
    ::v-deep div.form {
      padding: 0px !important;
      padding-left: 0px !important;
    }
  }
}
</style>
