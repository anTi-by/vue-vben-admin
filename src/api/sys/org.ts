import { defHttp } from '/@/utils/http/axios';
import { DeptListItem } from '/@/api/sys/model/orgModel';
enum Api {
  getOrgTreeList = '/sysOrg/listDeptTree',
  getOrgPageList = '/sysOrg/page',
  addOrg = '/sysOrg/add',
  editOrg = '/sysOrg/edit',
  deleteOrgById = '/sysOrg/delete',
}

export const getOrgPageList = (params) => defHttp.get({ url: Api.getOrgPageList, params });

export const getOrgTreeList = (params?: DeptListItem) =>
  defHttp.get({ url: Api.getOrgTreeList, params });

export const saveOrg = (params) => defHttp.post({ url: Api.addOrg, params });

export const editOrg = (params) => defHttp.post({ url: Api.editOrg, params });

export const deleteOrgById = (params) => defHttp.post({ url: Api.deleteOrgById, params });
