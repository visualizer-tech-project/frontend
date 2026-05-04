import type { DiagramEngine } from '@projectstorm/react-diagrams'
import { PortWidget } from '@projectstorm/react-diagrams'
import { CustomNodeModel } from './CustomNodeModel'
import './CustomNodeWidget.css'

interface Props {
  node: CustomNodeModel
  engine: DiagramEngine
}

export const CustomNodeWidget = ({ node, engine }: Props) => {
  return (
    <div
      className="custom-node"
      style={{
        borderColor: node.color,
      }}
    >
      <div className="port left">
        <PortWidget engine={engine} port={node.getPort('left')!} />
      </div>

      <div className="port right">
        <PortWidget engine={engine} port={node.getPort('right')!} />
      </div>

      <div className="port top">
        <PortWidget engine={engine} port={node.getPort('top')!} />
      </div>

      <div className="port bottom">
        <PortWidget engine={engine} port={node.getPort('bottom')!} />
      </div>

      <div className="node-header">{node.name}</div>

      <div className="node-body">
        <div className="node-item">Название курса</div>
        <div className="node-item">Описание</div>
      </div>
    </div>
  )
}
