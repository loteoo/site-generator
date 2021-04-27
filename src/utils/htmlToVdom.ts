import { h, text } from 'hyperapp'

/**
 * Html to hyperapp VDOM converter
 * Someone should make this a package...
 */

const mapProps = attrs => (
  [...attrs].reduce(
    (props, attr) => (
      attr.nodeName === 'style'
        ? props // ignore string style definitions for now.
        : { ...props, [attr.nodeName]: attr.nodeValue }
    ),
    {}
  )
)

const mapChildren = (childNodes) => {
  if (!!childNodes && childNodes.length > 0) {
    return [...childNodes].map(node => mapVNode(node))
  } else {
    return []
  }
}

const mapVNode = (node) => {
  switch (node.nodeType) {
    case Node.TEXT_NODE:
      return text(node.nodeValue)
    case Node.ELEMENT_NODE:
      return h(node.tagName, mapProps(node.attributes), mapChildren(node.childNodes))
    default:
      throw new Error(`${node.nodeType} is not supported`)
  }
}

const htmlToVdom = (html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const node = mapVNode(doc.body)
  return node.children
}

export default htmlToVdom
