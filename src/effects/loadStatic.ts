import { Action } from 'hyperapp';
import SetPathStatus from '../actions/SetPathStatus';
import { State } from '../types';

interface LoadStaticArgs {
  loader: () => any | Promise<any>;
  action: Action<any>;
  error: Action<any>;
}

/**
 * Effect runner for the loadStatic effect
 *
 * The loadStatic effect, at build time, will cache the data returned from the `loader` promise
 * and save it as a JSON file in the build files.
 *
 * At runtime, it will fetch the pre-saved JSON instead of running the promise
 */
const loadStaticRunner = async (dispatch, { path, loader, action, error }: LoadStaticArgs & { path: string }) => {
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

const loadStatic = (args: LoadStaticArgs) => [loadStaticRunner, args]

export default loadStatic
