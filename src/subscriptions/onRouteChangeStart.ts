import { Action } from 'hyperapp'

interface OnRouteChangeStartArgs {
  action: Action<any>;
}

/**
 * Every time the browser's location changes,
 * trigger the given action with the new location as params
 */
const onRouteChangeStartRunner = (dispatch, { action }: OnRouteChangeStartArgs) => {
  const handleLocationChange = () => {
    dispatch(action)
  }
  addEventListener('navigationstart', handleLocationChange)
  return () => {
    removeEventListener('navigationstart', handleLocationChange)
  }
}

const onRouteChangeStart = (args: OnRouteChangeStartArgs) => [onRouteChangeStartRunner, args]

export default onRouteChangeStart
