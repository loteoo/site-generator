import { h, text } from 'hyperapp'
import htmlToVdom from '../utils/htmlToVdom';
import { ViewContext } from '../types';
import Link from './Link';

/**
 * Router component to import in user code.
 *
 * Renders the correct view depending on the location state
 *
 */
const Router = () => ({ state, meta, options }: ViewContext) => {
  const { route, path } = state.location

  // 404 Page
  if (!route) {
    // Display custom 404 page if specified
    if (options.notFound && typeof options.notFound === 'function') {
      return (
        h('div', { id: 'router-outlet' }, [
          options.notFound(state)
        ])
      )
    }

    // Default 404
    return (
      h('div', { id: 'router-outlet' }, [
        h('div', { style: { padding: '1rem', textAlign: 'center' } }, [
          h('h1', {}, text('404.')),
          h('p', {}, text('Page not found.')),
          Link({ href: '/' }, 'Home page') as any
        ])
      ])
    )
  }

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
    return h('div', { id: 'router-outlet' }, node);
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
      h('div', { style: { padding: '1rem', textAlign: 'center' } }, [
        h('h2', {}, text('Loading...'))
      ])
    ])
  )
}

export default Router
