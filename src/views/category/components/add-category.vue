<template>
  <el-dialog :title="title" :visible="showDialog" @close="close">
    <el-form ref="addCategory" :model="formData" :rules="rules" label-width="140px">
      <el-form-item prop="name" label="Category Name">
        <el-input v-model="formData.name" placeholder="Please enter the category name" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="introduce" label="Introduction">
        <el-input v-model="formData.introduce" placeholder="Please enter the introduction" type="textarea" size="mini" :rows="4" style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="btnOK">Confirm</el-button>
            <el-button size="mini" @click="close">Cancel</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getCategory, addCategory, updateCategory, getCategoryDetail } from '@/api/category'
export default {
  name: 'addCategory',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: 'Add New Subcategory'
    },
  },
  data() {
    return {
      formData: {
        introduce: '',
        name: '',
        pid: ''
      },
      rules: {
        introduce: [{
          required: false
        }, {
          min: 0,
          max: 100,
          message: 'Category introduction no more than 100 words',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: 'Category name cannot be empty.',
          trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: 'Category name no more than 10 words', trigger: 'blur'
          }, {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              let result = await getCategory()
              if (this.formData.id) {
                result = result.filter(item => item.id !== this.formData.id)
              }
              if (result.some(item => item.name === value)) {
                callback(new Error('Category name already be used.'))
              } else {
                callback()
              }
            }
          }]
      }
    }
  },
  methods: {
    close() {
      this.formData = {
        introduce: '',
        name: '',
        pid: ''
      }
      this.$refs.addCategory.resetFields()
      this.$emit('update:showDialog', false)
    },
    btnOK() {
      this.$refs.addCategory.validate(async isOK => {
        if (isOK) {
          let msg = 'Add'
          if (this.formData.id) {
            msg = 'Update'
            await updateCategory(this.formData)
          } else {
            await addCategory({ ...this.formData, pid: this.currentNodeId })
          }
          this.$emit('updateCategory')
          this.$message.success(`${msg} Category Successed`)
          this.close()
        }
      })
    },
    async getCategoryDetail() {
      this.formData = await getCategoryDetail(this.currentNodeId)
      this.$emit('update:showDialog', true)
    }
  }
}
</script>
