import { CanvasWidget, ZoomCanvasAction } from '@projectstorm/react-canvas-core'
import createEngine, { DiagramModel, type LinkModel } from '@projectstorm/react-diagrams'
import { useEffect, useMemo } from 'react'
import { ActiveLinkFactory } from './ActiveLinkFactory'
import { CustomNodeFactory } from './CustomNodeFactory'
import { CustomNodeModel } from './CustomNodeModel'
import './Graph.css'

export const Graph = () => {
  const { engine, courseNode, lessonNode } = useMemo(() => {
    const nextEngine = createEngine({
      registerDefaultZoomCanvasAction: false,
    })

    nextEngine.getActionEventBus().registerAction(new ZoomCanvasAction({ inverseZoom: true }))
    nextEngine.getNodeFactories().registerFactory(new CustomNodeFactory())
    nextEngine.getLinkFactories().registerFactory(new ActiveLinkFactory())

    const model = new DiagramModel()

    const nextCourseNode = new CustomNodeModel({
      name: 'Курс',
      color: '#7f8cff',
    })
    nextCourseNode.setPosition(220, 160)

    const nextLessonNode = new CustomNodeModel({
      name: 'Урок',
      color: '#53d6a7',
    })
    nextLessonNode.setPosition(620, 240)

    model.addAll(nextCourseNode, nextLessonNode)
    nextEngine.setModel(model)

    return {
      engine: nextEngine,
      courseNode: nextCourseNode,
      lessonNode: nextLessonNode,
    }
  }, [])

  useEffect(() => {
    const model = engine.getModel() as DiagramModel

    let currentLink: LinkModel | null = null

    const refreshLink = () => {
      if (currentLink) {
        model.removeLink(currentLink)
        currentLink = null
      }

      const courseLeft = courseNode.getPosition().x < lessonNode.getPosition().x
      const sourcePort = courseLeft ? courseNode.getPort('right') : courseNode.getPort('left')
      const targetPort = courseLeft ? lessonNode.getPort('left') : lessonNode.getPort('right')

      if (sourcePort && targetPort) {
        currentLink = sourcePort.link(targetPort)

        if (currentLink) {
          model.addLink(currentLink)
        }
      }
    }

    const listener = model.registerListener({
      entityChanged(event) {
        const entity = 'entity' in event ? event.entity : undefined

        if (entity === courseNode || entity === lessonNode) {
          refreshLink()
        }
      },
    })

    refreshLink()

    return () => {
      model.deregisterListener(listener)

      if (currentLink) {
        model.removeLink(currentLink)
      }
    }
  }, [courseNode, engine, lessonNode])

  return (
    <div className='graph-shell'>
      <CanvasWidget className='graph-canvas' engine={engine} />
    </div>
  )
}

export default Graph
