
var Application = React.createClass ({
    
    getInitialState: function() {

        return {
            data: [],
            content: ""
        };
    },

    loadServerDBTodos: function() {
        
        $.ajax({
            url: "/todo",
            dataType: 'json',
            cache: false,
            success: function(response) {
                this.setState({data: response});
            }.bind(this),
        });
    },

    componentDidMount: function(){

        this.loadServerDBTodos();
    },
    
    handleSubmit: function(content) {

        $.ajax({
            url: "/todo",
            dataType: 'json',
            type: 'POST',
            data: { content: content },
            success: function(response) {
                let allTodos = this.state.data.concat([response]);
                this.setState({data: allTodos});
            }.bind(this)
        });
    },

    handleDelete: function(todo){

        var id = todo.id;
        
        $.ajax({
            url: "/todo/" + id,
            dataType: 'json',
            type: 'DELETE',
            data: { id : id },
            success: function(response) {
                var allTodos = this.state.data;

                if (allTodos.indexOf(todo) > -1) {
                    allTodos.splice(allTodos.indexOf(todo), 1);
                }

                this.setState({data: allTodos}); 

            }.bind(this)
        });
    },

    handleCheckBoxs:function() {
        console.log("This will have to run when loading page so boxs are checked!");
    }, 


    handleCheckboxToggle: function(todo) {

        var id = todo.id;
        var checkedTodoIndex = this.state.data.indexOf(todo);
        
        var isChecked = this.state.data[checkedTodoIndex].isChecked;
        console.log(checkedTodoIndex, this.state.data[checkedTodoIndex], isChecked);

        if (isChecked === "false") {
            var updatedCheckValue = "true";
        } else {
            var updatedCheckValue = "false";
        }

        console.log(updatedCheckValue, typeof updatedCheckValue);

        $.ajax({
            url: "todo/" + id,
            dataType: 'json',
            type: 'PUT',
            data: { 
                id : id,
                isChecked : updatedCheckValue },
            success: function(response) {
                 
                if (checkedTodoIndex !== -1) {
                    
                    this.state.data[checkedTodoIndex].isChecked = updatedCheckValue;
                    this.forceUpdate();
                
                }
            }.bind(this)
        });

    },

    render: function() {
        
        return (

            <div className="application">

                <NewTodoForm content={this.state.content} onNewTodoSubmit={this.handleSubmit} />

                <List todos={this.state.data} onDelete={this.handleDelete} onCheck={this.handleCheckboxToggle} />

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
            <input type="checkbox" onChange={this.props.onCheck} />
        );
    }
});


var Todo = React.createClass ({

    handleCheckboxToggle: function(todo) {

        this.props.onCheck(todo);

    },
    
    render: function() {

        return (
            
            <div className="todo" todo={this.props.todo} key= {this.props.todo.id}>
                
                < Checkbox  onCheck={this.handleCheckboxToggle.bind(this, this.props.todo)} />

                {this.props.todo.created_at}

                {this.props.todo.content}
               
                <button key={this.props.todo.id} onClick={this.props.onDelete} > Remove </button>
    
            </div>
        );
    }
    
});



var List = React.createClass ({

    handleDelete: function(todo){
    
        this.props.onDelete(todo);
    },

    handleCheckboxToggle: function(todo) {

        this.props.onCheck(todo);

    },
    

    render: function() {
        var todo = function(itemContent) {
            return (
                
                <Todo todo={itemContent} onDelete={this.handleDelete.bind(this, itemContent)} onCheck={this.handleCheckboxToggle.bind(this, itemContent)}></Todo>
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

