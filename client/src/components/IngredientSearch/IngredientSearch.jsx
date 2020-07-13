import React from 'react';
import './IngredientSearch.scss';

class IngredientSearch extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue : '',
            searchResults: []
        }
    }
    handleChange = event => {
        this.setState({inputValue: event.target.value});
    }
    handleSubmit = async event => {
        event.preventDefault();
        const searchResults = await fetch('/api/ingredients/',
        {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            //   'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({name: this.state.inputValue})
        })
        .then(res => res.json());

        this.setState({ 
            searchResults: searchResults,
            inputValue: ''
        });
    }
    render() {
        return (
        <section className="ingredients-search">
            <form method="POST" action="/api/ingredients" className="ingredients-search__form" onSubmit={this.handleSubmit}>
                <input name="name" placeholder="name" className="ingredients-search__input" value={this.state.inputValue} onChange={this.handleChange} />
                <button type="submit" className="ingredients-search__submit">Submit</button>
            </form>
            <table className="ingredients-search__results">
                <th>Name</th>
                <th>Carbs</th>
                <th>Protein</th>
                <th>Fat</th>

                {this.state.searchResults.map(result => (
                <tr>
                    <td>{result.name}</td>
                    <td>{result.carbs}</td>
                    <td>{result.protein}</td>
                    <td>{result.fat}</td>
                </tr>
                ))}
            </table>
        </section>
      );
    }
}

export default IngredientSearch;
