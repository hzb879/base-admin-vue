<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.gender" placeholder="性别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="gender in dict.gender" :key="gender.k" :label="gender.v" :value="gender.k" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="status in dict.status" :key="status.k" :label="status.v" :value="status.k" />
      </el-select>

      <el-button class="filter-item" style="margin-left:5px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left:5px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button class="filter-item" style="margin-left:5px;" type="primary" icon="el-icon-download" @click="handleExcel">
        导出
      </el-button>
      <el-checkbox v-model="lastLoginTimeShow" class="filter-item" style="margin-left:10px;" @change="tableKey=tableKey+1">
        最后登陆时间
      </el-checkbox>
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
      <el-table-column label="登陆账号" align="center" width="120" #default="{row}">
        <span>{{ row.username }}</span>
      </el-table-column>
      <el-table-column label="昵称" align="center" width="120" #default="{row}">
        <span>{{ row.name }}</span>
      </el-table-column>
      <el-table-column label="头像" align="center" width="100" #default="{row}">
        <span><el-avatar shape="square" :size="60" :src="row.avatar? row.avatar.src : '' " @click.native="openEditAvatar(row)" /></span>
      </el-table-column>
      <el-table-column label="性别" align="center" width="60" #default="{row}">
        <span>{{ row.gender }}</span>
      </el-table-column>
      <el-table-column label="角色" align="center" width="150" #default="{row}">
        <span>{{ row.roleCnNames }}</span>
      </el-table-column>
      <el-table-column label="生日" align="center" width="100" #default="{row}">
        <span>{{ row.birthday }}</span>
      </el-table-column>
      <el-table-column label="邮箱" align="center" width="150" #default="{row}">
        <span>{{ row.email }}</span>
      </el-table-column>
      <el-table-column label="手机号码" align="center" width="130" #default="{row}">
        <span>{{ row.mobile }}</span>
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" align="center" min-width="105" prop="createTime" #default="{row}">
        <i class="el-icon-time" /><span class="i-left">{{ row.createTime }}</span>
      </el-table-column>
      <el-table-column v-if="lastLoginTimeShow" label="最后登陆时间" align="center" min-width="100" #default="{row}">
        <i class="el-icon-time" /><span class="i-left">{{ row.lastLoginTime }}</span>
      </el-table-column>
      <el-table-column label="描述信息" align="center" min-width="100" #default="{row}">
        <el-popover
          placement="top"
          width="300"
          trigger="hover"
          :content="row.description"
        >
          <el-button slot="reference" size="small">描述信息</el-button>
        </el-popover>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100" #default="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170" class-name="small-padding fixed-width" #default="{row}">
        <el-dropdown :key="'p' + row.id" trigger="click" type="primary" size="small" @command="handleOperation">
          <el-button type="primary" class="dropdown-btn">
            操作<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{row: row, action: 'update'}">编辑</el-dropdown-item>
            <el-dropdown-item :command="{row: row, action: 'role'}">角色</el-dropdown-item>
            <el-dropdown-item :command="{row: row, action: 'password'}">密码</el-dropdown-item>
            <el-dropdown-item :command="{row: row, action: 'remove'}">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown :key="row.id" trigger="click" type="primary" size="small" @command="saveUpdateUserStatus">
          <el-button type="danger" class="dropdown-btn">
            状态<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="status in dict.status" :key="status.k" :command="{id: row.id, status: status.v}">{{ status.v }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus] + '用户'" :visible.sync="dialogFormShow" :close-on-click-modal="false" width="600px">
      <el-form ref="dialogForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 500px; margin-left:20px;">
        <el-form-item label="登陆用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="cipher">
          <el-input v-model="temp.cipher" placeholder="请输入密码" show-password />
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

    <el-dialog title="编辑用户信息" :visible.sync="userUpdateFormShow" :close-on-click-modal="false" width="650px">
      <el-form ref="userUpdateForm" :rules="userUpdateRules" :model="updateUser" label-position="left" label-width="120px" style="width: 500px; margin-left:30px;">
        <el-form-item label="登陆用户名">
          <el-input v-model.trim="updateUser.username" :disabled="true" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model.trim="updateUser.name" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model.trim="updateUser.mobile" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model.trim="updateUser.email" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="updateUser.gender">
            <el-radio v-for="gender in dict.gender" :key="gender.k" :label="gender.v" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="updateUser.birthday" type="date" placeholder="选择生日" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input v-model="updateUser.description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userUpdateFormShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateUserInfo">
          修改
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :center="true" :visible.sync="userAvatarShow" :close-on-click-modal="false" width="450px">
      <template #title>
        <el-image
          style="width: 400px; height: 400px; margin-top: 20px"
          :src="currentAvatarUser.avatar ? currentAvatarUser.avatar.src : ''"
        />
      </template>
      <template #default>
        <div style="text-align: center">
          <el-button type="primary" icon="el-icon-upload el-icon--right" @click="imagecropperShow = true">
            上传新头像
          </el-button>
          <el-button @click="userAvatarShow = false">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="编辑用户角色" :visible.sync="roleFormShow" :close-on-click-modal="false">
      <el-checkbox-group v-model="currentRoleIds">
        <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.cnName }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateUserRole">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="导出Excel配置" :visible.sync="excelFromShow" :close-on-click-modal="false" width="600px" @close="excelDialogClose">
      <div class="filter-container">
        <div>
          <el-input v-model="excelParam.name" placeholder="昵称" style="width: 200px;" class="filter-item" />
          <el-select v-model="excelParam.gender" placeholder="性别" clearable style="width: 90px" class="filter-item">
            <el-option v-for="gender in dict.gender" :key="gender.k" :label="gender.v" :value="gender.k" />
          </el-select>
          <el-select v-model="excelParam.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
            <el-option v-for="status in dict.status" :key="status.k" :label="status.v" :value="status.k" />
          </el-select>
        </div>
        <div>
          <span style="margin:0 10px;font-size: 1.1em; font-weight: bold">创建时间</span>
          <el-date-picker
            v-model="excelParamSet.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </div>
        <div style="margin-top: 10px;">
          <span style="margin:0 10px;font-size: 1.1em; font-weight: bold" class="filter-item">排序</span>
          <el-checkbox-group v-model="excelParamSet.sortItems" size="small" style="display:inline-block;vertical-align:middle;">
            <el-checkbox-button key="createTime,asc" label="createTime,asc" @change="excelOrderSelect('createTime,asc', $event)">创建时间<i class="el-icon-top el-icon--right" /></el-checkbox-button>
            <el-checkbox-button key="createTime,desc" label="createTime,desc" @change="excelOrderSelect('createTime,desc',$event)">创建时间<i class="el-icon-bottom el-icon--right" /></el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div>
          <el-transfer v-model="excelParam.fieldNames" :data="dict.excel" target-order="push" :titles="['不导出属性', '导出属性']" :props="{key: 'k',label: 'v'}" style="margin-top:10px" class="user-transfer" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="excelFromShow = false">
          取消
        </el-button>
        <el-button type="primary" icon="el-icon-download" @click="exportExcelData">
          导出
        </el-button>
      </div>
    </el-dialog>
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      :params="currentAvatarParams"
      url="/upload/local/avatar"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getDict, getPage, registerUser, setUserStatus, updateUser, removeUser, setUserRole, resetUsernameAndCipher, downloadUserExcel } from '@/api/user'
