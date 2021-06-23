import React from 'react';
import './Game.css';

class Square extends React.Component {
	render() {
		let className = "square";
		if (this.props.isHighlight) {
			className  ="square highlight"
		}

		return <button
			className={className}
			onClick={() => this.props.onClick()}
		>	
			{this.props.value}
		</button>;
	}
}

class Board extends React.Component {
	renderSquare(i) {
		const items = [];
		items.push (<Square
			key={i}
			isHighlight={!this.props.winnerIndex?false:this.props.winnerIndex.indexOf(i)>=0}
			value={this.props.squares[i]}
			onClick={() => this.props.onClick(i)}
		/>)

		return items;
	}

	render() {
		const items = []
		let index = 0;
		for (let row = 0; row < 3; row++) {
			const columns = [];
			for (let col = 0; col < 3; col++) {
				columns.push(this.renderSquare(index));
				index++;
			}
			items.push(<div key={index} className="board-row">{columns}</div>);
		}

		return (
			<div>
				{items}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				index:0,
			}],
			stepNumber: 0,
			xIsNext: true
		}
	}

	calculateWinner(squares) {
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
				return {win:squares[a], index:lines[i]};
			}
		}
		return null;
	}

	onClickHandler(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const winner = this.calculateWinner(squares);
		if (winner || squares[i]) {
			return;
		} else {
			squares[i] = this.state.xIsNext ? "X" : "O";
			this.setState({
				history: history.concat([{ squares: squares, index:i }]),
				stepNumber: history.length,
				xIsNext: !this.state.xIsNext
			});
		}
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
		const winner = this.calculateWinner(current.squares);
		let status;
		if (winner) {
			status = 'Winner :' + winner.win;
		} else {
			if (this.state.stepNumber == 9) {
				status = "Draw";
			} else {
				status = "Next player: " + (this.state.xIsNext ? "X" : "O");
			}
		}

		const moves = history.map((step, move) => {
			let coordinate = getCoordinate(step.index);
			let desc;
			if (move) {
				desc = 'Go to move #' + move;
			} else {
				desc = 'Go to game start';
				coordinate = "";
			}
			let bold = "";

			if (this.state.stepNumber === move) {
				bold = "bold";
			}

			return (
				<li key={move} >
		 			<button style={{fontWeight:bold}} onClick={() => this.jumpTo(move)}>{desc}</button> {coordinate}
		 		</li>
			);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board
						winnerIndex={!winner?null:winner.index}
						squares={current.squares}
						onClick={(i) => this.onClickHandler(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

export default Game;

function getCoordinate (index) {
	const coordinates = [
		"(1,1)", "(1,2)", "(1,3)",
		"(2,1)", "(2,2)", "(2,3)",
		"(3,1)", "(3,2)", "(3,3)"
	]
	return coordinates[index];
}