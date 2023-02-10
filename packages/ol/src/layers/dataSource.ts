import VectorTile from "ol/source/VectorTile";
import TileImage from "ol/source/TileImage";
import GeoJSON from "ol/format/GeoJSON";
import MVT from "ol/format/MVT";
import { tileServiceApi } from "@diit/base";

export async function getGridSource(tileServiceId: number) {
  const res = await tileServiceApi.getOne("grid", tileServiceId!);
  const status = res.data.service.status;
  if (status === "succeeded") {
    let url = `/tile/v1/google-xyz/${tileServiceId}/{z}/{x}/{y}?f=png`;
    const { srid, bound } = res.data.service_info;
    const extent = new GeoJSON().readGeometry(JSON.parse(bound)).getExtent();
    const serviceInfo = res.data.service_info;
    const projection = "EPSG:" + srid;
    return {
      source: new TileImage({ url, projection }),
      extent,
      serviceInfo
    }
  } else if (status === "pending" || status === "running") {
    throw Error("服务正在发布中");
  } else {
    throw Error("服务发布失败");
  }
}
 

export async function getVectorSource(tileServiceId: number) {
  const res = await tileServiceApi.getOne("vector", tileServiceId!);
  const status = res.data.service.status;
  if (status === "succeeded") {
    let url = `/tile/v1/google-xyz/${tileServiceId}/{z}/{x}/{y}?f=png`;
    const { max_zoom, min_zoom, srid, bound } = res.data.service_info;
    const extent = new GeoJSON().readGeometry(JSON.parse(bound)).getExtent();
    const serviceInfo = res.data.service_info;
    const projection = "EPSG:" + srid;
    const source = new VectorTile({
      url,
      projection,
      minZoom: min_zoom,
      maxZoom: max_zoom,
      format: new MVT(),
    });
    return {
      source,
      extent,
      serviceInfo
    }
  } else if (status === "pending" || status === "running") {
    throw Error("服务正在发布中");
  } else {
    throw Error("服务发布失败");
  }
}
