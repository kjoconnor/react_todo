var Application = React.createClass ({
    
    getInitialState: function() {

        return {
            data: [],
            content: ""
        };

    },

    loadServerDBTodos: function() {
        console.log("loadServerDBTodos is running");
        $.ajax({
            url: "/todo",
            dataType: 'json',
            cache: false,
            success: function(response) {
                this.setState({data: response});
                console.log(this.state.data);
            }.bind(this),
        });
    },

    componentDidMount: function(){
        console.log("componentDidMount is running");
        this.loadServerDBTodos();

    },
    
    handleSubmit: function(content) {
        console.log("content from new todo: ", content);

        $.ajax({
            url: "/todo",
            dataType: 'json',
            type: 'POST',
            data: { content: content },
            success: function(response) {
                console.log("response from handleSumbit", typeof response, response);
                var allTodos= this.state.data.concat([response]);
                this.setState({data: allTodos});
                console.log(data);
            }.bind(this)
        });

        this.setState({data: previous_todo});
    
    },


    render: function() {
        console.log("in Application render");
        console.log("data", this.state.data)
        return (
            <div className="application">
                <NewTodoForm content={this.state.content} onNewTodoSubmit={this.handleSubmit} />
                <List todos={this.state.data} />
            </div>

        );

    }

});

var NewTodoForm = React.createClass ({

    handleSubmit: function(event) {
        event.preventDefault();

        var content = ReactDOM.findDOMNode(this.refs.content).value;

        if (!content){
            return;
        } 

        this.props.onNewTodoSubmit(content);

        ReactDOM.findDOMNode(this.refs.content).value = "";

    },

    render: function() {
        return (

            <form className= "todoForm" onSubmit={this.handleSubmit}>

                <label> The List Grows:
                    <input type="text" ref="content" />
                </label>

                <input type ="submit" value="Add" />  

            </form>
        );
    }

});


var Todo = React.createClass ({
    
    render: function() {

        console.log(this.props.todos);

        return (
            <li className="todo">

                {this.props.children}
        
            </li>
        );
    }
});

var List = React.createClass ({
    
    render: function() {

        return(
            <ul className='list'> {
                this.props.todos.map(todo => {
                    return <li className='listItem' todo = {todo} key= {todo.id}>
                        {todo.created_at}
                        {todo.content}
                     </li>
                })
            }
            </ul>
        );
    }
});





ReactDOM.render(<Application />, document.getElementById("content"));