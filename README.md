# 🕒 Timeline 时间轴组件

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

一个基于 Vue 3 + TypeScript 开发的时间轴组件，支持任务管理、时间轴播放等功能。

</div>

## 📋 目录

- [组件属性](#组件属性)
- [事件](#事件)
- [方法](#方法)
- [数据结构](#数据结构)
- [使用示例](#使用示例)
- [样式定制](#样式定制)
- [常见问题](#常见问题)

## 🎯 组件属性

### 基础属性

| 属性名         | 类型             | 必填 | 说明                                               |
| -------------- | ---------------- | ---- | -------------------------------------------------- |
| type           | string           | ✅   | 组件类型，固定值："CHBIM"                          |
| v-model        | Task[]           | ✅   | 时间轴数据，双向绑定                               |
| unitInterval   | string           | ✅   | 时间单位间隔，可选值："month"                      |
| totalTimeRange | [string, string] | ✅   | 总时间范围，格式：["开始时间", "结束时间"]         |
| manageTime     | [string, string] | ✅   | 用户选择的时间范围，格式：["开始时间", "结束时间"] |

## 🎮 事件

### 基础事件

| 事件名           | 参数                                           | 说明                             |
| ---------------- | ---------------------------------------------- | -------------------------------- |
| onQuicklyAddTask | (date: string) => void                         | 快速添加任务回调                 |
| changerange      | (startTime: string, endTime: string) => void   | 时间范围改变回调                 |
| chengeActive     | (id: string) => void                           | 选中任务改变回调                 |
| startPlayback    | () => void                                     | 开始播放回调                     |
| pausePlayback    | () => void                                     | 暂停播放回调                     |
| taskEventing     | (type: string, item: Task, arr: any[]) => void | 单任务事件触发回调               |
| taskAllEventing  | (arr: any[]) => void                           | 任务组事件触发回调               |
| endTask          | () => void                                     | 任务结束回调                     |
| getTask          | (data: any) => void                            | 获取任务数据回调（一般用于编辑） |
| delTaskCallback  | (data: any) => void                            | 删除任务回调                     |
| editTaskCallback | (data: any) => void                            | 编辑任务回调                     |

## ⚙️ 方法

### 播放控制

| 方法名 | 参数                  | 说明                      |
| ------ | --------------------- | ------------------------- |
| play   | (e?: boolean) => void | 播放，参数为 false 时倒放 |
| pause  | () => void            | 暂停播放                  |
| reset  | () => void            | 重置播放                  |

## 📊 数据结构

### Task 接口

```typescript
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
```

### TaskAttr 接口

```typescript
interface TaskAttr {
  /** 任务类型 */
  type: string;
  /** 位置信息 */
  position?: Position;
  /** 文本内容 */
  text?: string;
  /** 模型URL */
  modelurl?: string;
  /** 名称 */
  name?: string;
  /** 是否显示视图 */
  view?: boolean;
}
```

### Position 接口

```typescript
interface Position {
  /** 高度 */
  alt: number;
  /** 朝向角度 */
  heading: number;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 俯仰角度 */
  pitch: number;
}
```

## 💡 使用示例

### 基础用法

```vue
<template>
  <bim-time-line-container
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
        <i class="las la-play-circle" @click="() => play()"></i>
        <i class="las la-pause-circle" @click="() => pause()"></i>
        <i class="las la-undo-alt" @click="() => reset()"></i>
      </div>
    </template>
  </bim-time-line-container>
</template>
```

### 任务类型说明

1. 任务组（taskTeam）
   - 普通任务（tasks）：有开始和结束时间的任务
   - 瞬时任务（tasks_point）：只有开始时间的瞬时任务
2. 普通分组（group）
   - 单任务（task）：分组下的具体任务

### 注意事项

1. 时间格式统一使用：`YYYY-MM-DD HH:mm:ss`
2. 任务 ID 必须唯一
3. 父级 ID 数组用于构建任务层级关系
4. 任务属性（attr）根据不同类型可以包含不同的配置项

## 🎨 样式定制

### 基础样式

```css
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
}

.header-btn i {
  font-size: 30px;
  color: #fff;
  margin-left: 5px;
  cursor: pointer;
}
```

## ❓ 常见问题

### 1. 时间格式问题

- 所有时间相关的属性必须使用 `YYYY-MM-DD HH:mm:ss` 格式
- 时间范围必须包含开始和结束时间

### 2. 任务层级问题

- 使用 `parentId` 数组来构建任务层级关系
- 每个任务必须指定其父级 ID

### 3. 任务类型问题

- 任务组（taskTeam）可以包含普通任务和瞬时任务
- 普通分组（group）可以包含单任务
- 任务类型必须正确指定，否则可能导致显示异常

### 4. 事件处理问题

- 所有事件回调函数都应该正确处理异常情况
- 特别注意 `taskEventing` 事件中的类型判断

---

<div align="center">

有什么问题请提 issue，或者加微信：18971126088
![wechat](URL_ADDRESS![wechat](https://github.com/CHBIM/CHBIM/blob/main/wechat.png)

</div>
