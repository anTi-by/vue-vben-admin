<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <Spin :spinning="treeLoading">
      <BasicTree
        title="部门列表"
        toolbar
        ref="asyncExpandTreeRef"
        :clickRowToExpand="false"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
      />
    </Spin>
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, onBeforeMount, ref, unref } from 'vue';
  import { BasicTree } from '/@/components/Tree';
  import { Spin } from 'ant-design-vue';
  import { getOrgTreeList } from '/@/api/sys/org';
  import { TreeActionType, TreeItem } from '/@/components/Tree/src/tree';

  const emit = defineEmits(['select']);
  onBeforeMount(() => {
    fetch();
  });
  const treeLoading = ref(false);
  const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
  let treeData = ref<TreeItem[]>([]);
  async function fetch() {
    treeLoading.value = true;
    // 设置数据源
    treeData.value = (await getOrgTreeList()) as unknown as TreeItem[];
    treeLoading.value = false;
    // 展开全部
    await nextTick(() => {
      unref(asyncExpandTreeRef)?.filterByLevel(1);
    });
  }

  function handleSelect(keys: string) {
    emit('select', keys[0]);
  }

  async function handleTreeReload() {
    await fetch();
  }
  // 暴露内部方法
  defineExpose({ handleTreeReload });
</script>
