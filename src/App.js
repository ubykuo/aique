import React from 'react'
import { Link } from 'react-router';

class App extends React.Component {
	render() {
		return (
			<div>
				<h3><Link to="/">Aique Interactivo</Link></h3>

				<ul>
					<li>
						<p>1er Grado</p>
						<ul>
							<Link to="/name-that-object">Name that object</Link>
						</ul>
					</li>
					<li>
						<p>2er Grado</p>
						<ul>
							
						</ul>
					</li>
					<li>
						<p>3er Grado</p>
						<ul>
							
						</ul>
					</li>
				</ul>

				{ this.props.children }
			</div>
		);
	}
}

export default App;