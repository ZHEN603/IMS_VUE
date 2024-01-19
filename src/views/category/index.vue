<template>
  <div class="container">
    <div class="app-container">
      <el-tree :expand-on-click-node="false" default-expand-all :data="category" :props="defaultProps" indent="40">
        <span slot-scope="{ data }" class="custom-tree-node">
          <span>{{ data.name }}</span>
          <span>
            <el-button type="text" size="mini" @click="btnAdd(data.id)">
              Add
            </el-button>
            <el-button type="text" size="mini" @click="btnEdit(data.id)">
              Edit
            </el-button>
            <el-button v-if="data.pid != data.companyId" type="text" size="mini" @click="btnDelete(data.id)">
              Delete
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <addCategory ref="addCategory" :show-dialog.sync="showDialog" :title="title" :current-node-id="currentNodeId" @updateCategory="getCategory" />
  </div>
</template>
<script>
import { getCategory, delCategory } from '@/api/category'
import { transListToTreeData } from '@/utils'
import addCategory from './components/add-category.vue'
export default {
  name: 'Category',
  components: { addCategory },
  data() {
    return {
      category: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false,
      currentNodeId: '',
      title: '',
      editData: null
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    async getCategory() {
      const result = await getCategory()
      // this.category = transListToTreeData(result, result[0].companyId);
      this.category = transListToTreeData(result, '0')
    },
    btnAdd(id) {
      this.currentNodeId = id
      this.title = 'Add New Subcategory'
      this.showDialog = true
    },
    btnEdit(id) {
      this.currentNodeId = id
      this.title = 'Edit Category'
      this.$nextTick(() => {
        this.$refs.addCategory.getCategoryDetail()
      })
      // this.showDialog = true
    },
    btnDelete(id) {
      this.$confirm('Are you sure you want to delete this category').then(async() => {
        await delCategory(id)
        this.$message.success('Delete successed')
        this.getCategory()
      })
    }
  }
}
</script>
<style>
  .app-container {
    padding: 30px 100px;
    font-size: 16px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
