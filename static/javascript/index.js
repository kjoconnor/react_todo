var googleAPIKey;
var googleClientId;
var state;

function grabAPIKey (){
    $.ajax({
        url: '/API',
        type: 'GET',
        success: returnAPIKey
    });
}

function returnAPIKey(response) {
    googleAPIKey = response.googleAPIKey;
    googleClientId = response.googleClientId;

    intializeGoogleAuth()
}

function create_state() {
    state = Date.now();
}

function intializeGoogleAuth(){
        
    console.log("intializeGoogleAuth is running")
    state = create_state();

    var googleParams = {
        CLIENT_ID : googleAPIKey, 
        STATE : state, 
        SCOPE: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
        REDIRECT_URI: '/session' ,
        discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"]
    }; 

    $.ajax({
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        data: googleParams,
        type: 'POST',
        success: 'GoogleAuthIntiCallback'
    });
    

}

function GoogleAuthIntiCallback(response){
    console.log("response", response);
}
// function handleCallback(response) {

//     console.log("running handleCallback in App");

//     if(response['status']['signed_in']){ 
//         var request = gapi.client.plus.people.get(
//             {
//                 'userId': 'me'
//             });
//         request.execute(function (resp){
//             var email = '';
//             if(resp['emails']){
//                 for(i = 0; i < resp['emails'].length; i++){
//                     if(resp['emails'][i]['type'] == 'account'){
//                         email = resp['emails'][i]['value'];
//                     }
//                 }
//             }

//            console.log(email);

//         });
//     } 
// }

// function handleUpdateSigninStatus(isSignedInVal) {
//     if(isSignedInVal){
//         makeApiCall();
//     }
// }

// function signInVerification(response){
//     console.log("response", response.signedIn);
// }

var Application = React.createClass ({
    getInitialState: function() {

        return {
            data: [],
            content: "",
            isSignedIn: false
        };
    },
////////sigin in
     
    handleSignIn: function() {

        console.log("running handleSignIn in App");
        
        var myParams = {
            'clientid' : googleClientId, //You need to set client id
            'cookiepolicy' : 'single_host_origin',
            'callback' : handleCallback, //callback function
            'approvalprompt':'force',
            'scope' : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
            };
        gapi.auth2.getAuthInstance().singIn(myParams);

        var id_token = googleUser.getAuthResponse().id_token;
        $.ajax({
        url: '/session',
        data: {"id_token" : id_token},
        type: 'POST',
        success: signInVerification
    });


    },

    handleSignOut: function() {
        gapi.auth2.getAuthInstance().signOut();
        // location.reload();

    },

    addGoogleScriptTag: function (){

        console.log("addGoogleScriptTag");

        var scriptTag = document.createElement("script");

        scriptTag.src = "https://apis.google.com/js/api:client.js";
        scriptTag.async = "true";
        scriptTag.defer = "true";

        document.head.appendChild(scriptTag);

        scriptTag.onload= function (){
            console.log("about to run intializeGoogleAuth");
            gapi.load('client:auth2', grabAPIKey);
            
        }
    },


//////////////// end google //////
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

        this.addGoogleScriptTag();
        
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

                <LoginButton onSignIn={this.handleSignIn} onCallback={this.handleCallback} />
                <LogoutButton onSignOut={this.handleSignOut} />
                <NewTodoForm content={this.state.content} onNewTodoSubmit={this.handleSubmit} />
                <List todos={this.state.data} onDelete={this.handleDelete} onCheck={this.handleCheckboxToggle} />

            </div>
        );
    }
});


var LoginButton = React.createClass({

  handleSignIn: function() {
    console.log("handleSignIn LoginButton Componenet running"); // plus any other logic here

  },

  render: function() {
    
    return (
       <div className="g-signin2" onClick={this.handleSignIn} onCallback={this.handleCallback}>Sign In With Google</div>
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

