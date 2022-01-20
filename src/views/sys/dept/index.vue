<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <OrgTree class="w-1/4 xl:w-1/5" @select="handleSelect" ref="orgTreeRef" />
    <BasicTable @register="registerTable" class="w-2/4 xl:w-4/5">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增部门 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import OrgTree from '../components/OrgTree.vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getOrgPageList, deleteOrgById } from '/@/api/sys/org';

  import { useModal } from '/@/components/Modal';
  import DeptModal from './DeptModal.vue';

  import { columns, searchFormSchema } from './dept.data';

  export default defineComponent({
    name: 'DeptManagement',
    components: { PageWrapper, BasicTable, DeptModal, TableAction, OrgTree },
    setup() {
      const selectedOrgId = ref('');
      const orgTreeRef = ref();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '部门列表',
        rowKey: 'id',
        api: getOrgPageList,
        beforeFetch: (params) => {
          params.pid = unref(selectedOrgId);
          return params;
        },
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        pagination: true,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        canResize: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        const param: any[] = [];
        param.push({
          id: record.id,
        });
        await deleteOrgById(param);
        handleSuccess();
      }

      function handleSuccess() {
        orgTreeRef.value.handleTreeReload();
        reload();
      }

      function handleSelect(id = '') {
        selectedOrgId.value = id;
        reload();
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        orgTreeRef,
      };
    },
  });
</script>
