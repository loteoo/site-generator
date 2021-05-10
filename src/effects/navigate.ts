import fx from '../utils/fx'

/**
 * Trigger a page navigation
 */
const navigate = fx((_dispatch, to: string) => {

  // Internal links
  if (to.startsWith('/')) {
    history.pushState(null, '', to)
    dispatchEvent(new CustomEvent("pushstate"))
  } else {

    // Handle external links
    window.location.href = to
  }
})

export default navigate
