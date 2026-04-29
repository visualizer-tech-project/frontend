import { DefaultLinkFactory, type DefaultLinkModel } from '@projectstorm/react-diagrams'

export class ActiveLinkFactory<Link extends DefaultLinkModel = DefaultLinkModel> extends DefaultLinkFactory<Link> {
  constructor(type = 'default') {
    super(type)
  }

  override generateLinkSegment(model: Link, _selected: boolean, path: string) {
    return super.generateLinkSegment(model, true, path)
  }
}
