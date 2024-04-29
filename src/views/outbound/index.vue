<template>
  <div class="container">
    <div class="app-container">
      <el-row class="operate-tools" type="flex" justify="end">
        <el-button v-per-remove="BTN-OUT-ADD" size="mini" type="primary" @click="showDialog = true">Add Outbound Order</el-button>
      </el-row>
      <el-table
        :data="outboundList"
        style="width: 100%">
        <el-table-column type="expand" fixed>
          <template slot-scope="props">
            <el-table :data="props.row.orderItems" size="mini" :header-row-class-name="tableChildrenHeader" style="width: 100%">
                <el-table-column prop="productName" label="Name" align="center" > </el-table-column>
                <el-table-column prop="price" label="Price" align="center" > </el-table-column>
                <el-table-column prop="quantity" label="Quantity" align="center" > </el-table-column>
                <el-table-column prop="amount" label="Amount" align="center" > </el-table-column>
                <el-table-column label="Date" align="center" >
                  <template v-slot="{ row }">
                    {{ formatDate(row.updateTime) }}
                  </template>
                </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="Order No"
          prop="orderNo">
        </el-table-column>
        <el-table-column label="State" prop="state" align="center">
          <template v-slot="{ row }">
            <el-tag v-if="row.state==0" type="warning">Processing</el-tag>
            <el-tag v-if="row.state==1" type="success">Completed</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="Quantity" align="center" > </el-table-column>
        <el-table-column prop="amount" label="Amount" align="center" > </el-table-column>
        <el-table-column
          label="Description"
          prop="description">
        </el-table-column>
        <el-table-column
          label="Date" align="center" width="160px">
          <template v-slot="{ row }">
            {{ formatDate(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="Operations" align="center" >
            <template v-slot="{ row }">
              <el-button v-per-remove="BTN-OUT-EDIT" size="mini" type="text" @click="btnEdit(row.id)">Edit</el-button>
              <el-popconfirm
                confirm-button-text="Confirm"
                cancel-button-text="Cancel"
                title="Are you sure to delete the order?"
                @onConfirm="btnDel(row.id)"
              >
                <el-button v-per-remove="BTN-OUT-DEL" slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
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
    <el-dialog fullscreen=true :title="dialogTitle" :visible="showDialog" @close="btnCancel">
      <el-form ref="outboundForm" label-width="120px" :model="outboundForm" :rules="rules" style="margin:0 10%" >
        <el-form-item prop="oderNo" label="Order No">
          <el-input v-model="outboundForm.orderNo" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="Description">
          <el-input v-model="outboundForm.description" type="textarea" :rows="3" size="mini" />
        </el-form-item>
        <el-table :data="outboundForm.orderItems" ref='itemTable' key="isUpdate" >
          <el-table-column
            label="Name"
            prop="productName" align="center" fixed>
          </el-table-column>
          <el-table-column label="Price" prop="price" align="center">
            <template slot-scope="scope">
                <el-form-item :prop="'orderItems.'+scope.$index + '.price'"  label-width="0px"  class="form-item-center">
                  <el-input size="mini" v-model.number="scope.row.price" @input="updateFigure"></el-input>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Quantity" prop="quantity" align="center">
            <template slot-scope="scope">
                <el-form-item :prop="'orderItems.'+scope.$index + '.quantity'"  label-width="0px"  class="form-item-center">
                  <el-input size="mini" v-model.number="scope.row.quantity" @input="updateFigure"></el-input>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Amount" prop="amount" align="center" >
            <template slot-scope="scope">
                <el-form-item :prop="'orderItems.'+scope.$index + '.amount'" label-width="0px" class="form-item-center">
                  <el-input size="mini" v-model.number="scope.row.amount" :disabled="true"></el-input>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Operation" align="center">
            <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-delete" style="width: 100%;" type="danger" @click="rowDelete(scope.row)" />
              </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnAddOrderItem">Add Item</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="quantity" label="Quantity">
          <el-input v-model.number="outboundForm.quantity" size="mini" :disabled="true"/>
        </el-form-item>
        <el-form-item prop="amount" label="Amount">
          <el-input v-model.number="outboundForm.amount" size="mini" :disabled="true"/>
        </el-form-item>
        <el-form-item prop="pay" label="Pay">
          <el-input v-model="outboundForm.pay" size="mini" />
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
    <el-dialog fullscreen=true title="Select items" :visible.sync="showSelectionDialog" @close="btnSelectionCancel" class="selection">
      <el-row type="flex" justify="center">
        <div class="toggle-button" @click="toggleSidebar">
        <i :class="isSidebarVisible ? 'el-icon-s-fold' : 'el-icon-s-unfold'" ></i>
      </div>
      <el-col :span="12" class="left"  v-show="isSidebarVisible">
        <el-input
          v-model="selectionParams.keyword"
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
          :current-node-key="selectionParams.categoryId"
        >
          <span slot-scope="{ data }" class="custom-tree-node" @click="selectNode(data.id)">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="12" class="right">
        <el-table
          ref='multipleTable'
          :data="productList"
          :row-class-name="rowStyle"
          :row-key="(row) => row.id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            reserve-selection=true
            width="55">
          </el-table-column>
          <el-table-column prop="productName" label="Name" sortable align="center" />
          <el-table-column prop="quantity" align="center" label="Quantity">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
      <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnSelectionOK">Comfirm</el-button>
              <el-button size="mini" @click="btnSelectionCancel">Cancel</el-button>
            </el-col>
          </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getOutboundList, addOutbound, updateOutbound, delOutbound, getOutboundDetail } from '@/api/outbound'
import { getCategoryList } from '@/api/category'
import { getInventory } from '@/api/inventory'
import { transListToTreeData } from '@/utils'
import { getProduct } from '@/api/product'
export default {
  name: 'Outbound',
  data() {
    return {
      isSidebarVisible: false,
      outboundList: [],
      pageParams: {
        page: 1,
        pagesize: 8,
        type: 0,
        total: 0
      },
      dialogTitle: 'Add New Order',
      showDialog: false,
      outboundForm: {
        date: '',
        orderNo: '',
        status: '',
        description: '',
        state: 0,
        type: 0,
        quantity: 0,
        amount: 0,
        orderItems: [
        ]
      },
      rules: {
        name: [{ required: true, message: 'Outbound name cannot be empty.', trigger: 'blur' }],
        description: [{ required: false, trigger: 'blur' }]
      },

      isUpdate: Math.random(),
      isSelect: false,
      showSelectionDialog: false,
      selection: [],
      selectionNew: [],
      categoryList: [],
      productList: [],
      selectionParams: {
        categoryId: '0',
        keyword: ''
      },
      selectionKeys: []
    }
  },
  created() {
    this.getOutboundList()
    this.getSupplier()

  },
  methods: {
    async getOutboundList() {
      const { rows, total } = await getOutboundList(this.pageParams)
      this.outboundList = rows // 赋值数据
      this.pageParams.total = total
    },
    changePage(newPage) {
      this.pageParams.page = newPage // 赋值当前页码
      this.getOutboundList()
    },

    btnAddOrderItem(){
      this.dialogTitle= "Add New Order"
      this.showSelectionDialog = true
      this.getCategory()
      this.getInventoryList()
      this.$refs.multipleTable.clearSelection()
      console.log(this.selectionKeys)
      this.selectionKeys.forEach((key)=>{
        this.productList.forEach((row)=>{
          if (row.productId== key){
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        })
      })
    },
    async btnEdit(id) {
      this.outboundForm = await getOutboundDetail(id)
      this.selectionKeys=this.outboundForm.orderItems.map(item=>item.productId)
      this.dialogTitle= "Edit Order"
      this.showDialog = true
    },
    async btnDel(id){
      await delOutbound(id)
      this.$message.success('Delete Order successed')
      if (this.outboundList.length === 1) this.pageParams.page--
      this.getOutboundList()
    },
    rowDelete(row){
      console.log(row)
      const index = this.outboundForm.orderItems.findIndex(item => item.id === row.id);
      if (index !== -1) {
        this.outboundForm.orderItems.splice(index, 1);
        this.selectionKeys = this.selectionKeys.filter(item => item !== row.productId)
        this.updateFigure()
        console.log(this.selectionKeys)
      }
      this.isUpdate=Math.random()
    },
    btnOK() {
      this.$refs.outboundForm.validate(async isOK => {
        if (isOK) {
          if (this.outboundForm.id) {
            await updateOutbound(this.outboundForm)
            this.$message.success('Update new outbound successed')
          } else {
            await addOutbound(this.outboundForm)
            this.$message.success('Add new outbound successed')
          }
          this.getOutboundList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.outboundForm = {
        date: '',
        orderNo: '',
        status: '',
        description: '',
        state: 0,
        type: 0,
        quantity: 0,
        amount: 0,
        orderItems: [
        ]
      }
      this.$refs.outboundForm.resetFields()
      // this.$refs.multipleTable.clearSelection();
      this.selectionKeys=[]
      this.showDialog = false
    },

    async getCategory() {
      const result = transListToTreeData(await getCategoryList(), '0')
      this.categoryList = [
        { 'name': 'All Products', 'id': '0', 'children': result }
      ]
    },
    async getInventoryList() {
      this.productList = await getInventory(this.selectionParams)

    },

    selectNode(id) {
      this.selectionParams.categoryId = id
      this.getInventoryList()
    },
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getInventoryList()
      }, 300)
    },
    handleSelectionChange(selection,row){
      console.log(selection)
      this.selectionNew=selection
      this.isSelect=true
    },
    handleSelectionAll(row){
      console.log(row)
      this.selectionNew=row
      this.isSelect=true
    },
    async btnSelectionOK() {
      console.log(this.isSelect)
      if(this.isSelect){
        this.selectionKeys = await this.selectionNew.map(o=>o.productId)
        console.log(this.selectionKeys)
      }
      this.isSelect=false
      const res = await getProduct(this.selectionKeys)
      console.log("res")
      console.log(res)
      const mergedList = res.map(product => {
        const inventory = this.productList.find(item => item.productId === product.id);
        return {
          ...inventory,
          name: product.name,
          productName: product.name,
          price: product.price,
          quantity: 1
        };
      });
      console.log("mergedList")
      console.log(mergedList)
      console.log("this.outboundForm.orderItems")
      console.log(this.outboundForm.orderItems)
      const aMap = new Map(this.outboundForm.orderItems.map(item => [item.productId, item]));
      console.log(123)
      const combined = mergedList.map(item => {
        if (aMap.has(item.productId)) {
          return { ...item, ...aMap.get(item.productId) };
        }
        return item;
      });

      this.outboundForm.orderItems = combined
      this.updateFigure()
      this.isUpdate=Math.random()
      this.$refs.multipleTable.clearSelection()
      this.selectionParams = {
        categoryId: '0',
        keyword: ''
      }
      this.getCategory()
      this.getInventoryList()
      this.showSelectionDialog = false
    },
    btnSelectionCancel() {
      this.selectionNew = []
      this.$refs.multipleTable.clearSelection();
      this.isSelect=false
      this.showSelectionDialog = false
    },
    updateFigure() {
      let amount = 0
      let quantity = 0
      this.outboundForm.orderItems.forEach(item=>{
        item.amount=item.quantity*item.price
        amount+=item.amount
        quantity+=item.quantity
      })
      this.outboundForm.quantity=quantity
      this.outboundForm.amount=amount
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-UK", {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    },
    rowStyle({ row }) {
      if (row.difference < 0) {
        return 'highlight-row';
      }
      return '';
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    }
  }
}
</script>
<style scoped lang="scss">
.el-table .form-item-center {
  display: flex !important;
  align-items: center !important; /* 垂直居中 */
  justify-content: center !important; /* 水平居中 */
  height: 100% !important; /* 确保占满整个单元格的高度 */
  margin: 0 !important;
}
.operate-tools {
  padding: 10px;
}
.selection {
  .left {
    position: fixed;
    top: 0;
    left:0;
    width: 40vw;
    height: 100vh;
    padding: 20px;
    border-right: 1px solid #eaeef4;
    font-size: 14px;
    z-index: 1000;
    background-color: #fff;
  }
  .toggle-button {
    position: fixed;
    left: 0;
    bottom: 20px;
    height: 30px;
    width: 30px;
    border-radius: 15%;
    background-color: #1890ff;
    color: #fff;
    cursor: pointer;
    z-index: 1001;
    font-size: 30px;
  }
  .right {
    width: 100%;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
  }
  ::v-deep .el-table .highlight-row {
      background: oldlace !important;
  }
}
</style>
