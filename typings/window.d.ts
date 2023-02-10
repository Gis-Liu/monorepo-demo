declare interface Window {
  __POWERED_BY_QIANKUN__: boolean;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
  ENV: {
    /**
     * @type 是否使用 天地图
     */
    isTDT: boolean;
    /**
     * @type 天地图 key 覆盖
     */
    keyTDT: string;
    /**
     * @type 天地图 底图
     */
    tdImageUrl: string;
    /**
     * @type 天地图 标注
     */
    tdtLabelUrl: string;
    /**
     * @type api接口根路径
     */
    InterfaceUrl: string;

    /**
     *  @type websocket接口根路径
     */
    WebSocketUrl: string;
    /**
     * @type 数据上传接口根路径
     */
    UploadUrl: string;

    /**
     * @type DiitProtal 门户地址
     */
    DiitProtal: string;
    /**
     * @type  cesium地图定位
     * @param x 经度
     * @param y 纬度
     * @param z 高程
     * @param d 飞行时间
     */
    CenterOption: {
      x: number;
      y: number;
      z: number;
      d: number;
    };
    /**
     * @type 行政区划编码
     */
    RegionCode: string | number;
    /**
     * @type 文件上传上限,以1M为基础 5=5M
     */
    UploadSize: number;

    /**
     * @type 全国dom分幅配置
     */
    DomConfig: {
      northwest: string[];
      southwest: string[];
      southeast: string[];
      northeast: string[];
      xinjiang: string[];
    };
    /**
     * @type 省份有效分幅范围
     */
    ValidMapId: string[];
    MAX_GPU_NUM: number;
    useCustomLayer: boolean;
    customImgBaseLayers: string[];
    customVecBaseLayers: string[];
    defaultBaseLayer: "img" |"vec"
  };
}
