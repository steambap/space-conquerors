import { css, StyleSheet } from 'aphrodite'
import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AdminGameView from './adminView/adminGameView'
import AuthCallback from './authCallback'
import AuthProvider from './authProvider'
import CheckLogin from './checkLogin'
import DialogController from './dialogController'
import GameView from './gameView'
import MainView from './mainView'
import style from './style'
import TestCombatView from './testCombatView/index'

const styles = StyleSheet.create({
  root: {
    position: 'fixed',
    left: 0, top: 0, right: 0, bottom: 0,
    overflow: 'auto',
    background: style.background,
    color: style.textColor,
  },
})

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DialogController>
          <div className={css(styles.root)}>
            <Switch>
              <Route exact path="/auth/callback" component={AuthCallback} />
              <CheckLogin>
                <Switch>
                  <Route exact path="/" component={MainView} />
                  <Route path="/admin/:gameId" component={AdminGameView} />
                  <Route path="/test-combat" component={TestCombatView} />
                  <Route path="/:gameId" component={GameView} />
                </Switch>
              </CheckLogin>
            </Switch>
          </div>
        </DialogController>
      </AuthProvider>
    </BrowserRouter>
  )
}
