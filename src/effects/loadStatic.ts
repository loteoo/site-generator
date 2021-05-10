import SetPathStatus from '../actions/SetPathStatus';
import { State } from '../types';
import fx from '../utils/fx'

/**
 * Effect runner for the loadStatic effect
 *
 * The loadStatic effect, at build time, will cache the data returned from the `loader` promise
 * and save it as a JSON file in the build files.
 *
 * At runtime, it will fetch the pre-saved JSON instead of running the promise
 */
const loadStaticRunner = async (dispatch, { path, loader, action, error }) => {
  try {

    // @ts-ignore
    const cachedUrl = window?.HYPERSTATIC_DATA?.cache[path]

    const promise = cachedUrl
      ? fetch(cachedUrl).then(res => res.json())
      : loader()

    const data = await promise;

    // @ts-expect-error
    if (window.cacheData) {
      // @ts-expect-error
      window.cacheData(path, data)
    }

    dispatch((state: State) => action(SetPathStatus(state, { path, status: 'ready' }), data))
  } catch (err) {
    dispatch(error, err)
    throw err
  }
}

loadStaticRunner.fxName = 'loadStatic';

const loadStatic = fx(loadStaticRunner)

export default loadStatic
