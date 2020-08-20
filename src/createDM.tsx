import React, { Component } from 'react';
import Modal, { ModalProps } from 'antd/lib/modal';
import Drawer, { DrawerProps } from 'antd/lib/drawer';
import 'antd/lib/modal/style/index.less';
import 'antd/lib/drawer/style/index.less';
import 'antd/lib/button/style/index.less';
import 'antd/lib/style/index.less';
const omit = require('lodash/omit');
const ReactDOM = require('react-dom');

type IBaseCreateOption = {
  component: React.ComponentType<any>;
  cancelCbName: string;
  destoryCbName: string;
  okCbName: string;
  isModal?: boolean;
};
type IBaseDMProps = IBaseCreateOption & {
  onOk?: (...args: any[]) => any;
  close: (...args: any[]) => void;
  content?: React.ReactNode | string;
};

const SHOULD_OMIT_PROPS = [
  'onOk',
  'close',
  'isModal',
  'content',
  'okCbName',
  'component',
  'cancelCbName',
  'destoryCbName',
];
export class BaseDM extends Component<
  IBaseDMProps,
  { confirmLoading: boolean }
> {
  contentRef: React.RefObject<any> = React.createRef();
  onOkCallbackRef = React.createRef() as React.MutableRefObject<() => void>;
  onCancelCallbackRef = React.createRef() as React.MutableRefObject<() => void>;
  state = {
    confirmLoading: false,
  };
  renderContent = () => {
    const content = this.props.content as any;
    if (!content) return null;

    const props: any = {
      close: this.props.close.bind(this),
      onOk: (callback: () => any) => {
        this.onOkCallbackRef.current = callback;
      },
      onCancel: (callback: () => any) => {
        this.onCancelCallbackRef.current = callback;
      },
    };
    // 如果是class类型的组件
    if (
      content.type &&
      content.type.prototype &&
      content.type.prototype.isReactComponent
    ) {
      props.ref = this.contentRef;
      props.onOk = this.onOk.bind(this);
      props.onCancel = this.onCancel.bind(this);
      props.confirmLoading = this.state.confirmLoading;
    }

    return React.cloneElement(content, props);
  };
  renderCustomeNode = (cpt: any) => {
    return React.cloneElement(cpt, {
      close: this.props.close.bind(this),
      onCancel: this.onCancel,
      onOk: this.onOk,
      confirmLoading: this.state.confirmLoading,
    });
  };
  onCancel = () => {
    const close = this.props.close;
    let onDMClose = null;
    if (this.onCancelCallbackRef.current) {
      onDMClose = this.onCancelCallbackRef.current;
    } else if (this.contentRef.current && this.contentRef.current.onDMClose) {
      onDMClose = this.contentRef.current.onDMClose;
    }

    if (onDMClose) {
      onDMClose(close);
    } else {
      close();
    }
  };
  triggerOkOption = async (data: any) => {
    if (!this.props.onOk) {
      this.setState({ confirmLoading: false });
      this.props.close();
    } else {
      try {
        const res2 = this.props.onOk(data);
        if (res2 && res2.then) {
          await res2;
        }
        this.setState({ confirmLoading: false });
        // 如果返回 false 就阻止关闭
        if (res2 !== false) {
          this.props.close();
        }
      } catch (error) {
        console.warn(error);
        this.setState({ confirmLoading: false });
      }
    }
  };
  onOk = async () => {
    const cpt = this.contentRef.current;

    let onDMok: any = null;
    if (this.onOkCallbackRef.current) {
      onDMok = this.onOkCallbackRef.current;
    } else if (cpt && cpt.onDMok) {
      onDMok = cpt.onDMok;
    }

    let data;

    try {
      const res = onDMok && onDMok();
      if (res && res.then) {
        this.setState({ confirmLoading: true });
        data = await res;
        this.triggerOkOption(data);
      } else {
        data = res;
        this.triggerOkOption(data);
      }
    } catch (error) {
      console.warn(error);
      this.setState({ confirmLoading: false });
      return;
    }
  };
  render() {
    const { component, cancelCbName, isModal, okCbName } = this.props;
    const newProps = Object.assign(
      omit(this.props, SHOULD_OMIT_PROPS),
      {
        [cancelCbName]: this.onCancel,
      },
      isModal
        ? { [okCbName]: this.onOk, confirmLoading: this.state.confirmLoading }
        : {},
    ) as any;
    // 自定义title时，给它传一些必要的props
    if (React.isValidElement(newProps.title)) {
      newProps.title = this.renderCustomeNode(newProps.title);
    }
    // 自定义footer时，给它传一些必要的props
    if (React.isValidElement(newProps.footer)) {
      newProps.footer = this.renderCustomeNode(newProps.footer);
    }
    const content = this.renderContent();
    return React.createElement(component, newProps, content);
  }
}

export function baseCreate<T>(options: IBaseCreateOption) {
  const { destoryCbName } = options;
  return (modalProps: T) => {
    const divEl = document.createElement('div');

    function render(props: any) {
      ReactDOM.render(<BaseDM {...props} />, divEl);
    }
    function destroy() {
      ReactDOM.unmountComponentAtNode(divEl);
    }
    function close() {
      render({
        ...modalProps,
        ...options,
        visible: false,
        close,
        [destoryCbName]: destroy,
      });
    }
    function open() {
      render({
        ...modalProps,
        ...options,
        visible: true,
        close,
      });
    }

    open();
  };
}

export const createAntdModal = baseCreate<ModalProps>({
  component: Modal,
  okCbName: 'onOk',
  cancelCbName: 'onCancel',
  destoryCbName: 'afterClose',
  isModal: true,
});
export const createAntdDrawer = baseCreate<DrawerProps>({
  component: Drawer,
  okCbName: 'onOk',
  cancelCbName: 'onClose',
  destoryCbName: 'afterVisibleChange',
});

const ReactCreateDM = {
  createAntdModal,
  createAntdDrawer,
};

export default ReactCreateDM;
