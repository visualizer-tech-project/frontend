import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { type DiagramEngine } from '@projectstorm/react-diagrams'
import type { JSX } from 'react'
import { CustomNodeModel } from './CustomNodeModel'
import { CustomNodeWidget } from './CustomNodeWidget'

export class CustomNodeFactory extends AbstractReactFactory<CustomNodeModel, DiagramEngine> {
  constructor() {
    super('custom-node')
  }

  generateModel() {
    return new CustomNodeModel()
  }

  generateReactWidget(event: { model: CustomNodeModel }): JSX.Element {
    return <CustomNodeWidget engine={this.engine} node={event.model} />
  }
}
