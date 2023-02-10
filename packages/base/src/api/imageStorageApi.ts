import request from "axios";
import { BaseResponse } from "../model/common";
import {
  CreateSourceDataQueryImage,
  CreateSourceDataQueryImageResult,
  GridDetail,
  GridMeta,
  VectorDataInfo,
  VectorDetail,
  VectorMetaInfo,
  VectorServiceMeta,
} from "../model/imageStorageModel";

type PageData<T> = { list: T[]; total: number };
export function getVectorPageData(data: any) {
  const url = "/image-storage/v1/geo/online-training/vector/details/";
  data.adCode = 100000;
  return request
    .post<BaseResponse<PageData<VectorDataInfo>>>(url, data)
    .then((res) => {
      res.data.data.list.forEach((item) => {
        item.checked = data.checkedId === item.id;
        if (item.children) {
          item.children.forEach((c) => (c.checked = data.checkedId === c.id));
        }
      });
      return res.data;
    });
}

export function getVectorMeta(id: string | number) {
  const url = `/image-storage/v1/geo/online-training/vector/meta/${id}/`;
  return request.get<BaseResponse<VectorMetaInfo>>(url).then((res) => {
    let data = res.data.data;
    const columnInfo = JSON.parse(data.columnInfo as unknown as string);
    data.columnInfo = Object.keys(columnInfo).map((name) => ({
      name,
      type: columnInfo[name],
    }));
    return res.data;
  });
}

export function getVectorServiceMeta(id: string | number) {
  const url = `/image-storage/v1/geo/vector/meta/${id}/`;
  return request.get<BaseResponse<VectorServiceMeta>>(url).then((res) => {
    return res.data;
  });
}

export function getResultGridMeta(id: number) {
  const url = `/image-storage/v1/geo/results/grid/meta/${id}/`;
  return request.get<BaseResponse<GridMeta>>(url).then((res) => {
    return res.data;
  });
}

export function createSourceDataQueryImage(params: CreateSourceDataQueryImage) {
  const url = `/image-storage/v1/other/online-training/result/query/`;
  return request
    .post<BaseResponse<PageData<CreateSourceDataQueryImageResult>>>(url, params)
    .then((res) => {
      const list = res.data.data.list;
      list.forEach((t, index) => ((t.id = index + 1), (t.isActive = false)));
      return list;
    });
}

export function getVectorDetail(id: string | number) {
  const url = `/image-storage/v1/common/vector/storage/${id}/`;
  return request.get<BaseResponse<VectorDetail>>(url).then((res) => {
    return res.data;
  });
}

export function getGridDetail(id: string | number) {
  const url = `/image-storage/v1/common/grid/storage/${id}/`;
  return request.get<BaseResponse<GridDetail>>(url).then((res) => {
    return res.data;
  });
}
