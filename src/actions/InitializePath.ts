import SetPathStatus from './SetPathStatus';
import { LocationState, State } from '../types';

interface InitializePathArgs {
  location: LocationState
  bundle: any;
}

/**
 * Run the "init" action if necessary once per page
 */
const InitializePath = (state: State, { location, bundle }: InitializePathArgs) => {
  const { path } = location;

  // If current path is already initiated, do nothing
  if (state.paths[path] === 'ready') {
    return state;
  }

  // If current path doesn't have an "Init" to run
  if (typeof bundle?.Init !== 'function' && typeof bundle?.init !== 'function') {

    // Set as ready
    return SetPathStatus(state, { path, status: 'ready' })
  }

  const PageInitAction = bundle?.Init ?? bundle?.init

  // Compute next state or action tuple using the provided "Init" action
  const action = PageInitAction(
    state,
    location
  )

  // If Init has side-effects
  if (Array.isArray(action)) {

    // Get only the "loadStatic" effect tuples
    const loadEffects = action.slice(1).filter((fx => fx[0].fxName === 'loadStatic'))

    // If this page has data requirements
    if (loadEffects.length > 0) {

      // Set path as fetching
      action[0] = SetPathStatus(action[0], { path, status: 'fetching' })

      // Set the path for the effect
      loadEffects.forEach(fx => fx[1].path = path)
    }

    return action
  }

  return SetPathStatus(action, { path, status: 'ready' })
}

export default InitializePath
