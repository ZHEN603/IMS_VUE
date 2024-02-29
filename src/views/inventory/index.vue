<template>
  <div class="container">
    <div class="app-container">
      <div class="toggle-button" @click="toggleSidebar" :style="{ left: isSidebarVisible ? '40vw' : '0px' }">
        <i :class="isSidebarVisible ? 'el-icon-s-fold' : 'el-icon-s-unfold'" ></i>
      </div>
      <div class="left" v-show="isSidebarVisible">
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
          ref="categoryTree"
          node-key="id"
          indent="10"
          :data="categoryList"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          :current-node-key="pageParams.categoryId"
        >
          <span slot-scope="{ data }" class="custom-tree-node" @click="selectNode(data.id)">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
      <div class="right">

        <el-table :data="productList" :row-class-name="rowStyle">
          <el-table-column prop="productName" label="Name" sortable align="center" fixed/>
          <el-table-column prop="quantity" align="center" label="Quantity">
            <template v-slot="{ row }">
              <el-input v-if="row.isEdit" v-model.number="row.editRow.quantity" size="mini" />
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lowStock" align="center" label="Low Stock">
            <template v-slot="{ row }">
              <el-input v-if="row.isEdit" v-model.number="row.editRow.lowStock" size="mini" />
              <span v-else>{{ row.lowStock }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="state" align="center" width="200" label="State">
            <template v-slot="{ row }">
              <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
              <span v-else>  {{ row.state === 1 ? "Enable" : row.state === 0 ? "Disable" : "None" }} </span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="Operations" fixed="right">
            <template v-slot="{ row }">
              <template v-if="row.isEdit">
                <el-button type="primary" size="mini" @click="btnEditOK(row)">Confirm</el-button>
                <el-button size="mini" @click="row.isEdit = false">Cancel</el-button>
              </template>
              <template v-else>
                <el-button v-per-remove="BTN-INVEN-EDIT" size="mini" type="text" @click="btnEditRow(row)">Edit</el-button>
              </template>
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
    </div>
  </div>
</template>
<script>
import { getCategoryList } from '@/api/category'
import { getInventoryList, updateInventory } from '@/api/inventory'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Inventory',
  data() {
    return {
      isSidebarVisible: true,
      categoryList: [],
      productList: [],
      pageParams: {
        page: 1,
        pagesize: 8,
        total: 0,
        categoryId: '0',
        keyword: ''

      },
      inventoryForm: {
        quantity: '',
        state: 0,
        lowStock: ''
      },
      rules: {
        // name: [{ required: true, message: 'Inventory name cannot be empty.', trigger: 'blur' }],
        description: [{ required: false, trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getCategory()
    this.getInventoryList()
    this.updateVisibility()
    window.addEventListener('resize', this.updateVisibility)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVisibility);
  },
  methods: {
    async getCategory() {
      const result = transListToTreeData(await getCategoryList(), '0')
      this.categoryList = [
        { 'name': 'All Products', 'id': '0', 'children': result }
      ]
    },
    async getInventoryList() {
      const { rows, total } = await getInventoryList(this.pageParams)
      this.productList = rows
      this.pageParams.total = total
      this.productList.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          state: item.state,
          quantity: item.quantity,
          lowStock: item.lowStock,
        })
      })
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getInventoryList()
    },
    selectNode(id) {
      this.pageParams.categoryId = id
      this.pageParams.page = 1
      this.getInventoryList()
    },
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.pageParams.page = 1
        this.getInventoryList()
      }, 300)
    },
    btnEditRow(row) {
      console.log(123)
      row.isEdit = true
      row.editRow.state = row.state
      row.editRow.quantity = row.quantity
      row.editRow.lowStock = row.lowStock
    },
    async btnEditOK(row) {
      if (row.editRow.lowStock>=0 && row.editRow.quantity>=0) {
        await updateInventory({ ...row.editRow, id: row.id })
        this.$message.success('Update product successed')
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })
        this.getInventoryList()
        this.btnCancel()
      }else {
        this.$message.warning('Name cannot be empty')
      }
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    updateVisibility() {
      this.isSidebarVisible = window.innerWidth > 800;
    },
    rowStyle({ row }) {
      if (row.difference < 0) {
        return 'highlight-row';
      }
      return '';
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
  background: #fff;
  display: flex;
  .left {
    position: none;
    width: 25%;
    padding: 20px;
    border-right: 1px solid #eaeef4;
    font-size: 14px;
    z-index: 0;
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
    .productname {
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
    ::v-deep .el-table .highlight-row {
      background: oldlace !important;
    }
  }
}

@media (max-width: 800px) {
  .app-container {
    .left {
      position: fixed;
      top: 0;
      height: 100vh;
      width: 40vw;
      z-index: 999;
      left: 0;
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
