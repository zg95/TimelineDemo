<template>
  <!-- Mars3D地图容器 -->
  <div id="mars3dContainer" class="mars3d-container"></div>

  <!-- 时间轴控件 -->
  <bim-time-line-container
    ref="timeLineContainer"
    type="CHBIM"
    v-model="data"
    :unitInterval="unitInterval"
    :totalTimeRange="totalTimeRange"
    :manageTime="manageTime"
    @onQuicklyAddTask="onQuicklyAddTask"
    @changerange="changerange"
    @chengeActive="chengeActive"
    @startPlayback="startPlayback"
    @pausePlayback="pausePlayback"
    @taskEventing="taskEventing"
    @taskAllEventing="taskAllEventing"
    @endTask="endTask"
    @getTask="getTask"
    @delTaskCallback="delTaskCallback"
    @editTaskCallback="editTaskCallback"
  >
    <template #header>
      <div class="header-btn">
        <div class="header-btn-l">
          <i class="las la-play-circle" @click="() => play()"></i>
          <i class="las la-pause-circle" @click="() => pause()"></i>
          <i class="las la-undo-alt" @click="() => reset()"></i>
          <el-button type="primary" @click="addTask">添加任务</el-button>
        </div>
        <div class="header-btn-r">
          <i class="las la-sort-down" @click="fold"></i>
          <i class="las la-expand" @click="fullScreenFold(0)"></i>
          <i class="las la-expand-arrows-alt" @click="fullScreen"></i>
        </div>
      </div>
    </template>
  </bim-time-line-container>
</template>

<script setup lang="ts">
import * as mars3d from "mars3d";
import { onMounted, ref } from "vue";

// 扩展Window接口以支持全局变量
declare global {
  interface Window {
    mars3d: typeof mars3d;
    Cesium: typeof mars3d.Cesium;
    map: mars3d.Map;
    graphicLayer: mars3d.layer.GraphicLayer;
  }
}

// 定义任务相关的接口
interface Position {
  alt: number;
  heading: number;
  lat: number;
  lng: number;
  pitch: number;
}

interface TaskAttr {
  type: string;
  position?: Position;
  text?: string;
  modelurl?: string;
  name?: string;
  view?: boolean;
}

/**
 * 任务接口定义
 * @interface Task
 * @description 用于定义时间轴中的任务数据结构
 */
interface Task {
  /** 任务唯一标识符 */
  id: string;
  /** 父级任务ID数组，用于构建任务层级关系 */
  parentId: string[];
  /** 任务显示名称 */
  name: string;
  /** 任务类型
      1.taskTeam -- 任务组
          tasks -- 普通任务
          tasks_point -- 瞬时任务
      2.group -- 普通分组
          task -- 单任务
   **/
  type: string;
  /** 任务属性配置，包含位置、文本等自定义属性 */
  attr?: TaskAttr;
  /** 任务开始时间，格式：YYYY-MM-DD HH:mm:ss */
  startTime?: string | null;
  /** 任务结束时间，格式：YYYY-MM-DD HH:mm:ss */
  endTime?: string | null;
  /** 是否加粗显示 */
  blob?: boolean;
  /** 程序内部使用的任务ID（自己定义可以不要） */
  taskid?: string;
  /** 是否允许添加子任务 */
  add?: boolean;
  /** 子任务数组，用于构建任务树结构 */
  children?: Task[];
  /** 任务数组，用于存储同一组下的多个任务 */
  taskArr?: Task[];
}

// 初始化地图
onMounted(() => {
  // 设置全局变量
  window.mars3d = mars3d;
  window.Cesium = mars3d.Cesium;

  // 配置地图选项
  const mapOptions = {
    basemaps: [{ name: "天地图", type: "tdt", layer: "img_d", show: true }],
    // control: {
    //   animation: true,
    //   timeline: true,
    // },
  };

  // 创建地图实例
  window.map = new mars3d.Map("mars3dContainer", mapOptions);
  window.graphicLayer = new mars3d.layer.GraphicLayer();
  window.map.addLayer(window.graphicLayer);

  // 设置场景光照
  window.map.viewer.scene.light = new window.Cesium.DirectionalLight({
    direction: new window.Cesium.Cartesian3(0.354925, -0.890918, -0.283358),
  });
});

// 时间轴数据
const data = ref<Task[]>([
  {
    id: "grouping_0",
    parentId: [],
    name: "视点",
    type: "taskTeam",
    taskArr: [
      {
        id: "grouping_0_1",
        parentId: ["grouping_0"],
        name: "点",
        type: "tasks_point",
        attr: {
          type: "setCameraView",
          position: {
            alt: 123.2,
            heading: 8.4,
            lat: 31.84246,
            lng: 117.251057,
            pitch: -34.7,
          },
        },
        startTime: "2024-12-01",
      },
      {
        id: "grouping_0_2",
        parentId: ["grouping_0"],
        name: "块",
        type: "tasks",
        attr: {
          type: "test",
          text: "漫游数据",
        },
        startTime: "2025-02-07 00:00:00",
        endTime: "2025-05-23 00:00:00",
      },
    ],
    blob: true,
    taskid: "grouping_0",
  },
  {
    id: "grouping_1",
    parentId: [],
    name: "分组一",
    type: "group",
    add: true,
    children: [],
  },
  {
    id: "grouping_2",
    parentId: [],
    name: "分组二",
    type: "group",
    add: true,
    children: [
      {
        id: "grouping_2_1",
        parentId: ["grouping_2"],
        name: "模型",
        type: "group",
        startTime: null,
        add: true,
        endTime: null,
        children: [
          {
            id: "model_1",
            name: "模型1",
            type: "task",
            startTime: "2025-01-28 00:00:00",
            endTime: "2025-05-22 00:00:00",
            parentId: ["grouping_2", "grouping_2_1"],
            attr: {
              type: "model",
              modelurl: "https://data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
              name: "模型1",
            },
          },
        ],
      },
      {
        id: "grouping_2_1",
        parentId: ["grouping_2"],
        name: "标注",
        type: "group",
        startTime: null,
        add: true,
        endTime: null,
        children: [
          {
            id: "label_1",
            name: "标注1",
            type: "task",
            startTime: "2025-03-28 00:00:00",
            endTime: "2025-05-22 00:00:00",
            parentId: ["grouping_2", "grouping_2_1"],
            attr: {
              type: "div",
              name: "标注1",
            },
          },
        ],
      },
    ],
  },
]);

