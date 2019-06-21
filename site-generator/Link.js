import { h } from 'hyperapp'

import {Navigate, TriggerRouteLoad} from './actions'

// Link component
export const Link = ({to, state, scrollToTop, ...props}, children) => {

  const routes = Object.keys(state.routes).map(route => state.routes[route])
  const matchedRoute = routes.find(route => route.pattern.match(to))
  const loaded = matchedRoute && matchedRoute.view
  const active = to === state.location.path

  const attributes = {
    href: to,
    onmousedown: [Navigate, ev => {
      if (ev.button === 0) {

        // TODO: move this somewhere else (on location changed, not on click. dont forget about navigator prev/next buttons)
        if (matchedRoute && !loaded && !active && scrollToTop) {
          window.scrollTo(0, 0)
        }
        return to
      }
      return
    }],
    onclick: [
      state => state,
      ev => {
        ev.preventDefault()
      }
    ],
    ...(matchedRoute && !loaded && {onmouseover: [TriggerRouteLoad, to]}),
    ...props
  }

  return h('a', attributes, children)
}
