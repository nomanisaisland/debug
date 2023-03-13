/**
 * @Author: nomanisaisland
 * @Date: 2022-06-15 19:59:06
 * @LastEditTime: 2022-06-16 23:27:59
 * @LastEditors: nomanisaisland
 * @Description: 
 * @FilePath: \debug-anything\react-test\src\App.js
 * @可以输入预定的版权声明、个性签名、空行等
 */

import logo from './logo.svg';
import './App.css';
import { useEffect, useState, Suspense, lazy, useRef, memo, useMemo } from "react"


class ReactSimpleState {
  static useStateControl (defaultValue) {
    const state = typeof defaultValue === 'function' ? defaultValue() : defaultValue
    const [control, setControl] = useState(() => {
      const stateControl = {
        state,
        update () {
          setControl({
            state
          })
        }
      }
      return stateControl
    })
    return control
  }
}

let index = 0
// 啊实打实
function Loading () {
  return (
    <div>
      ...
    </div>
  )
}
const LazyComp = lazy(() => import("./LazyComp"))
import { useCallback } from 'react';

function CallBackTestComp ({ callbackTest, count, updateParent }) {
  const [test, setTest] = useState(0)

  return (
    <>
      <p>
        callbacktestdemo
        {count}
        {test}
      </p>
      <button onClick={() => { setTest(test + 1) }}>test</button>
      <button onClick={() => {
        updateParent()
      }}>updateParent</button>
    </>
  )
}

function DiffDemo ({ diffTextNodeDemoVal }) {
  const [count, setCount] = useState(0)
  return (
    <>
      {/* <p>{diffTextNodeDemoVal}</p> */}
      <p key={count} onClick={() => { setCount(count + 1) }}>{count}</p>
      {/* <button onClick={() => { setCount(count + 1) }}>setCount</button> */}
    </>
  )
}
function DiffTextNodeDemo () {
  const [list, setList] = useState(() => {
    return [
      1, 2, 3, 4, 5, 6
    ]
  })
  const [val, setVal] = useState(0);
  return (
    <>
      {/* <input type="text" onChange={(e) => { setVal(e.target.value) }} value={val} /> */}
      {/* <p>{val}</p> */}

      <ul>
        {
          list.map((l) => {
            return (
              <li key={l}>{l}</li>
            )
          })
        }
      </ul>
      <button onClick={() => {
        setList([
          1, 3, 2, 4, 5, 6
        ])
      }}>DiffTextNodeDemo</button>
      {/* {
        (val % 2 === 0 ? (<p>{val}</p>) : undefined)
      } */}
    </>
  )
}
function App () {
  const { state, ...stateControl } = ReactSimpleState.useStateControl({
    num: 0,
    load () {
      state.num = 100;
      stateControl.update();
    },
    count () {
      console.log(111)
      state.num++
      stateControl.update()
    }
  })
  useEffect(() => {
    state.load()
  }, [])
  useEffect(() => {
    console.log("检测到state变化")
  }, [JSON.stringify(state)])
  const [count, setCount] = useState(0)
  // const [state, setState] = useState([]);
  const ref = useRef();
  // state.push(1)
  function changeState () {
    console.log("app2")
    setCount(count + 1)
  }
  useEffect(() => {
  }, [])
  function memoFn (a) {
    return a + 1
  }
  const memoizedValue = useMemo(() => memoFn(count), [count]);


  const MemoButton = memo(CallBackTestComp)

  // 每次更新子组件重新渲染都会导致这个方法被重新执行，所以使用useCallBack优化
  const callbackTest = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("callback")
      }, 1000)
    })
  }

  // 会重新创建这个方法
  // const updateParent = () => {
  //   console.log('handleClick');
  //   setCount(count + 1)
  // }
  const updateParent = useCallback(() => {
    console.log(count)
    setCount(count + 1)
  }, [count])

  const [diffTextNodeDemoVal, setDiffTextNodeDemoVal] = useState(0)
  return (
    <div className="App" ref={ref} onClick={() => { console.log("app") }}>
      <header className="App-header">
        <DiffDemo diffTextNodeDemoVal={diffTextNodeDemoVal} />
        <button onClick={() => { setDiffTextNodeDemoVal(diffTextNodeDemoVal + 1) }}>diffTextNodeDemoVal</button>
        <DiffTextNodeDemo />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React {count}- {memoizedValue}
        </a>
        <input type="text" />
        <button onClick={changeState}>start</button>
        <MemoButton callbackTest={callbackTest} count={count} updateParent={updateParent} />
        <Suspense fallback={<Loading />}>
          <LazyComp />
        </Suspense>
        <button onDoubleClick={(event) => { console.log(event.isDefaultPrevented()) }}>onTouchStart</button>
        <input type="onChangeFunc" onChange={(event) => { console.log(event.isDefaultPrevented()) }} />
        <input type="onFocus" onFocus={() => { }} />
        <div>
          <button onClick={() => {
            state.count()
          }}>状态管理测试</button>
          <p>{state.num}</p>
        </div>
      </header>
    </div>
  );
}
export default App;
