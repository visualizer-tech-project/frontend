import { DefaultPortModel, NodeModel, PortModelAlignment } from '@projectstorm/react-diagrams'

interface Options {
  name?: string
  color?: string
}

export class CustomNodeModel extends NodeModel {
  name: string
  color: string

  constructor(options: Options = {}) {
    super({
      type: 'custom-node',
    })

    this.name = options.name || 'Узел'
    this.color = options.color || '#4a90e2'

    this.addPort(
      new DefaultPortModel({
        name: 'left',
        alignment: PortModelAlignment.LEFT,
      }),
    )
    this.addPort(
      new DefaultPortModel({
        name: 'right',
        alignment: PortModelAlignment.RIGHT,
      }),
    )
    this.addPort(
      new DefaultPortModel({
        name: 'top',
        alignment: PortModelAlignment.TOP,
      }),
    )
    this.addPort(
      new DefaultPortModel({
        name: 'bottom',
        alignment: PortModelAlignment.BOTTOM,
      }),
    )
  }

  getPort(name: string) {
    return super.getPort(name) as DefaultPortModel | null
  }
}
