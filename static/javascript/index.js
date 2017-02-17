class NewTodoForm extends React.Component {

    NewTodoForm.propTypes = {
        value: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
    }

   

    handleSubmit(event) {
        event.preventDefault();

        let newTodo = this.state.value;

        if (!newTodo){
            return;
        } 

        this.props.onNewTodoSubmit({ value: value });
        this.setState({
            value: ''
        });
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>

                <label> The List Grows:
                    <input type="text" value={this.state.value} onChange={this.setValue.bind(this, 'value')handleChange} />
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
                <input type="checkbox" name="TodoItem" value={this.props.key}/> 
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
                    content={todo.content}
                    created_at={todo.created_at}
                    key={todo.id}
                >
                </Todo>
            );
        );

        return(
            <div className="list">
                {todoNodes}
            </div>
        );
    
    }
}

class Application extends React.Component {
    // returns a div with NewTodoForm and List in it

    constructor(props) {
        super(props);
        this.state = {
            data: []};

        this.handleRemoveTodo = this.handleRemoveTodo.bind(this);
        this.checkMarked = this.checkMarked.bind(this);
    }

    handleRemoveTodo(id) {
        //onclick run this and send id to the server to be removed and remove it from view
        var data = this.state.data;
        data = data.
    }

    checkMarked(event) {
        // do i need to make the box checked? 
        
    }

       
    handleTodoSubmit(todo) {


        $.ajax({
            url: '/todo'
            dataType: 'json',
            type: 'POST',
            data: todo,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
        });
    
    },

    render(){
        return(
            <div className="application">
                <NewTodoForm onNewTodoSubmit={this.handleTodoSubmit} />
                <List data={this.state.data} />

        );

    }
    }


}

ReactDom.render(<Application />, document.getElementById('content'));