import VectorTileLayer from "ol/layer/VectorTile";
import Map from "ol/Map";
import { Fill, Stroke, Style, Text } from "ol/style";
import type VectorTile from "ol/source/VectorTile";
import { imageStorageApi } from "@diit/base";
import Layer from "ol/layer/Layer";
import { LegendItem } from "@diit/base/src/model/legendModel";
import { VectorDetail } from "@diit/base/src/model/imageStorageModel";
import { getVectorSource } from "./dataSource";

type BaseStyle = Pick<LegendItem, "color" | "fill" | "fillColor" | "width">;
type FilterMethod = (feature: any) => boolean;
export class BaseVectorLayer {
  name = "";
  info: VectorDetail | undefined;
  layerObj: Layer | null = null;
  extent: any;
  tileServiceId: number | undefined;
  whenReady: Promise<BaseVectorLayer>;
  defaultStyle: BaseStyle;
  filterMethod?: FilterMethod;
  constructor(params: {
    dataId?: number;
    tileServiceId?: number;
    defaultStyle?: BaseStyle;
    filterMethod?: FilterMethod;
  }) {
    const style: BaseStyle = {
      color: "#ffff00",
      fill: true,
      fillColor: "#ffff00ac",
      width: 2,
    };
    this.filterMethod = params.filterMethod;
    this.defaultStyle = params.defaultStyle ?? style;
    this.whenReady = this.init(params.dataId, params.tileServiceId);
  }
  async init(dataId?: number, serviceId?: number) {
    if (dataId !== undefined) {
      const sourceMeta = (await imageStorageApi.getVectorDetail(dataId)).data;
      const { tileServiceId, caption } = sourceMeta;
      this.name = caption;
      this.info = sourceMeta;
      this.tileServiceId = tileServiceId;
    } else if (serviceId !== undefined) {
      this.tileServiceId = serviceId;
    }
    return this.intLayer();
  }
  async intLayer() {
    const sourceInfo = await getVectorSource(this.tileServiceId!);
    const { source, extent, serviceInfo } = sourceInfo;
    this.extent = extent;
    this.layerObj = new VectorTileLayer({
      declutter: true,
      source: source,
      extent,
      style: (feature: any) => this.getSpotStyle(feature),
      minZoom: serviceInfo.min_zoom,
      zIndex: 5,
    });
    return this;
  }
  getSpotStyle(feature: any) {
    if (this.filterMethod && !this.filterMethod(feature)) {
      return new Style({});
    }
    const { fill: isFilled, color, fillColor, width } = this.defaultStyle;
    const fill = isFilled ? new Fill({ color: fillColor }) : undefined;
    const stroke = new Stroke({ color, width });
    return new Style({ fill, stroke });
  }
  getExtent() {
    return this.extent;
  }
  fitExtent(map: Map) {
    map.getView().fit(this.extent);
  }
  addToMap(map: Map) {
    map.addLayer(this.layerObj!);
  }
  removeFromMap(map: Map) {
    map.removeLayer(this.layerObj!);
  }
  reRender() {
    this.layerObj?.changed();
  }
  getVisible() {
    return this.layerObj?.getVisible();
  }
  setVisible(visible: boolean) {
    this.layerObj?.setVisible(visible);
  }
  toggleVisible() {
    const visible = this.layerObj?.getVisible();
    this.layerObj?.setVisible(!visible);
  }
  moveFront() {}
  moveBack() {}
  moveTop() {}
  moveBottom() {}
  toggleAdd(map: Map) {
    const one = map.getAllLayers().includes(this.layerObj!);
    if (one) {
      this.removeFromMap(map);
    } else {
      this.addToMap(map);
    }
  }
}

export class LabelVectorLayer extends BaseVectorLayer {
  labelFiled?: string;
  legendsRecord: Record<string, LegendItem> = {};
  constructor(params: {
    dataId?: number;
    tileServiceId?: number;
    legends?: LegendItem[];
    labelFiled?: string;
    defaultStyle?: BaseStyle;
    filterMethod?: FilterMethod;
  }) {
    super(params);
    this.labelFiled = params.labelFiled;
    if (params.legends) {
      this.setLegends(params.legends);
    }
  }
  setLabelField(val: string) {
    this.labelFiled = val;
    this.reRender();
  }
  setLegends(legends: LegendItem[]) {
    let record: any = {};
    legends.forEach((r) => (record[r.name] = r));
    this.legendsRecord = record;
    this.reRender();
  }
  getSpotStyle(feature: any) {
    const props = feature.getProperties();
    if (this.filterMethod && !this.filterMethod(feature)) {
      return new Style({});
    }
    const labelFiled = this.labelFiled || "";
    const labelValue = props[labelFiled];
    const legendItem = this.legendsRecord[labelValue] ?? {};
    const {
      width = 2,
      checked = true,
      color,
      fillColor,
      fill: isFilled,
    } = legendItem;
    if (checked) {
      const fill = isFilled ? new Fill({ color: fillColor }) : undefined;
      const stroke = new Stroke({ color, width });
      return new Style({ fill, stroke });
    } else {
      return new Style({});
    }
  }
}
