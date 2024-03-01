<template>
  <div class="container">
    <div class="app-container">
      <el-row class="operate-tools" type="flex" justify="end">
        <el-button v-per-remove="BTN-IN-ADD" size="mini" type="primary" @click="showDialog = true">Add Inbound Order</el-button>
      </el-row>
      <el-table
        :data="inboundList"
        style="width: 100%">
        <el-table-column type="expand" fixed>
          <template slot-scope="props">
            <el-table :data="props.row.orderItems" size="mini" :header-row-class-name="tableChildrenHeader" style="width: 100%">
                <el-table-column prop="productName" label="Name" align="center" > </el-table-column>
                <el-table-column prop="cost" label="Cost" align="center" > </el-table-column>
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
        <el-table-column
          label="Supplier"
          prop="supplierName">
        </el-table-column>
        <el-table-column label="State" prop="state" align="center">
          <template v-slot="{ row }">
            <el-tag v-if="row.completeTime" type="success">Completed</el-tag>
            <el-switch v-else v-per-disabled="BTN-IN-STATE" v-model="row.state" :active-value="1" :inactive-value="0" @change="changeState(row.id, $event)"/>
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
        <el-table-column label="Operations" align="center">
            <template v-slot="{ row }">
              <el-button v-if="row.completeTime==null" v-per-remove="BTN-IN-COMP" size="mini" type="text" @click="btnComp(row.id)">Done</el-button>
              <el-button v-per-remove="BTN-IN-EDIT" size="mini" type="text" @click="btnEdit(row.id)">Edit</el-button>
              <el-popconfirm
                confirm-button-text="Confirm"
                cancel-button-text="Cancel"
                title="Are you sure to delete the role?"
                @onConfirm="btnDel(row.id)"
              >
                <el-button v-per-remove="BTN-IN-DEL" slot="reference" style="margin-left:10px" size="mini" type="text">Delete</el-button>
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
      <el-form ref="inboundForm" label-width="120px" :model="inboundForm" :rules="rules" style="margin:0 10%" >
        <el-form-item prop="oderNo" label="Order No">
          <el-input v-model="inboundForm.orderNo" size="mini" />
        </el-form-item>
        <el-form-item prop="supplierName" label="Supplier">
          <el-select v-model="inboundForm.supplierId"
          @change="getSupplierSelection" ref="supplierSelect" placeholder="Select Supplier">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Enable/Disable">
          <el-switch v-model="inboundForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="Description">
          <el-input v-model="inboundForm.description" type="textarea" :rows="3" size="mini" />
        </el-form-item>
        <el-table :data="inboundForm.orderItems" ref='itemTable' :key="isUpdate">
          <el-table-column
            label="Name"
            prop="productName" align="center" fixed>
          </el-table-column>
          <el-table-column label="Cost" prop="cost" align="center">
            <template slot-scope="scope">
                <el-form-item :prop="'orderItems.'+scope.$index + '.cost'"  label-width="0px" class="form-item-center">
                  <el-input size="mini" v-model.number="scope.row.cost" @input="updateFigure"></el-input>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Quantity" prop="quantity" align="center">
            <template slot-scope="scope">
                <el-form-item :prop="'orderItems.'+scope.$index + '.quantity'"  label-width="0px" class="form-item-center">
                  <el-input size="mini" v-model.number="scope.row.quantity" @input="updateFigure" ></el-input>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Forecast" prop="" align="center"  class="form-item-center">
            <template slot-scope="scope">
              <el-tag v-loading="loading" element-loading-spinner="el-icon-loading" style=" width: 100%; display: flex; justify-content: center; align-items: center; " >
              {{ scope.row.forecast }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Amount" prop="amount" align="center" class="form-item-center">
            <template slot-scope="scope">
                <el-form-item :prop="'orderItems.'+scope.$index + '.amount'" label-width="0px"  class="form-item-center">
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
          <el-input v-model.number="inboundForm.quantity" size="mini" :disabled="true"/>
        </el-form-item>
        <el-form-item prop="amount" label="Amount">
          <el-input v-model.number="inboundForm.amount" size="mini" :disabled="true"/>
        </el-form-item>
        <el-form-item prop="pay" label="Pay">
          <el-input v-model="inboundForm.pay" size="mini" />
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
      <el-col :span="12" class="left" v-show="isSidebarVisible">
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
        <el-table :data="productList" :row-key="(row) => row.id" ref='multipleTable' :row-class-name="rowStyle" max-height="" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            reserve-selection=true
            width="55">
          </el-table-column>
          <el-table-column prop="productName" label="Name" sortable align="center" />
          <el-table-column prop="quantity" align="center" label="Quantity">
          </el-table-column>
          <el-table-column prop="lowStock" align="center" label="Low Stock">
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
import { getInboundList, addInbound, updateInbound, delInbound, getInboundDetail, updateState, compInbound } from '@/api/inbound'
import { getCategoryList } from '@/api/category'
import { getSupplier } from '@/api/supplier'
import { getInventory } from '@/api/inventory'
import { transListToTreeData } from '@/utils'
import { getProduct } from '@/api/product'
import { getForecast } from '@/api/forecast'

export default {
  name: 'Inbound',
  data() {
    return {
      isSidebarVisible: false,
      inboundList: [],
      pageParams: {
        page: 1,
        pagesize: 8,
        type: 1,
        total: 0
      },
      dialogTitle: 'Add New Order',
      showDialog: false,
      supplierList: [],
      inboundForm: {
        date: '',
        orderNo: '',
        supplierId: '',
        supplierName: '',
        status: '',
        description: '',
        state: 0,
        type: 1,
        quantity: 0,
        amount: 0,
        orderItems: [
        ]
      },
      rules: {
        name: [{ required: true, message: 'Inbound name cannot be empty.', trigger: 'blur' }],
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
      selectionKeys: [],
      forecasts: {},
      loading: false
    }
  },
  created() {
    this.getInboundList()
    this.getSupplier()
  },
  methods: {
    async getInboundList() {
      const { rows, total } = await getInboundList(this.pageParams)
      this.inboundList = rows // 赋值数据
      this.pageParams.total = total
    },
    changePage(newPage) {
      this.pageParams.page = newPage // 赋值当前页码
      this.getInboundList()
    },

    btnAddOrderItem(){
      this.dialogTitle= "Add New Order"
      this.showSelectionDialog = true
      this.getCategory()
      this.getInventoryList()
      this.$refs.multipleTable.clearSelection();
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
      this.inboundForm = await getInboundDetail(id)
      this.selectionKeys=this.inboundForm.orderItems.map(item=>item.productId)
      this.dialogTitle= "Edit Order"
      this.showDialog = true
    },
    async btnComp(id) {
      await compInbound(id)
      this.$message.success('Complete Order successed')
      if (this.inboundList.length === 1) this.pageParams.page--
      this.getInboundList()
    },
    async btnDel(id){
      await delInbound(id)
      this.$message.success('Delete Order successed')
      if (this.inboundList.length === 1) this.pageParams.page--
      this.getInboundList()
    },
    async getSupplier() {
      this.supplierList = await getSupplier()
    },
    getSupplierSelection (value){
      this.inboundForm.supplierId = value;
      this.$nextTick(() => {
        this.inboundForm.supplierName = this.$refs["supplierSelect"].selected.currentLabel;
      });
    },
    rowDelete(row){
      console.log(row)
      const index = this.inboundForm.orderItems.findIndex(item => item.id === row.id);
      if (index !== -1) {
        this.inboundForm.orderItems.splice(index, 1);
        this.selectionKeys = this.selectionKeys.filter(item => item !== row.productId)
        this.updateFigure()
        console.log(this.selectionKeys)
      }
      this.isUpdate=Math.random()
    },
    btnOK() {
      this.$refs.inboundForm.validate(async isOK => {
        if (isOK) {
          if (this.inboundForm.id) {
            await updateInbound(this.inboundForm)
            this.$message.success('Update new inbound successed')
          } else {
            await addInbound(this.inboundForm)
            this.$message.success('Add new inbound successed')
          }
          this.getInboundList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.inboundForm = {
        date: '',
        orderNo: '',
        supplierId: '',
        supplierName: '',
        status: '',
        description: '',
        state: 0,
        type: 1,
        quantity: 0,
        amount: 0,
        orderItems: [
        ]
      }
      this.$refs.inboundForm.resetFields()
      // this.$refs.multipleTable.clearSelection();
      this.forecasts= {}
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
        this.selectionKeys = this.selectionNew.map(o=>o.productId)
        console.log(this.selectionKeys)
      }
      this.isSelect=false
      const res = await getProduct(this.selectionKeys)


      const mergedList = res.map(product => {
        const inventory = this.productList.find(item => item.productId === product.id);
        return {
          ...inventory,
          name: product.name,
          productName: product.name,
          cost: product.cost,
          quantity: 10
        };
      });
      console.log(123)
      console.log(mergedList)
      const aMap = new Map(this.inboundForm.orderItems.map(item => [item.productId, item]));
      const combined = mergedList.map(item => {
        if (aMap.has(item.productId)) {
          return { ...item, ...aMap.get(item.productId) };
        }
        return item;
      });
      this.inboundForm.orderItems = combined
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
      this.getForecastData()
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
      this.inboundForm.orderItems.forEach(item=>{
        item.amount=item.quantity*item.cost
        amount+=item.amount
        quantity+=item.quantity

      })
      this.inboundForm.quantity=quantity
      this.inboundForm.amount=amount
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-UK", {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    },
    async changeState(id, $event) {
      await updateState(id,$event)
      this.$message.success('Successfully updated the order sate')
      this.getInventoryList()
    },
    rowStyle({ row }) {
      if (row.difference < 0) {
        return 'highlight-row';
      }
      return '';
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    async getForecastData() {
      this.loading = true
      const data = await getForecast({
        "productIds": this.selectionKeys,
        "companyId": this.$store.getters.companyId
        // "companyId": "34"
      });
      Object.keys(data).forEach(productId => {
        const item = this.inboundForm.orderItems.find(p => p.productId === productId);
        if (item) {
          item.forecast = data[productId]
        }
        this.isUpdate = Math.random()
        this.loading = false
      });
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
