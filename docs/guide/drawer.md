
# createAntdDrawer

通过函数打开 Antd 的 Drawer

## 类型签名
```ts
import { DrawerProps } from 'antd/lib/drawer';

type ICreateProps = {
  onOk?: (...args: any[]) => any; // 点击确定按钮时触发的回调
  onCancel?: (...args: any[]) => any; // 点击取消按钮时触发的回调
  content?: React.ReactNode;
};

type ICreateDrawerProps = Omit<DrawerProps,'onOk' | 'onCancel' | 'onCancel' | 'afterVisibleChange'> & ICreateProps;

type createAntdDrawer = (options: ICreateDrawerProps) => ({ destroy: () => void });
```
<Alert>
提示：

`createAntdDrawer({})` 返回一个包含了 `destroy` 属性的对象，这样你就可以手动调用返回值关闭 Drawer。

```js
const { destroy } = createAntdDrawer({ ... })
destroy(); // 手动销毁抽屉
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
import { createAntdDrawer } from 'react-create-dm';

class Content extends React.Component {
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  render() {
    return <div>最简单的用法</div>;
  }
}

export default () => {
  const createDrawer = () => {
    createAntdDrawer({
      title: '基础示例',
      content: <Content />,
    });
  };
  return (
    <Button type="primary" onClick={createDrawer}>
      点我打开抽屉
    </Button>
  );
};
```

## 自定义`footer` + 从子组件取值

```tsx
/**
 * title: 从子组件取值
 * desc: 子组件提供 `onDMok` 函数，与创建它的父组件通信。
 */
import React from 'react';
import { Button } from 'antd';
import { createAntdDrawer } from 'react-create-dm';

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
    return (
      <div>
        <div>Drawer Content</div>
      </div>
    );
  }
}

function Footer(props) {
  return (
    <div>
      自定义footer
      <div style={{float:'right'}}>
      <Button onClick={props.onCancel} style={{marginRight:'8px'}}>
        自定义取消按钮
      </Button>
      <Button type="primary" loading={props.confirmLoading} onClick={props.onOk}>
        自定义确定按钮
      </Button>
      </div>
    </div>
  );
}

const createDrawer = () => {
  createAntdDrawer({
    title: '标题',
    width: '50%',
    content: <Content />,
    footer: <Footer />,
    onOk: result => {
      alert(result);
    },
  });
};

export default () => (
  <Button type="primary" onClick={createDrawer}>
    点我打开抽屉
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
import { createAntdDrawer } from 'react-create-dm';

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
    return <div>Drawer Content</div>;
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

const createDrawer = () => {
  createAntdDrawer({
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
  <Button type="primary" onClick={createDrawer}>
    点我打开抽屉
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
import { createAntdDrawer } from 'react-create-dm';

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
      Drawer Content
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

function Footer(props) {
  return (
    <div>
      自定义footer
      <div style={{float:'right'}}>
      <Button onClick={props.onCancel} style={{marginRight:'8px'}}>
        自定义取消按钮
      </Button>
      <Button type="primary" loading={props.confirmLoading} onClick={props.onOk}>
        自定义确定按钮
      </Button>
      </div>
    </div>
  );
}

const createDrawer = () => {
  createAntdDrawer({
    title: '标题',
    width: '50%',
    content: <Content />,
    footer: <Footer />,
    onOk: result => {
      alert(result);
    },
  });
};
export default () => (
  <Button type="primary" onClick={createDrawer}>
    点我打开抽屉
  </Button>
);
```
