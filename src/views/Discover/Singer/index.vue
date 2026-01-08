<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSingerListApi } from '@/api/singer'
import SingerFilter from './components/SingerFilter.vue'
import SingerList from './components/SingerList.vue'
import SingerAlphabet from './components/SingerAlphabet.vue'

const singerList = ref([])
const allSingerGroups = ref([]) // 存储原始分组数据
const activeInitial = ref('热门') // 当前选中的首字母

const filterData = reactive({
  types: [],
  sextypes: []
})
const activeParams = reactive({
  type: 0,
  sextypes: 0,
  musician: 0,
  hotsize: 30
})

const loading = ref(false)

const getSingerList = async () => {
  loading.value = true
  try {
    const res = await getSingerListApi(activeParams)
    // 处理过滤条件元数据
    if (res.data?.enu_list) {
      filterData.types = res.data.enu_list.types || []
      filterData.sextypes = res.data.enu_list.sextypes || []
    }

    // 处理歌手列表数据
    if (res.data?.info && Array.isArray(res.data.info)) {
      allSingerGroups.value = res.data.info
      filterSingerList()
    } else {
      allSingerGroups.value = []
      singerList.value = []
    }
  } catch (error) {
    console.error('获取歌手列表失败：', error)
    singerList.value = []
  } finally {
    loading.value = false
  }
}

// 根据当前选中的字母筛选展示数据
const filterSingerList = () => {
  const groups = allSingerGroups.value

  let targetIndex = 0
  if (activeInitial.value === '热门') {
    targetIndex = 0
  } else if (activeInitial.value === '#') {
    targetIndex = 27
  } else {
    // A -> 1, B -> 2 ...
    targetIndex = activeInitial.value.charCodeAt(0) - 65 + 1
  }

  // 此时直接取对应分组的数据，不需要再去重
  if (groups[targetIndex] && groups[targetIndex].singer) {
    singerList.value = groups[targetIndex].singer
  } else {
    singerList.value = []
  }
}

const handleInitialChange = initial => {
  activeInitial.value = initial
  filterSingerList()
  // 切换字母时回到顶部
  const scrollEl = document.querySelector('.content-scroll')
  if (scrollEl) {
    scrollEl.scrollTop = 0
  }
}

// 监听参数变化重新请求
const onFilterChange = () => {
  singerList.value = []
  activeInitial.value = '热门'
  getSingerList()
}

onMounted(() => {
  getSingerList()
})
</script>

<template>
  <div class="singer-container">
    <!-- 筛选区域 -->
    <SingerFilter
      :filterData="filterData"
      v-model:activeParams="activeParams"
      @change="onFilterChange"
    />

    <!-- 字母导航 -->
    <SingerAlphabet
      v-model:activeInitial="activeInitial"
      @change="handleInitialChange"
    />

    <!-- 歌手列表区域 -->
    <SingerList :singerList="singerList" :loading="loading" />

    <BackTop></BackTop>
  </div>
</template>

<style scoped lang="scss">
.singer-container {
  padding: 30px 40px 30px 0;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .singer-container {
    padding: 20px 16px;
  }
}
</style>
