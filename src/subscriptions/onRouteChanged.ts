import { Action } from 'hyperapp'

interface OnRouteChangedArgs {
  action: Action<any>;
}

/**
 * Every time the browser's location changes,
 * trigger the given action with the new location as params
 */
const onRouteChangedRunner = (dispatch, { action }: OnRouteChangedArgs) => {
  const handleLocationChange = () => {
    dispatch(action, window.location.pathname + window.location.search)
  }
  addEventListener('pushstate', handleLocationChange)
  addEventListener('popstate', handleLocationChange)
  return () => {
    removeEventListener('pushstate', handleLocationChange)
    removeEventListener('popstate', handleLocationChange)
  }
}

const onRouteChanged = (args: OnRouteChangedArgs) => [onRouteChangedRunner, args]

export default onRouteChanged
