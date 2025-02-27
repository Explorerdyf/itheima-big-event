<script setup>
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const dialogVisible = ref(false)
// 1.获取表单里的数据
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 2.定义校验规则——对分别input的校验规则
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}
// 提交表单上校验——对所有的input
const formRef = ref()
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  // 下面的其实可以用 三元运算简化代码
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  // 给父组件发成功的请求，让父组件重新回显
  emit('success')
}
// 基于open 传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({id, cate_name,...}) => 表单需要渲染，说明是编辑
const open = async (row) => {
  dialogVisible.value = true
  // 表单内容的回显 如果是编辑：传来的就是一行的数据，如果是添加：传来的就是空对象
  formModel.value = { ...row }
}
// 向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <!-- 添加传来的是空对象，所以没有id -->
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          minlength="1"
          maxlength="10"
          v-model="formModel.cate_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          minlength="1"
          maxlength="15"
          v-model="formModel.cate_alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
