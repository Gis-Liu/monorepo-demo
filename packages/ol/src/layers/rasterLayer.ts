import Map from "ol/Map";
import { imageStorageApi, tileServiceApi } from "@diit/base";
import Layer from "ol/layer/Layer";
import GeoJSON from "ol/format/GeoJSON";
import TileImage from "ol/source/TileImage";
import TileLayer from "ol/layer/Tile";
import type { Options } from "ol/layer/BaseTile";
import { GridMeta } from "@diit/base/src/model/imageStorageModel";
import { LegendItem } from "@diit/base/src/model/legendModel";
import { getGridSource } from "./dataSource";

export class RasterLayer {
  name = "";
  info: GridMeta | undefined;
  layerObj: Layer | null = null;
  legendsRecord: Record<string, LegendItem> = {};
  extent: any;
  dataId: number;
  tileServiceId: number | undefined;
  serviceInfo: any;
  whenReady: Promise<RasterLayer>;
  options: Options<TileImage>;
  constructor(params: { dataId: number }, options: Options<TileImage> = {}) {
    this.dataId = params.dataId;
    this.options = options;
    this.whenReady = this.init();
  }

  async init() {
    await this.initMeta();
    const source = await this.initSource();
    this.layerObj = await this.initLayer(source);
    return this;
  }

  async initSource() {
    const { source, extent, serviceInfo } = await getGridSource(this.tileServiceId!)
    this.extent = extent;
    this.serviceInfo = serviceInfo;
    return source;
  }

  async initMeta() {
    const sourceMeta = (await imageStorageApi.getResultGridMeta(this.dataId)).data;
    const { tileServiceId, caption } = sourceMeta;
    this.name = caption;
    this.info = sourceMeta;
    this.tileServiceId = tileServiceId;
  }

  async initLayer(source: TileImage) {
    const { min_zoom, max_zoom } = this.serviceInfo;
    let defaultOptions = {
      source: source as TileImage,
      extent: this.extent,
      minZoom: min_zoom,
      maxZoom: max_zoom,
    };
    Object.assign(defaultOptions, this.options);
    return new TileLayer(defaultOptions);
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
  moveFront() { }
  moveBack() { }
  moveTop() { }
  moveBottom() { }
}
