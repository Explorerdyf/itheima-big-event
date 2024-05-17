<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { artDelChannelService, artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 获取频道分类列表数据
const channelList = ref([])
const loading = ref(false)
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

// 添加分类 编辑分类
// 与下面弹窗的ref绑定，这样就能拿到组件里的方法了
const dialog = ref()
const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
const onDelChannel = (row) => {
  // 给出确认框
  ElMessageBox.confirm('你确认要删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    // 点击确认后就会到这里
    await artDelChannelService(row.id)
    ElMessage.success('删除成功')
    getChannelList()
  })
}
</script>
<template>
  <!-- 自动导入，无需手动引入 -->
  <PageContainer title="文章分类">
    <!-- 对应头部插槽 -->
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <!-- 对应主体插槽 -->
    <el-table :data="channelList" v-loading="loading" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <!-- #default 默认插槽 参数有 row、column、$index -->
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- 当为空数据时显示 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 放添加分类 编辑分类 弹窗 -->
    <!-- ref 绑定变量 ，@success监视发的请求-->
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </PageContainer>
</template>
