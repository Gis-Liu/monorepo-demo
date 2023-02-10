import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";

const configUrl = window.ENV;
function getUrl(level: number, x: number, y: number) {
  let imageUrl = "";
  if (level > 15) {
    const lonlat = GoogleXYZtoLonlat(level, x, y); // 根据x,y,level计算经纬度
    const mapId = find100wMapID(lonlat[0], lonlat[1]);
    if (configUrl.ValidMapId.includes(mapId)) {
      const districtNo = findDistrictNoByMapID(mapId);
      imageUrl = `${configUrl.InterfaceUrl}/china/dom/${districtNo}/${mapId}/L${level}/C${x}/R${y}`;
    } else {
      return undefined;
    }
  } else if (level == 15) {
    imageUrl = `${configUrl.InterfaceUrl}/china/dom/L${level}/C${x}/R${y}`;
  } else {
    imageUrl = `${configUrl.InterfaceUrl}/dom/${level}/${x}/${y}.png`;
  }
  return imageUrl;
}

function GoogleLonLatToXYZ(lon: number, lat: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const tileX = ((lon + 180) / 360) * n;
  const tileY =
    ((1 -
      Math.log(Math.tan(toRadians(lat)) + 1 / Math.cos(toRadians(lat))) /
        Math.PI) /
      2) *
    n;
  const x = Math.floor(tileX);
  const y = Math.floor(tileY);
  return [x, y];
}

/**
 * 层行列转经纬度
 *
 * @param x
 * @param y
 * @param z
 * @return
 */
function GoogleXYZtoLonlat(z: number, x: number, y: number) {
  const n = Math.pow(2, z);
  const lon = (x / n) * 360.0 - 180.0;
  let lat = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  lat = (lat * 180.0) / Math.PI;
  return [lon, lat];
}
//截取影像名
function getTifName(str: string) {
  const index = str.lastIndexOf(".");
  str = str.substring(0, index);
  return str;
}

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

function findDistrictNoByMapID(mapId: string) {
  type Key = keyof typeof window.ENV.DomConfig;
  for (const key in configUrl.DomConfig) {
    if (configUrl.DomConfig[key as Key].includes(mapId)) {
      return key;
    }
  }
  return "unknown";
}

function find100wMapID(lng: number, lat: number) {
  const rownum = Math.floor(lat / 4) + 1;
  const colnum = Math.floor(lng / 6) + 31;
  return (
    String.fromCharCode(65 + rownum - 1) + colnum.toString().padStart(2, "0")
  );
}

export function getLabelLayer() {
  const key = "4d8c4557d89a899def2eea0108fa41d5";
  const url = `http://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${key}`;
  return new TileLayer({
    source: new XYZ({
      // url: window.origin + "/label/{z}/{y}/{x}.png",
      url,
    }),
    properties: {
      isBaseLayer: true,
      type: "label",
    },
  });
}

export function getBaseLayer(type: "vec" | "img"):TileLayer<XYZ>[] {
  const { useCustomLayer, customImgBaseLayers, customVecBaseLayers } =
    window.ENV;
  if (useCustomLayer) {
    const urls = type === "img" ? customImgBaseLayers : customVecBaseLayers;
    return urls.map(
      (url) =>
        new TileLayer({
          source: new XYZ({ url }),
          properties: { isBaseLayer: true },
        })
    );
  } else {
    if (type === "img") {
      const imgLayer = new TileLayer({
        source: new XYZ({
          tileUrlFunction(coordinates) {
            const [z, x, y] = coordinates;
            const url = getUrl(z, y, x);
            return url;
          },
        }),
        properties: { isBaseLayer: true, type: "image" },
      });
      const labelLayer = new TileLayer({
        source: new XYZ({
          url: window.origin + "/label/{z}/{y}/{x}.png",
        }),
        properties: { isBaseLayer: true, type: "label" },
      });
      return [imgLayer, labelLayer];
    } else {
      return [];
    }
  }
}
