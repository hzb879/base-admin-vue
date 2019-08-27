<template>
  <el-form ref="userForm" :model="user">
    <el-form-item label="昵称">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="手机号码">
      <el-input v-model.trim="user.mobile" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.gender">
        <el-radio v-for="gender in dict.gender" :key="gender.k" :label="gender.v" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="生日">
      <el-date-picker
        v-model="user.birthday"
        type="date"
        placeholder="选择生日"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item label="描述信息">
      <el-input v-model="user.description" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getDict } from '@/api/user'
import { pick } from 'lodash'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          gender: '',
          birthday: '',
          mobile: '',
          email: '',
          description: ''
        }
      }
    }
  },
  data() {
    return {
      dict: {}
    }
  },

  created() {
    this.setDict()
  },
  methods: {
    setDict() {
      // 设置字典
      getDict().then(data => {
        this.dict = data
      })
    },
    submit() {
      const user = pick(this.user, [
        'name',
        'gender',
        'birthday',
        'mobile',
        'email',
        'description'
      ])

      this.$store.dispatch('user/updateInfo', user).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
