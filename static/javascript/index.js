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
                let allTodos = this.state.data.concat([response]);
                console.log("allTodos", allTodos);
                this.setState({data: allTodos});
            }.bind(this)
        });
    
    },

    handleDelete: function(todo){
        console.log("in handleDelete in Application");
        console.log("todo", todo);
        var id = todo.id
        console.log("id", typeof id, id);
        $.ajax({
            url: "/todo/" + id,
            dataType: 'json',
            type: 'DELETE',
            data: { id : id },
            success: function(response) {
                console.log("response from handleDelete", typeof response, response);
                var allTodos = this.state.data;
                console.log("allTodos", allTodos);

                if (allTodos.indexOf(todo) > -1) {
                    allTodos.splice(allTodos.indexOf(todo), 1);
                }

                this.setState({data: allTodos});   
            }.bind(this)
        });

    },

    render: function() {
        console.log("in Application render");
        console.log("data", this.state.data)
        return (
            <div className="application">
                <NewTodoForm content={this.state.content} onNewTodoSubmit={this.handleSubmit} />
                <List todos={this.state.data} onDelete={this.handleDelete}/>
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

var Checkbox = React.createClass({

    render: function() {
        return(
            <input type="checkbox" todo={this.props.todo}  />
        );
    }
});

var Todo = React.createClass ({
    

    render: function() {

        return (
            
            <div className="todo" todo={this.props.todo} key= {this.props.todo.id}>
                {this.props.todo.created_at}
                {this.props.todo.content}
                <button key={this.props.todo.id} onClick={this.props.onDelete} > Remove </button>
            
            </div>
        );

    }

    
});



var List = React.createClass ({
    handleDelete: function(todo){
        console.log("in handleDelete in List");
        console.log("todo", todo);
        this.props.onDelete(todo);
    },

    render: function() {
        var todo = function(itemContent) {
            return (
                
                <Todo todo={itemContent} onDelete={this.handleDelete.bind(this, itemContent)}></Todo>
            );
        };

        return(
            <div className='list'> 
                { this.props.todos.map(todo, this) }
            </div>
        );
    }
});


ReactDOM.render(<Application />, document.getElementById("content"));