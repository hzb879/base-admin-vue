<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyWord" placeholder="关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" style="margin-left:10px;" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="角色名" align="center" width="120" #default="{row}">
        <span>{{ row.cnName }}</span>
      </el-table-column>
      <el-table-column label="英文名" align="center" width="120" #default="{row}">
        <span>{{ row.name }}</span>
      </el-table-column>
      <el-table-column label="描述信息" align="center" #default="{row}">
        <span>{{ row.description }}</span>
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" align="center" min-width="105" prop="createTime" #default="{row}">
        <i class="el-icon-time" /><span class="i-left">{{ row.createTime }}</span>
      </el-table-column>
      <el-table-column label="修改时间" sortable="custom" align="center" min-width="105" prop="updateTime" #default="{row}">
        <i class="el-icon-time" /><span class="i-left">{{ row.updateTime }}</span>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width" #default="{row}">
        <el-button type="primary" size="mini" @click="handleUpdate(row)">
          编辑
        </el-button>
        <el-button size="mini" type="danger" @click="removeData(row.id)">
          删除
        </el-button>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus] + '角色'" :visible.sync="dialogFormShow" :close-on-click-modal="false">
      <el-form ref="dialogForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 500px; margin-left:30px;">
        <el-form-item label="角色中文名" prop="cnName">
          <el-input v-model="temp.cnName" placeholder="请输入角色中文名" />
        </el-form-item>
        <el-form-item label="角色英文名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入角色英文名" />
        </el-form-item>
        <el-form-item label="角色描述信息" prop="description">
          <el-input v-model="temp.description" type="textarea" placeholder="输入描述信息" :rows="3" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          {{ textMap[dialogStatus] }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getPage, create, update, remove } from '@/api/role'
import { pick } from 'lodash'

export default {
  name: 'UserIndex',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      dialogFormShow: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyWord: '',
        orderItems: []
      },
      list: null,
      total: 0,
      dialogStatus: '',
      temp: {},
      textMap: {
        'create': '添加',
        'update': '修改'
      },
      rules: {
        name: [
          { required: true, message: '请输入角色英文名', trigger: 'blur' }
        ],
        cnName: [
          { required: true, message: '请输入角色中文名', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() { // 获取分页数据
      this.listLoading = true
      getPage(this.listQuery).then(data => {
        this.list = data.records
        this.total = data.total
        this.listLoading = false
      })
    },
    handleFilter() { // 条件查询
      this.listQuery.pageNum = 1
      this.getList()
    },
    sortChange(obj) { // 排序
      this.listQuery.orderItems = []
      if (obj.order) {
        this.listQuery.orderItems.push({ column: obj.prop, direction: obj.order.includes('asc') ? 'asc' : 'desc' })
      }
      this.handleFilter()
    },
    resetTemp(dialogStatus, data) {
      this.temp = data
      this.dialogStatus = dialogStatus
      this.dialogFormShow = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp('create', {})
    },
    handleUpdate(row) {
      this.resetTemp('update', Object.assign({}, row))
    },
    rulesValid() {
      return new Promise((resolve, reject) => {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
    },
    createData() {
      this.rulesValid().then(() => {
        create(this.temp).then((data) => {
          this.total += 1
          this.list.unshift(data)
          this.dialogFormShow = false
          this.$notify.success({
            title: '成功',
            message: '创建成功'
          })
        })
      })
    },
    updateData() {
      this.rulesValid().then(() => {
        update(pick(this.temp, [
          'id',
          'name',
          'cnName',
          'description'
        ])).then(() => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              this.list.splice(this.list.indexOf(v), 1, this.temp)
              break
            }
          }
          this.dialogFormShow = false
          this.$notify.success({
            title: '成功',
            message: '修改成功'
          })
        })
      })
    },
    removeData(id) {
      this.$requireAuth().then(() => {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove(id).then(() => {
            for (const v of this.list) {
              if (v.id === id) {
                this.list.splice(this.list.indexOf(v), 1)
                break
              }
            }
            this.total -= 1
            if (!this.list.length) { // 删除到本页数据为空时跳转到上一页
              if (this.listQuery.pageNum > 1) {
                this.listQuery.pageNum -= 1
                this.getList()
              }
            }
            this.$notify.success({
              title: '成功',
              message: '删除成功'
            })
          })
        }).catch(() => {
        })
      })
    }

  }
}
</script>
<style scoped>
  .i-left {
    margin-left: 5px
  }
</style>
