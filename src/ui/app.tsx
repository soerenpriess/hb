import { css, StyleSheet } from 'aphrodite'
import * as React from 'react'
import MainStore, { IState } from './mainStore'
import MainView from './mainView'
import StageView from './stageView'
import style from './utils/style'

const styles = StyleSheet.create({
  main: {
    fontFamily: 'VT323, monospace',
    fontSize: 18,
    position: 'fixed',
    left: 0, top: 0, right: 0, bottom: 0,
    overflow: 'auto',
    background: style.darkGrey,
    color: style.textColor,
  },
  button: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    padding: '10px',
    background: style.darkGrey,
    color: style.textColor,
    border: 'none',
    cursor: 'pointer',
    zIndex: 1000,
  },
})

export default class App extends React.Component<{}, IState> {
  store: MainStore

  constructor(props) {
    super(props)
    this.store = new MainStore(this)
    this.state = this.store.loadProgress()
  }

  // This is just a very basic router based on the store state
  router() {
    if (this.state.currentGame) {
      return <StageView store={this.store} />
    }

    return <MainView store={this.store} />
  }

  sendMessage = async () => {
    try {
          alert('Der Prüfer wurde informiert und erscheint in Kürze')
          const response = await fetch(`http://localhost:3001/telegram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: 'Proband benötigt Hilfe in der Testkabine' }),
            });

            if (!response.ok) {
                throw new Error('Fehler beim Senden der Telegram nachricht an den Server');
            }
        } catch (error) {
            console.error('Fehler bei telegram:', error);
        }
  }

  render() {
    return (
      <div className={css(styles.main)}>
        <button className={css(styles.button)} onClick={this.sendMessage}>
          Prüfer holen
        </button>
        {this.router()}
      </div>
    )
  }
}
