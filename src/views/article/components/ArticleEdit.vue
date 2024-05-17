<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const visibleDrawer = ref(false)
// 添加时，要清空列表
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const formModel = ref({
  ...defaultForm
})
// 如果是 编辑：传来的是一行的数据，如果是 添加；传来的是空对象
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // console.log('编辑回显')
    // 1. 先获取文章具体信息
    const {
      data: { data }
    } = await artGetDetailService(row.id)
    formModel.value = data
    // 返回的是 没有基地址的 字符串
    imgUrl.value = baseURL + formModel.value.cover_img
    // console.log(imgUrl.value)
    // 需要的是 File 将 Url 字符串 => File
    const imgFile = await urlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = imgFile
  } else {
    // console.log('添加功能')
    formModel.value = { ...defaultForm }
    if (imgUrl.value && editorRef.value) {
      imgUrl.value = ''
      editorRef.value.setHTML('')
    }
  }
}
// 将 url => file
async function urlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
// 上传图片
const imgUrl = ref('')
const onUploadFile = (uploadFile) => {
  // uploadFile 是一个file 对象 而我们需要将 file=>Url 然后将 Url 进行显示
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 添加属性
  formModel.value.cover_img = uploadFile.raw
}
// 发布文章请求
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布 还是 草稿 存入状态
  formModel.value.state = state
  // 转换为 formData 数据
  const fd = new FormData()
  // key 代表属性名
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 添加直接发请求，编辑回显后发请求
  if (formModel.value.id) {
    // console.log('编辑操作')
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加请求
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}
defineExpose({
  open
})
</script>
<template>
  <!-- 抽屉 -->
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="formModel.content"
            contentType="html"
            ref="editorRef"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  // 样式穿透，修改el组件里的样式
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
