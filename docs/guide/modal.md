
# createAntdModal

通过函数打开 Antd 的 Modal

## 类型签名
```ts
import { ModalProps } from 'antd/lib/modal';

type ICreateProps = {
  onOk?: (...args: any[]) => any; // 点击确定按钮是触发的回调
  onCancel?: (...args: any[]) => any; // 点击取消按钮是触发的回调
  content?: React.ReactNode;
};

type ICreateModalProps = Omit<ModalProps,'onOk' | 'onCancel' | 'onCancel' | 'afterVisibleChange'> & ICreateProps;

type createAntdModal = (options: ICreateModalProps) => ({ destroy: () => void });
```
<Alert>
提示：

`createAntdModal({})` 返回一个包含了 `destroy` 属性的对象，这样你就可以手动调用返回值关闭 Modal。

```js
const { destroy } = createAntdModal({ ... })
destroy(); // 手动销毁弹窗
```
</Alert>

## 基础示例

```tsx
/**
 * title: 基础示例
 * desc: 最简单的用法
 */
import React from 'react';
import { Button } from 'antd';
import { createAntdModal } from 'react-create-dm';

class Content extends React.Component {
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  render() {
    return <div>最简单的用法hhhh</div>;
  }
}

export default () => {
  const createModal = () => {
    createAntdModal({
      title: '基础示例',
      content: <Content />,
      onCancel: () => {
        console.log(123123)
      }
    });
  };
  return (
    <Button type="primary" onClick={createModal}>
      点我打开弹框
    </Button>
  );
};
```

## 从子组件取值

```tsx
/**
 * title: 从子组件取值
 * desc: 子组件提供 `onDMok` 函数，与创建它的父组件通信。
 */
import React from 'react';
import { Button } from 'antd';
import { createAntdModal } from 'react-create-dm';

class Content extends React.Component {
  onDMok() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('payloadFromContent');
      }, 3000);
    });
  }
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  render() {
    return <div>Modal Content</div>;
  }
}

const createModal = () => {
  createAntdModal({
    title: '标题',
    content: <Content />,
    onOk: result => {
      alert(result);
    },
    onCancel: function(){
      console.log('取消取消取消取消取消取消')
    }
  });
};
export default () => (
  <Button type="primary" onClick={createModal}>
    点我打开弹框
  </Button>
);
```
## 自定义`title`

```tsx
/**
 * title: 自定义title
 * desc: 默认会往自定义的`title`组件内传入`onOk`、 `onCancel`、 `confirmLoading` 三个props
 */
import React from 'react';
import { Button } from 'antd';
import { createAntdModal } from 'react-create-dm';

class Content extends React.Component {
  onDMok() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('payloadFromContent');
      }, 3000);
    });
  }
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  render() {
    return <div>Modal Content</div>;
  }
}

function Title(props) {
  return (
    <div>
      自定义title
      <Button loading={props.confirmLoading} onClick={props.onCancel}>
        自定义关闭按钮
      </Button>
    </div>
  );
}

const createModal = () => {
  createAntdModal({
    title: <Title />,
    content: <Content />,
    footer: null,
    closable: false,
    maskClosable: false,
    onOk: result => {
      alert(result);
    },
  });
};
export default () => (
  <Button type="primary" onClick={createModal}>
    点我打开弹框
  </Button>
);
```
## 自定义`footer`

```tsx
/**
 * title: 自定义footer
 * desc: 默认会往自定义的`footer`组件内传入`onOk`、 `onCancel`、 `confirmLoading` 三个props
 */
import React from 'react';
import { Button } from 'antd';
import { createAntdModal } from 'react-create-dm';

class Content extends React.Component {
  onDMok() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('payloadFromContent');
      }, 3000);
    });
  }
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  render() {
    return <div>Modal Content</div>;
  }
}

function Footer(props) {
  return (
    <div>
      自定义footer
       <Button onClick={props.onCancel}>
        自定义取消按钮
      </Button>
      <Button type="primary" loading={props.confirmLoading} onClick={props.onOk}>
        自定义确定按钮
      </Button>
    </div>
  );
}

const createModal = () => {
  createAntdModal({
    title: '标题',
    content: <Content />,
    footer: <Footer />,
    onOk: result => {
      alert(result);
    },
  });
};
export default () => (
  <Button type="primary" onClick={createModal}>
    点我打开弹框
  </Button>
);
```
## 函数式`content`组件

```tsx
/**
 * title: 函数式content组件
 * desc: 函数式`content`组件，如果要与创建它的父组件通信，和class组件稍微有点不一样
 */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { createAntdModal } from 'react-create-dm';

function Content(props) {
  const [count, setCount] = useState(0);
  const onDMok = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(count);
      }, 3000);
    });
  };
  useEffect(() => {
    props.onOk(onDMok);
  }, [onDMok]);
  useEffect(() => {
    console.log('componentDidMount');
    return () => {
      console.log('componentWillUnmount');
    };
  }, []);
  return (
    <div>
      Modal Content
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

const createModal = () => {
  createAntdModal({
    title: '标题',
    content: <Content />,
    onOk: result => {
      alert(result);
    },
  });
};
export default () => (
  <Button type="primary" onClick={createModal}>
    点我打开弹框
  </Button>
);
```
