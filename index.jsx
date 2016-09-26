var App = React.createClass({

    getInitialState: function() {
        return {
            searchResults: []
        }
    },

    showResults: function(response,category){
        this.setState({
            searchResults: response.results,
            category: category
        })
    },

    search: function(URL, category){
        $.ajax({
            type: "GET",
            dataType: 'jsonp',
            url: URL,
            success: function(response){
                this.showResults(response, category);
            }.bind(this)
        });
    },

    render: function(){
        return (
            <div>
                <SearchBox search={this.search} />
                <Results searchResults={this.state.searchResults} category={this.state.category} />
            </div>
        );
    },


});

var SearchBox = React.createClass({

    render: function(){
        return (
            <div id="searchbox">
                <input type="text" ref="query" />
                <select ref="category">
                    <option value="software">Apps</option>
                    <option value="movie">Films</option>
                    <option value="musicTrack">Music</option>
                    <option value="podcast">Podcast</option>
                </select>
                <input type="submit" onClick={this.createAjax} value="Search"/>
            </div>
        );
    },

    createAjax: function(){
        var query    = ReactDOM.findDOMNode(this.refs.query).value;
        var category = ReactDOM.findDOMNode(this.refs.category).value;
        var URL      = 'https://itunes.apple.com/search?term=' + query +'&country=us&entity=' + category;
        this.props.search(URL, category)
    }

});

var Results = React.createClass({

    render: function(){
        var category = this.props.category;
        var resultRows = this.props.searchResults.map(function(result) {
            return (
                        <TableRow
                            category={category}
                            key={result.trackId}
                            artist={result.artistName}
                            track={result.trackName}
                            rating={result.averageUserRating}
                            genre={result.primaryGenreName}
                        />
            )
        });

        if($.trim(resultRows)){
            return(
                <div>
                    <table>
                        <thead>
                            <HeaderRow category={category} />
                        </thead>
                        <tbody>
                            {resultRows}
                        </tbody>
                    </table>
                </div>
            )
        }else{
            return <div>&nbsp;</div>;
        }

    }
});

var HeaderRow = React.createClass({
    render: function(){

        switch(this.props.category){
            case "software":
                return (<tr>
                    <th>Publisher</th><th>App Name</th><th>Average Rating</th></tr>);
            case "movie":
                return (<tr><th>Movie</th><th>Producer</th><th>Genre</th></tr>);
            case "musicTrack":
                return (<tr><th>Artist</th><th>Track/Album</th><th>Genre</th></tr>);
            case "podcast":
            default:
                return (<tr><th>Podcasters</th><th>Title</th><th>Genre</th></tr>);
        }
    }
});


var TableRow = React.createClass({

    render: function(){

        switch(this.props.category) {
            case "software":
                return (<tr>
                    <td>{this.props.artist}</td>
                    <td>{this.props.track}</td>
                    <td>{this.props.rating}</td>
                </tr>);
            case "movie":
                return (<tr>
                    <td>{this.props.track}</td>
                    <td>{this.props.artist}</td>
                    <td>{this.props.genre}</td>
                </tr>);
            case "musicTrack":
            case "podcast":
            default:
                return (<tr>
                    <td>{this.props.artist}</td>
                    <td>{this.props.track}</td>
                    <td>{this.props.genre}</td>
                </tr>);
        }
    }
});

ReactDOM.render(<App />,  document.getElementById("content"));