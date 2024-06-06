import React, { useState, useEffect } from 'react'
interface Position {
  x: number
  y: number
  width: number
  height: number
}

function App(): JSX.Element {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, width: 100, height: 100 })
  const [start, setStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const onMouseDownDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true)
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y, width: 0, height: 0 })
  }

  const onMouseDownResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsResizing(true)
    setStart({ x: e.clientX, y: e.clientY, width: position.width, height: position.height })
    e.stopPropagation() // 阻止mousedown事件冒泡
  }

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        ...position,
        x: e.clientX - start.x,
        y: e.clientY - start.y,
        width: position.width,
        height: position.height
      })
    }
    if (isResizing) {
      // 限制最小宽高
      const newWidth = Math.max(50, start.width + (e.clientX - start.x))
      const newHeight = Math.max(50, start.height + (e.clientY - start.y))
      setPosition({
        ...position,
        width: newWidth,
        height: newHeight
      })
    }
  }

  const onMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  return (
    <div>
      <p>Hello world</p>
      <div
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${position.width}px`,
          height: `${position.height}px`,
          backgroundColor: 'skyblue',
          cursor: 'grab'
        }}
        className="rounded-2xl"
        onMouseDown={onMouseDownDrag}>
        <div
          style={{
            position: 'absolute',
            right: '0px',
            bottom: '0px',
            width: '10px',
            height: '10px',
            cursor: 'nwse-resize'
          }}
          onMouseDown={(e) => onMouseDownResize(e)}
        />
        {/* <CaptureTool/> */}
      </div>
    </div>
  )
}

export default App