// 时间轴配置
const totalTimeRange = ref<[string, string]>([
  "2024-09-02 00:00:00",
  "2027-11-29 23:59:59",
]);
const manageTime = ref<[string, string]>([
  "2024-10-12 00:00:00",
  "2027-10-25 23:59:59",
]);
const unitInterval = ref<string>("month");
const timeLineContainer = ref<any>(null);
const activeValue = ref<string>("");

// 事件处理函数
const chengeActive = (id: string): void => {
  activeValue.value = id;
};

const changerange = (startTime: string, endTime: string): void => {
  totalTimeRange.value = [startTime, endTime];
};

const startPlayback = (): void => {
  console.log("开始播放");
};

const pausePlayback = (): void => {
  console.log("暂停播放");
};

// 任务事件处理
const taskEventing = (type: string, item: Task, arr: any[]): void => {
  console.log(type, item, arr);

  if (!item.attr) return;

  switch (item.attr.type) {
    case "setCameraView":
      pause();
      if (item.attr.position) {
        window.map
          .setCameraView({
            lng: item.attr.position.lng,
            lat: item.attr.position.lat,
            alt: item.attr.position.alt,
            heading: item.attr.position.heading,
            pitch: item.attr.position.pitch,
          })
          .then(() => {
            play();
          });
      }
      break;

    case "model":
      const tiles3dLayer = new mars3d.layer.TilesetLayer({
        name: "教学楼",
        url: "https://data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
        position: { lng: 117.251229, lat: 31.844015, alt: 0 },
        maximumScreenSpaceError: 16,
      });
      window.map.addLayer(tiles3dLayer);
      break;

    case "div":
      const graphic = new mars3d.graphic.PointEntity({
        position: [117.251293, 31.844745, 0],
        style: {
          color: "#ff0000",
          pixelSize: 10,
          outlineColor: "#ffffff",
          outlineWidth: 2,
          label: {
            text: "不知道写点啥",
            font_size: 18,
            color: "#ffffff",
            pixelOffsetY: -20,
          },
        },
      });
      window.graphicLayer.addGraphic(graphic);
      break;

    case "test":
      console.warn(item.attr.text);
      break;
  }
};

const taskAllEventing = (arr: any[]): void => {
  console.log("任务组事件:", arr);
};

const endTask = (): void => {
  console.log("任务结束");
};

const addTask = (e) => {
  // 给任务添加附加字段
  // 测试表单数据
  const form = {
    name: "自定义",
    type: "task",
    startTime: "2025-01-15 00:00:00",
    endTime: "2025-07-01 00:00:00",
    icon: "las la-road",
    attr: {
      type: "test",
      text: "自定义数据",
    },
    parentId: ["grouping_1"],
  };

  timeLineContainer.value?.addTask(form);
};

// 快速添加任务
const onQuicklyAddTask = (date: string): void => {
  const form: Task = {
    id: `task_${Date.now()}`, // 生成唯一ID
    name: "测试表单1",
    type: "point",
    startTime: date,
    attr: {
      view: true,
      type: "test",
      text: "视点飞行",
    },
    parentId: ["grouping_0"],
  };

  timeLineContainer.value?.addTask(form, "grouping_0");
};

// 回调函数
const delTaskCallback = (data: any): void => {
  console.log("删除回调", data);
};

const editTaskCallback = (data: any): void => {
  console.log("编辑回调", data);
};

// 获取任务数据（一般用于编辑）
const getTask = (data: any): void => {
  console.log("获取任务数据", data);
};

// 播放控制函数
const play = (e: boolean = true): void => {
  timeLineContainer.value?.play(e);
};

const pause = (): void => {
  timeLineContainer.value?.pause();
};

const reset = (): void => {
  timeLineContainer.value?.reset();
};

const fullScreen = () => {
  timeLineContainer.value?.fullScreen();
};

const fullScreenFold = () => {
  timeLineContainer.value?.fullScreen(0);
  timeLineContainer.value?.fold(0);
};

const fold = () => {
  timeLineContainer.value?.fold();
};
</script>

<style>
body {
  margin: 0;
}

body .mars3d-container {
  height: calc(100vh - 354px);
}

.CHBIM-gantt-header {
  background-color: #212121;
}

.header-btn {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  justify-content: space-between;
}
.header-btn-l,
.header-btn-r {
  display: flex;
  align-items: center;
}
.header-btn-l button {
  margin-left: 5px;
}
.header-btn i {
  font-size: 30px;
  color: #fff;
  margin-left: 5px;
  cursor: pointer;
}
</style>
