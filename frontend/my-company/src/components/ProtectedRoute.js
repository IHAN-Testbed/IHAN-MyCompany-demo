/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Redirect, Route } from 'react-router-dom'

export default ({ path, route, userData, exact = true }) => {
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => {
        if (typeof userData === 'object' && userData.hasOwnProperty('id')) {
          return route
        } else {
          return <Redirect to={`/login${props.location.search}`} />
        }
      }}
    />
  )
}
