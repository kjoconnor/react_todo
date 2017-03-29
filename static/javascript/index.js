var googleAPIKey;
var googleClientId;
var state;


function returnAPIKey(response) {
    googleAPIKey = response.googleAPIKey;
    googleClientId = response.googleClientId;
    state = response.state;
   

    var googleParams = jQuery.param({
            client_id : googleClientId, 
            response_type: 'code',
            scope: 'openid profile email',
            redirect_uri: 'http://localhost:5000/signIn',
            state : state  
        });

        var url = 'https://accounts.google.com/o/oauth2/v2/auth?'+googleParams; 

        console.log({url});

        window.location.href=url;
    
}



var Application = React.createClass ({
    getInitialState: function() {

        return {
            data: [],
            content: "",
            isSignedIn: false
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
    
    componentDidMount: function() {

        this.loadServerDBTodos();
  
    },

    
    intializeGoogleAuth: function(){
        
        console.log("intializeGoogleAuth is running")

        $.ajax({
            url: '/API',
            type: 'GET',
            success: returnAPIKey
        });


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

                <LoginButton onSignIn={this.intializeGoogleAuth} />
                <LogoutButton onSignOut={this.handleSignOut} />
                <NewTodoForm content={this.state.content} onNewTodoSubmit={this.handleSubmit} />
                <List todos={this.state.data} onDelete={this.handleDelete} onCheck={this.handleCheckboxToggle} />

            </div>
        );
    }
});


var LoginButton = React.createClass({

    handleClick: function(event){
        event.preventDefault();
        console.log("props", this.props);
        this.props.onSignIn();
        console.log("clicked the Login Button");
    },

    render: function() {
    
    return (
       <button type="submit" className="g-signin2" onClick={this.handleClick.bind(this)} >Sign In With Google</button>
    );
  }

});

var LogoutButton = React.createClass({
    handleSignOut: function() {
        console.log("user signed out"); // plus any other logic here
        this.props.onSignOut();

  },

  render: function() {

    return (
       <div onSignOut={this.handleSignOut}>Sign Out</div>
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

        var checkValue = this.props.todo.isChecked;
        if (checkValue === "true") {
            var checkValue = true;
        } else {
            var checkValue = false;
        }

        return(
            <input type="checkbox" checked = {checkValue} onChange={this.props.onCheck} />
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
                
                <Checkbox  onCheck={this.handleCheckboxToggle.bind(this, this.props.todo)} todo={this.props.todo} />

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

