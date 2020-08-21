---
title: 介绍
nav:
  title: 指南
  order: 1
---

## 介绍

使用函数优雅地创建 [ant-design](https://ant.design/docs/react/introduce-cn) 的 Drawer 和 Modal。它是 <a target="_blank" href="https://hzyhbk.github.io/vue-create-dm/">VueCreateDM</a> 的兄弟库。


## 安装

```bash
yarn add react-create-dm
```


## 特性
* 通过函数来创建`Modal`或`Drawer`组件
* `Modal`、`Drawer`的内容子组件的`componentDidMount`、`componentWillUnmount`生命周期按照正常逻辑触发
* 支持`Modal`、`Drawer`与父组件通信

## 为什么
在使用弹窗抽屉组件的过程中，你是否也曾遇到过以下场景：

1. 一个项目里有许多的弹窗和抽屉类型的交互，有时甚至一个页面组件里就有许多弹窗和抽屉组件，原生的使用方式是先在父组件中写好弹框抽屉组件，然后通过`visible`变量来控制弹窗的显示隐藏，当弹窗抽屉一多，看着各种`xxVisible`让人感觉很混乱。
2. 弹窗抽屉内包含的子组件的生命周期并没有按我们预想的逻辑触发。
   1. 我们想打开弹窗抽屉的时候才触发内容子组件的`componentDidMount`生命周期，然而实际上却并不是；
   2. 我们希望关闭的时候可以调用子组件的`componentWillUnmount`生命周期，可是目前的UI框架大多只是把组件设置为`display:none`了，并没有完全卸载子组件。
3. `antd`提供了`destroyOnClose`参数支持关闭时销毁子元素，但也没法解决上面说到的1，2两点问题。组件库虽然也有提供通过函数打开弹窗的方法，但那些都是一些简单的弹框，可配置的参数不多，自由度也不够高。

因此就有了`react-create-dm`这个库，`dm`就是分别取了`Drawer`和`Modal`的第一个字母组合在一起（为什么不是`md`呢，因为`md`是`markdown`的缩写...）。



