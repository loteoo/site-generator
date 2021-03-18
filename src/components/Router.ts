import { h, text } from 'hyperapp'
import htmlToVdom from '../htmlToVdom';
import { ViewContext } from '../types';

/**
 * Router component to import in user code.
 *
 * Renders the correct view depending on the location state
 *
 */
const Router = () => ({ state, meta, options }: ViewContext) => {
  const { route, path } = state.location
  const view = meta[route]?.bundle?.default;

  if (view) {
    if (state.paths[path] === 'ready') {

      // @ts-expect-error
      if (window.pathRendered) {

        // Wait after render
        setTimeout(() => {
          requestAnimationFrame(() => {
            // @ts-expect-error
            window.pathRendered(path)
          })
        });
      }

      return (
        h('div', { id: 'router-outlet' }, [
          view(state)
        ])
      )
    }
  }

  // Check if a prerendered piece of HTML can be reused while JS / JSON loads
  const previousOutlet = document.getElementById('router-outlet')
  if (previousOutlet) {
    const node = htmlToVdom(previousOutlet.innerHTML)
    node.tag = 'div'
    node.props = { id: 'router-outlet' }
    return node
  }

  // Display custom loader if specified
  if (options.loader && typeof options.loader === 'function') {
    return (
      h('div', { id: 'router-outlet' }, [
        options.loader(state)
      ])
    )
  }


  // Default loader
  return (
    h('div', { id: 'router-outlet' }, [
      h('div', { style: { padding: '1rem' } }, [
        h('h2', { style: { textAlign: 'center' } }, text('Loading...'))
      ])
    ])
  )
}

export default Router
