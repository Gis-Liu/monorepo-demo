import request from "axios";

export function getOne(type: "grid" | "vector", tileServiceId: number) {
  const url = `/tile-service/v1/service/one?data_class=${type}&id=${tileServiceId}`;
  return request.get(url).then(res=>res.data);
}
