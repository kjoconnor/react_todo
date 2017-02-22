var Application = React.createClass ({
    

    getInitialState: function() {

        var todos = document.getElementById("content").getAttribute("value");

        if (!todos){

            todo_array = [];

        }else{

            var todo_array = [];

            for (var i=0; i < todos.length; i++){
                todo_array.push(todos[i]);
            }

        };

        console.log("todo", typeof todos, todos);

        return {
            data: todo_array,
            content: ""
        };

    },


    handleSubmit: function(content) {
        console.log("content from new todo: ", content);

        var previous_todo = this.state.data;

        previous_todo.push(content);

        console.log(previous_todo);

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

        var createTodos = this.props.todos.map(function(todo) {
            return <div className="todo" key={todo.id}> {todo.content} </div>;
        });
        console.log(createTodos);
        return (
            <div className="list">
                <ul>{createTodos}</ul>
            </div>
        );
    }
});





ReactDOM.render(<Application />, document.getElementById("content"));