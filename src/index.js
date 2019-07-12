import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button style={props.styles} className="square" onClick={props.onClick}> {props.value} </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return  <Square style={this.props.winner} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  renderLine(i) {
    return (
      <div className="board-row">
        <Square styles={this.props.styles[i]}   value={this.props.squares[i]}   onClick={() => this.props.onClick(i)}   />
        <Square styles={this.props.styles[i+1]} value={this.props.squares[i+1]} onClick={() => this.props.onClick(i+1)} />
        <Square styles={this.props.styles[i+2]} value={this.props.squares[i+2]} onClick={() => this.props.onClick(i+2)} />
      </div>
    );
  }

  renderBoard() {
    return (
      <div>
        { this.renderLine(0) } { this.renderLine(3) } { this.renderLine(6) }
      </div>
    );
  }


  render() {
    return (
      <div> { this.renderBoard() } </div>
    );

    /*
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    ); */
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        styles: Array(9).fill({"backgroundColor":"white"})
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const styles  = current.styles.slice();
    if(calculateWinner(squares,styles) || squares[i]) {
      return;   // Ja temos um ganhador, entao nada a fazer..
    }
    if(calculateDraw(squares)){
      return;   // Deu empate, entao nada a fazer
    }
    //
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        styles: styles
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner  = calculateWinner(current.squares,current.styles);
    const isDraw  = calculateDraw(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move} >
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner) {
      status = "Winner " + winner;
    } else {
      if(!isDraw) {
        status = "Next player: " + (this.state.xIsNext ? 'X' : 'O' );
      } else {
        status = "It's a tie!!"
      } 
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board styles={current.styles} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div> { status } </div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares,styles) {
  // Haverá um ganhador quando tivermos algumas dessas combinações
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log("A: "+a+"- B: "+b+" - C: "+c);
      styles[a] = {"backgroundColor":"yellow"};
      styles[b] = {"backgroundColor":"yellow"};
      styles[c] = {"backgroundColor":"yellow"};
      return squares[a];
    }
  }
  return null;
}

function calculateDraw(squares) {
  // Haverá um empate quando não houver mais cuadrados livres
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      return false;
    }
  }
  return true;
}