interface NavigateArgs {
  to: string;
}

/**
 * Trigger a page navigation
 */
const navigateRunner = (dispatch, { to }: NavigateArgs) => {
  // Internal links
  if (to.startsWith('/')) {
    history.pushState(null, '', to)
    dispatchEvent(new CustomEvent("pushstate"))
  } else {

    // Handle external links
    window.location.href = to
  }
}

const navigate = (args: NavigateArgs) => [navigateRunner, args]

export default navigate
