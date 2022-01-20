<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <Spin :spinning="treeLoading">
      <BasicTree
        title="部门列表"
        toolbar
        ref="asyncExpandTreeRef"
        :clickRowToExpand="false"
        :treeData="treeData"
        @select="handleSelect"
      />
    </Spin>
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref, unref } from 'vue';
  import { BasicTree } from '/@/components/Tree';
  import { Spin } from 'ant-design-vue';
  import { getOrgTreeList } from '/@/api/sys/org';
  import { TreeActionType, TreeItem } from '/@/components/Tree/src/tree';

  export default defineComponent({
    name: 'OrgTree',
    components: { BasicTree, Spin },
    emits: ['select'],
    setup(_, { emit }) {
      const treeLoading = ref(false);
      const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
      let treeData = ref<TreeItem[]>([]);
      async function fetch() {
        treeLoading.value = true;
        // 设置数据源
        treeData.value = (await getOrgTreeList()) as unknown as TreeItem[];

        treeLoading.value = false;

        // 展开全部
        // eslint-disable-next-line vue/valid-next-tick
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

      onMounted(() => {
        fetch();
      });
      return {
        treeLoading,
        asyncExpandTreeRef,
        treeData,
        handleSelect,
        handleTreeReload,
      };
    },
  });
</script>
