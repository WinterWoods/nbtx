import React from 'react'
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router'
import App from 'App'
import NoMatch from 'NoMatch'
import MessageView from 'message/messageView'
import OrgManager from 'orgManager/orgManager'

  //<IndexRoute component={SamplePage}/>
  //<Route path="pageA" component={PageA}/>

var routes = (<Router history = {hashHistory}>
    <Route path="/" component = {App}>
      <IndexRoute component={MessageView}/>
      <Route path="/orgManager" component={OrgManager}/>
      <Route path="/messageView" component={MessageView}/>
    </Route><Route path="*"component={NoMatch}/>
  </Router>);
export default routes
