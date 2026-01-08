<script setup>
const props = defineProps({
  filterData: {
    type: Object,
    required: true,
    default: () => ({ types: [], sextypes: [] })
  },
  activeParams: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:activeParams', 'change'])

// 切换筛选类型
const handleTypeChange = item => {
  const newParams = {
    ...props.activeParams,
    type: item.key,
    musician: item.musician || 0
  }
  emit('update:activeParams', newParams)
  emit('change')
}

// 切换性别类型
const handleSexChange = item => {
  const newParams = { ...props.activeParams, sextypes: item.key }
  emit('update:activeParams', newParams)
  emit('change')
}
</script>

<template>
  <div class="filter-section">
    <!-- 语种/流派筛选 -->
    <div class="filter-row" v-if="filterData.types.length">
      <span class="label">语种：</span>
      <div class="options">
        <span
          v-for="item in filterData.types"
          :key="item.key"
          class="tag"
          :class="{
            active:
              activeParams.type === item.key &&
              activeParams.musician == item.musician
          }"
          @click="handleTypeChange(item)"
        >
          {{ item.value }}
        </span>
      </div>
    </div>

    <!-- 性别/组合筛选 -->
    <div class="filter-row" v-if="filterData.sextypes.length">
      <span class="label">分类：</span>
      <div class="options">
        <span
          v-for="item in filterData.sextypes"
          :key="item.key"
          class="tag"
          :class="{ active: activeParams.sextypes === item.key }"
          @click="handleSexChange(item)"
        >
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-section {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .filter-row {
    display: flex;
    align-items: flex-start;

    .label {
      font-size: 14px;
      color: $text-secondary;
      width: 60px;
      margin-top: 6px;
      flex-shrink: 0;
    }

    .options {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .tag {
        font-size: 14px;
        color: $text-secondary;
        padding: 4px 14px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          color: $text-primary;
        }

        &.active {
          color: #fff;
          background: $accent-color;
          box-shadow: 0 4px 12px rgba($accent-color, 0.3);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .filter-section {
    gap: 12px;
    margin-bottom: 30px;

    .filter-row {
      flex-direction: column;

      .label {
        font-size: 12px;
        margin-bottom: 8px;
        width: auto;
      }

      .options {
        gap: 8px;

        .tag {
          font-size: 13px;
          padding: 3px 12px;
        }
      }
    }
  }
}
</style>
