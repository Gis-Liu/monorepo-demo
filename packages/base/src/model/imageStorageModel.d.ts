export interface VectorDataInfo {
  id: number;
  caption: string;
  vectorDatasourceType: string;
  size: string;
  storageDate: string;
  storageType: string;
  taskId: number;
  taskCaption: string;
  storageStatus: string;
  parseStatus: string;
  children?: VectorDataInfo[];
  mid?: any;
  tileServiceId: number;
  metaId?: any;
  checked: boolean;
}

export interface VectorMetaInfo {
  layerName: string;
  columnInfo: ColumnInfo[];
  srid: number;
  bounds: string;
  tableName: string;
  rowCount: number;
  adCode: string;
}

interface ColumnInfo {
  name: string;
  type: string;
}

export interface CreateSourceDataQueryImage {
  captionRelation: boolean;
  geomRelation: boolean;
  metaId: number;
  start: string;
  end: string;
}

export interface CreateSourceDataQueryImageResult {
  id: number;
  isActive: boolean;
  caption: string;
  path: string;
  satellite: string;
  bandOrder: string;
  bandCount: number;
  resolution: number;
  gridAdcode: string[];
  gridServiceId: number;
  storageTime: string;
  collectionDateStart: string;
  count: number;
  vectorAdcode: string[];
  vectorServiceId: number;
  tableName: string;
  bound: string;
  srid: string;
  resultGridMetaId: number;
}

export interface GridMeta {
  id: number;
  caption: string;
  satellite: string[];
  sensor?: any;
  resolution: number;
  created: string;
  receiveTime: string;
  space: string;
  bandNum: number;
  bandOrder: string;
  productLevel: string;
  productId?: any;
  upLeftLatLon: string;
  upRightLatLon: string;
  downLeftLatLon: string;
  downRightLatLon: string;
  centerLatLon: string;
  sensorType?: any;
  display?: any;
  tileServiceId: number;
  tileServiceStatus: string;
  extent: string;
}

interface VectorServiceMeta {
  created: string;
  srid?: any;
  upLeftLatLon?: any;
  upRightLatLon?: any;
  downLeftLatLon?: any;
  downRightLatLon?: any;
  centerLatLon?: any;
  tileServiceId: number;
  tileServiceStatus: string;
}

export interface VectorDetail {
  id: number;
  created: string;
  updated?: any;
  parentId: number;
  children?: any;
  caption: string;
  size: string;
  storageDate: string;
  storageType: string;
  vectorDatasourceType: string;
  databaseType?: any;
  taskId: number;
  status: string;
  parseStatus: string;
  metaId: number;
  vectorFile: string;
  sinkTableName: string;
  fileBackupId: number;
  tileServiceId: number;
  tileServiceStatus: string;
  SinkRowCount: number;
  sinkRowCount: number;
}

export interface GridDetail {
  id: number;
  created: string;
  updated: string;
  parentId?: any;
  children?: any;
  fileBackupId: number;
  fileName: string;
  size: string;
  storageDate: string;
  collectionDateStart?: any;
  collectionDate?: any;
  collectionDateEnd?: any;
  storageType: string;
  taskId: number;
  status: string;
  parseStatus: string;
  metaId: number;
  gridFile: string;
  productLevel?: any;
  gridType: string;
  imageType?: any;
  districtCodes: number[];
  satelliteId?: any;
  tileServiceId: number;
  tileServiceStatus: string;
  thumb: string;
  sensor?: any;
}
