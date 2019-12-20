import React from "react";
import { render } from "react-dom";
import { observable, action, autorun, computed } from "mobx";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

class AppState {
  @observable timer = 0;
  @observable selectedValue = 10;
  balance = 1000;
  chipNominals = [
    { rate: 10 },
    { rate: 50 },
    { rate: 100 },
    { rate: 200 },
    { rate: 500 },
    { rate: 1000 },
    { rate: 2000 },
    { rate: 5000 },
    { rate: 10000 }
  ];
  @observable chipCollectionLimit = {
    min: 100,
    max: 2000
  };
  @observable prefferedChipsLimit = {
    min: 1000,
    max: 10000
  };

  createChipsCollection(
    chipNominals,
    chipCollectionLimit,
    prefferedChipsLimit,
    balance
  ) {
    return chipNominals
      .filter(item => {
        return (
          item.rate >= chipCollectionLimit.min &&
          item.rate <= chipCollectionLimit.max
        );
      })
      .map(item => {
        return {
          rate: item.rate,
          available: item.rate <= balance
        };
      });
  }

  @computed
  get chipsCollection() {
    return this.createChipsCollection(
      this.chipNominals,
      this.chipCollectionLimit,
      this.prefferedChipsLimit,
      this.balance
    );
  }

  constructor() {
    setInterval(this.updateTimer, 1000);
    autorun(() => {
      console.log("AUTORUN", this.chipCollectionLimit);
    });
  }

  @action
  setLimit(limit) {
    this.chipCollectionLimit = limit;
  }
  @action
  updateTimer = () => {
    this.timer += 1;
  };

  @action
  selectChip = value => {
    this.selectedValue = value;
  };

  @action.bound
  reset() {
    this.timer = 0;
  }
}

const TimerView = observer(({ appState }) => (
  <div>
    <button onClick={appState.reset}>Seconds passed: {appState.timer}</button>
    <div>
      <button
        onClick={() => appState.setLimit({ min: 100, max: 2000 })}
      >{`SET LIMIT ${appState.chipCollectionLimit.min} - ${
        appState.chipCollectionLimit.max
      }`}</button>
      <button
        onClick={() => appState.setLimit({ min: 1000, max: 10000 })}
      >{`SET LIMIT ${appState.prefferedChipsLimit.min} - ${
        appState.prefferedChipsLimit.max
      }`}</button>
    </div>
    <div>
      {appState.chipsCollection.map(item => {
        return (
          <div key={item.rate}>
            <button
              value={item.rate}
              disabled={!item.available}
              onClick={event => {
                appState.selectChip(item.rate);
              }}
            >
              {appState.selectedValue === item.rate ? "*" : null}
              {item.rate}
            </button>
          </div>
        );
      })}
    </div>
  </div>
));

render(
  <div>
    <TimerView appState={new AppState()} />
    <DevTools />
  </div>,
  document.getElementById("root")
);