import { getList as getRoleList } from '@/api/role'
import ImageCropper from '@/components/ImageCropper'
import { pick } from 'lodash'

export default {
  name: 'UserIndex',
  components: { Pagination, ImageCropper },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '在职': 'success',
        '离职': 'wraning',
        '禁用': 'danger',
        '逻辑删除': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      lastLoginTimeShow: false,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        status: '',
        gender: '',
        orderItems: []
      },
      excelFromShow: false,
      excelParam: {
        fieldNames: []
      },
      excelParamSet: {
        sortItems: []
      },
      list: null,
      roleList: [],
      total: 0,
      dialogFormShow: false,
      dialogStatus: '',
      temp: {},
      textMap: {
        'create': '添加',
        'update': '修改'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        cipher: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        ]
      },
      dict: {
        status: [],
        gender: [],
        excel: []
      },
      updateUser: {},
      userUpdateFormShow: false,
      userUpdateRules: {

      },
      currentAvatarUser: {},
      currentAvatarParams: {},
      userAvatarShow: false,
      imagecropperShow: false,
      imagecropperKey: 1000000,
      roleFormShow: false,
      currentRoleUser: {},
      currentRoleIds: []
    }
  },
  created() {
    this.setDict()
    this.getList()
    this.getRoleList()
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
    getRoleList() {
      getRoleList().then((data) => {
        this.roleList = data
      })
    },
    setDict() { // 设置字典
      getDict().then((data) => {
        this.dict = data
        this.setDefaultExcelField()
      })
    },
    setDefaultExcelField() {
      for (const o of this.dict.excel) {
        this.excelParam.fieldNames.push(o.k)
      }
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
    createData() { // 保存新添加的新用户
      this.rulesValid(() => {
        registerUser(this.temp).then((data) => {
          this.total += 1
          this.list.unshift(data)
          this.dialogFormShow = false
          this.$notify.success('添加用户成功')
        })
      })
    },
    updateData() { // 重设用户名和密码
      this.rulesValid(() => {
        const id = this.temp.id
        const username = this.temp.username
        resetUsernameAndCipher(this.temp).then((data) => {
          this.dialogFormShow = false
          for (const v of this.list) {
            if (v.id === id) {
              v.username = username
              break
            }
          }
          this.$notify.success('修改用户名和密码成功')
        })
      })
    },
    removeData(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser(id).then(() => {
          for (const v of this.list) {
            if (v.id === id) {
              this.list.splice(this.list.indexOf(v), 1)
              break
            }
          }
          this.total -= 1
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
        })
      }).catch(() => {

      })
    },
    updateUserInfo() { // 保存修改的用户信息
      const user = pick(this.updateUser, [
        'id',
        'name',
        'gender',
        'birthday',
        'mobile',
        'email',
        'description'
      ])
      updateUser(user).then(() => {
        const i = this.list.findIndex((value, index, array) => value.id === this.updateUser.id)
        this.list.splice(i, 1, this.updateUser)
        this.userUpdateFormShow = false
        this.$notify.success('编辑用户成功')
      })
    },
    resetTemp(dialogStatus, data) {
      this.temp = data
      this.dialogStatus = dialogStatus
      this.dialogFormShow = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    handleExcel() {
      this.excelFromShow = true
    },
    handleCreate() { // 保存新添加的新用户
      this.resetTemp('create', {})
    },
    handleUpdate(row) { // 保存修改的用户信息
      this.resetTemp('update', Object.assign({}, pick(row, ['id', 'username'])))
    },
    rulesValid(func) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          func()
        }
      })
    },
    handleOperation(command) {
      const user = command.row
      switch (command.action) {
        case 'update':
          this.handleUpdateUserInfo(user)
          break
        case 'role':
          this.handleSetRoles(user)
          break
        case 'password':
          this.handleUpdate(user)
          break
        case 'remove':
          this.removeData(user.id)
          break
        default:
          break
      }
    },
    handleUpdateUserInfo(user) { // 打开编辑用户对话框
      this.updateUser = Object.assign({}, user)
      this.userUpdateFormShow = true
    },
    saveUpdateUserStatus(command) { // 改变用户状态
      setUserStatus(command).then(() => {
        const id = command.id
        for (const user of this.list) {
          if (user.id === id) {
            user.status = command.status
            break
          }
        }
        this.$notify.success('修改状态成功')
      })
    },
    openEditAvatar(user) {
      this.currentAvatarUser = user
      this.currentAvatarParams.userId = user.id
      this.userAvatarShow = true
    },
    cropSuccess(resData) { // 上传头像成功
      this.imagecropperShow = false
      this.imagecropperKey += 1
      this.tableKey += 1
      this.currentAvatarUser.avatar = this.currentAvatarUser.avatar || {}
      this.currentAvatarUser.avatar.src = resData.src
      this.userAvatarShow = false
      this.$notify.success('修改头像成功')
    },
    close() {
      this.imagecropperShow = false
    },
    handleSetRoles(user) {
      this.currentRoleUser = user
      this.currentRoleIds = user.roleIds && user.roleIds.split(',') || []
      this.roleFormShow = true
    },
    updateUserRole() {
      const userId = this.currentRoleUser.id
      const roleIds = this.currentRoleIds || []
      setUserRole({ userId, roleIds }).then(() => {
        for (const user of this.list) {
          if (user.id === userId) {
            const resultRoles = this.roleList.filter(v => roleIds.includes(v.id))
            user.roleIds = resultRoles.map(v => v.id).join(',')
            user.roleNames = resultRoles.map(v => v.name).join(',')
            user.roleCnNames = resultRoles.map(v => v.cnName).join(',')
            break
          }
        }
        this.$notify.success('修改角色成功')
        this.roleFormShow = false
      })
    },
    exportExcelData() {
      const dateRange = this.excelParamSet.dateRange
      if (dateRange && dateRange.length) {
        this.excelParam.createTimeAfter = dateRange[0]
        this.excelParam.createTimeBefore = dateRange[1]
      } else {
        delete this.excelParam.createTimeAfter
        delete this.excelParam.createTimeBefore
      }
      const sortItems = this.excelParamSet.sortItems
      if (sortItems && sortItems.length) {
        const items = sortItems[0].split(',')
        this.excelParam.orderItems = [{ column: items[0], direction: items[1] }]
      } else {
        delete this.excelParam.orderItems
      }

      downloadUserExcel(this.excelParam).then(() => {
        this.excelFromShow = false
      })
    },
    excelOrderSelect(key, selected) {
      if (selected) {
        this.excelParamSet.sortItems = [key]
      }
    },
    excelDialogClose() {
      this.excelParam = {
        fieldNames: []
      }
      this.excelParamSet = {
        sortItems: []
      }
      this.setDefaultExcelField()
    }

  }
}
</script>
<style lang="scss" scoped>
  .dropdown-btn {
    padding: 7px 10px; font-size: 12px; margin-left: 10px
  }
  .i-left {
    margin-left: 5px
  }
  .user-transfer /deep/ .el-checkbox{
    display: block;
  }
</style>
