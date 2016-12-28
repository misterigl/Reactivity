
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Reactivity</h1>
      </div>
      );
  }

};


ReactDOM.render(
  <App />,
  document.getElementById('app')
);
