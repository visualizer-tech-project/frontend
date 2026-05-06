import type { DiagramEngine } from '@projectstorm/react-diagrams'
import { PortWidget } from '@projectstorm/react-diagrams'
import { CustomNodeModel } from './CustomNodeModel'
import styles from './CustomNodeWidget.module.css'

interface Props {
  node: CustomNodeModel
  engine: DiagramEngine
}

export const CustomNodeWidget = ({ node, engine }: Props) => {
  return (
    <div
      className={styles.node}
      style={{
        borderColor: node.color,
      }}
    >
      <div className={`${styles.port} ${styles.portLeft}`}>
        <PortWidget engine={engine} port={node.getPort('left')!} />
      </div>

      <div className={`${styles.port} ${styles.portRight}`}>
        <PortWidget engine={engine} port={node.getPort('right')!} />
      </div>

      <div className={`${styles.port} ${styles.portTop}`}>
        <PortWidget engine={engine} port={node.getPort('top')!} />
      </div>

      <div className={`${styles.port} ${styles.portBottom}`}>
        <PortWidget engine={engine} port={node.getPort('bottom')!} />
      </div>

      <div className={styles.nodeHeader}>{node.name}</div>

      <div className={styles.nodeBody}>
        <div className={styles.nodeItem}>Название курса</div>
        <div className={styles.nodeItem}>Описание</div>
      </div>
    </div>
  )
}
