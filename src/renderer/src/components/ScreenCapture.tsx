import { useState, useEffect, CSSProperties } from 'react'
import html2canvas from 'html2canvas'
interface State {
  on: boolean
  startX: number
  startY: number
  endX: number
  endY: number
  crossHairsTop: number
  crossHairsLeft: number
  isMouseDown: boolean
  windowWidth: number
  windowHeight: number
  borderWidth: number | string | CSSProperties
  cropPositionTop: number
  cropPositionLeft: number
  cropWidth: number
  cropHeigth: number
  imageURL: string
}

function ScreenCapture() {
  const [state, setState] = useState<State>({
    // 是否在截图
    on: false,
    // 记录开始截图时鼠标的位置
    startX: 0,
    startY: 0,
    // 记录结束截图时鼠标的位置
    endX: 0,
    endY: 0,
    // 记录准星的位置，用于显示截图范围
    crossHairsTop: 0,
    crossHairsLeft: 0,
    // 是否按下鼠标
    isMouseDown: false,
    // 存储窗口的宽高，用于在窗口大小变化时更新
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    // 存储覆盖层的边框宽度，即截取范围的宽
    borderWidth: 0,
    // 记录截图区域的顶部和左侧的位置
    cropPositionTop: 0,
    cropPositionLeft: 0,
    // 记录截图区域的宽和高
    cropWidth: 0,
    cropHeigth: 0,
    // 存储图片的url
    imageURL: ''
  })

  useEffect(() => {
    function handleResize() {
      setState((pre) => ({
        ...pre,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 鼠标摁下的时候
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { clientX, clientY } = e
    setState((pre) => ({
      ...pre,
      startX: clientX,
      startY: clientY,
      cropPositionTop: clientY,
      cropPositionLeft: clientX,
      isMouseDown: true,
      borderWidth: `${pre.windowWidth}px ${pre.windowHeight}px`
    }))
  }

  // 鼠标移动的时候
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { isMouseDown, windowWidth, windowHeight, startX, startY, borderWidth } = state
    let cropPositionTop = startY
    let cropPositionLeft = startX
    const endX = e.clientX
    const endY = e.clientY
    const isStartTop = endY >= startY
    const isStartBottom = endY <= startY
    const isStartLeft = endX >= startX
    const isStartRight = endX <= startX
    const isStartTopLeft = isStartTop && isStartLeft
    const isStartTopRight = isStartTop && isStartRight
    const isStartBottomLeft = isStartBottom && isStartLeft
    const isStartBottomRight = isStartBottom && isStartRight
    let newBorderWidth = borderWidth
    let cropWidth = 0
    let cropHeigth = 0

    if (isMouseDown) {
      if (isStartTopLeft) {
        newBorderWidth = `${startY}px ${windowWidth - endX}px ${windowHeight - endY}px ${startX}px`
        cropWidth = endX - startX
        cropHeigth = endY - startY
      }

      if (isStartTopRight) {
        newBorderWidth = `${startY}px ${windowWidth - startX}px ${windowHeight - endY}px ${endX}px`
        cropWidth = startX - endX
        cropHeigth = endY - startY
        cropPositionLeft = endX
      }

      if (isStartBottomLeft) {
        newBorderWidth = `${endY}px ${windowWidth - endX}px ${windowHeight - startY}px ${startX}px`
        cropWidth = endX - startX
        cropHeigth = startY - endY
        cropPositionTop = endY
      }

      if (isStartBottomRight) {
        newBorderWidth = `${endY}px ${windowWidth - startX}px ${windowHeight - startY}px ${endX}px`
        cropWidth = startX - endX
        cropHeigth = startY - endY
        cropPositionLeft = endX
        cropPositionTop = endY
      }
    }

    setState((pre) => ({
      ...pre,
      borderWidth: newBorderWidth,
      cropPositionTop,
      cropPositionLeft,
      cropWidth,
      cropHeigth
    }))
  }

  // 鼠标抬起的时候
  function handleMouseUp() {
    handleClickTakeScreenShot();
    setState((pre) => ({
      ...pre,
      on: false,
      isMouseDown: false,
      borderWidth: 0
    }))
  }

  function handleClickTakeScreenShot() {
    
  }
  return <div></div>
}

export default ScreenCapture
