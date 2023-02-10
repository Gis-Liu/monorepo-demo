import request from "axios";
import { BaseResponse } from "../model/common";
import { Label, LabelTree } from "../model/labelModel";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { color } from "@diit/utils";

//查询当前系统下样本集标签集
export const querySampleSetLabel = () =>
  request
    .get<BaseResponse<Label[]>>("/ai-train/v1/ctm/query")
    .then((res) => res.data.data);

export const querySampleSetLabelMap = () => {
  let data: Record<string, Label> = {};
  return querySampleSetLabel().then((res) => {
    res.forEach((r) => (data[r.code] = r));
    return data;
  });
};

export function getTableData() {
  const loading = ref(false);
  const labelTableData = ref<any[]>([]);

  function startAlign(table: string, field: string) {
    const ws = new WebSocket(`/ai-train/v1/ctm/align?table=${table}&field=${field}`
    );
    //连接打开时触发
    ws.onopen = function (evt) {
      loading.value = true;
      ws.send("");
    };
    //接收到消息时触发
    ws.onmessage = function (evt) {
      const alignData = JSON.parse(evt.data);
      labelTableData.value = [];
      loading.value = false;
      if (alignData.code == 200) {
        for (let key in alignData.data) {
          alignData.data[key].userlabel = key;
          labelTableData.value.push(alignData.data[key]);
        }
      } else {
        return ElMessage.error("标签对齐任务失败,请重新发起!!!");
      }
    };
    //连接关闭时触发
    ws.onclose = function (evt) {
      console.log("Connection closed.");
    };
  }
  return {
    loading,
    labelTableData,
    startAlign,
  };
}

export const queryByCodes = (codeArray: string[]) => {
  const codes = codeArray.join(",");
  return request
    .get<BaseResponse<Label[]>>("/ai-train/v1/ctm/query", {
      params: { codes },
    })
    .then((res) => res.data.data);
};

export function getColorSet(labels: string[]) {
  return queryByCodes(labels).then((res) => {
    let colors: Record<string, string> = {};
    res.map((l) => {
      const rgbArray = l.color.split(",").map((r) => parseInt(r));
      const colorHex = color.formatRgbToHex(rgbArray);
      colors[l.label] = colorHex;
    });
    return colors;
  });
}

export function formatTree(data: Label[]) {
  let store: Record<string, LabelTree> = {};
  data.forEach((l) => (store[l.code] = l));
  let root: LabelTree[] = [];
  data.forEach((l) => {
    if (l.parent === "999999") {
      root.push(l);
    } else {
      if (store[l.parent]!.children) {
        store[l.parent].children?.push(l);
      } else {
        store[l.parent].children = [l];
      }
    }
  });
  return root;
}
