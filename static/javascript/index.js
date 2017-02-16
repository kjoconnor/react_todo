class NewTodoForm extends React.Component {

    NewTodoForm.propTypes = {
        value: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let newTodo = this.state.value;
        if (!newTodo){
            return;
        } else {

            //Clear the input area
            this.setState({value: ""});

        }

        //TODO: 
        //Send this to Server to save in DB
        // Update Todo list with new Todo

    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>

                <label> The List Grows:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>

                <input type ="submit" value="Add" />  

            </form>
        );
    }

}

function Todo(props) {
    //What a basic Todo from the Database will look like
    return(
        <div className="todo">
            
                //TODO: value must be the id of the Todo
                <input type="checkbox" name="TodoItem" value={this.props.id}/> 
                <div>
                    <span> {this.props.created_at} </span>
                    <span> {this.props.content} </span>
                     // TODO: The object in the brackets must be the content of the todo from props or state unclear
                </div>
                <button> Remove </button>     
        </div>
    );
}

class List extends React.Component {
    // Renders on a timer all todo list from server
    //TODO find out where todo in funciton argument comes from
    render(){
        var  todoNodes = this.props.datat.map(function(todo)
            return(
                <Todo
                    content={todo.id}
                    created_at={todo.created_at}
                    key={todo.id}
                    );
        );
    
    }
}

class Application extends React.Component {
    // returns a div with NewTodoForm and List in it
}

ReactDom.render(<Application />, document.getElementById('content'));