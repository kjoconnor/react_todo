var Application = React.createClass ({
    

    getInitialState: function() {
        return {
            data: [],
            content: ""
        };

    },


    handleSubmit: function(content) {
        console.log("content from new todo: ", content);

        var previous_todo = this.state.data;

        previous_todo.push(content);

        console.log(previous_todo);

        this.setState({data: previous_todo});

    
    },

    render: function() {
        console.log("in Application render");
        return (
            <div className="application">
                <NewTodoForm content={this.state.content} onNewTodoSubmit={this.handleSubmit} />
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

// /// TODO: Handle funciton and creation of the checkbox
// var Checkbox = React.createClass({
//     getInitialState: function() {
//         return {
//             isChecked: false,

//         };

//     }, 

//     toggleCheckboxChange: function() {
//         const { handleCheckboxChange, label } = this.props; 

//         this.setState(({ isChecked }) => ({

//             isChecked: !isChecked,
//         }));

//         handleCheckboxChange(label);
//     },

//     render: function() {
//         const { label } = this.props;
//         const { isChecked } = this.state;

//         return (
//             <div className="checkbox">
//                 <label>
//                     <input type="checkbox" value={ label } checked={isChecked} onChange={this.toggleCheckboxChange} >

//                     {label}
//                 </label>
//             </div>
//         );
//     }




// });
/// Some variation here check input feild for confirmaiton 
// var Todo = React.createClass ({
    
//     //What a basic Todo from the Database will look like
//     render: function() {
//         return (
//             <div className="todo">
            
//                 //TODO: value must be the id of the Todo Do I need these be in the form as well or can they just come from the response? 
//                 <input type="checkbox" name="TodoItem" value={this.props.key}/> 
//                 <div>
//                     <span> {this.props.created_at} </span>
//                     <span> {this.props.content} </span>
//                     {this.props.children.toString}
//                      // TODO: The object in the brackets must be the content of the todo from props or state unclear
//                 </div>
//                 <button> Remove </button>     
//             </div>
//         );
//     }
// });

// var List = React.createClass ({
//     // Renders on a timer all todo list from server
//     //TODO find out where todo in funciton argument comes from
//     render: function() {
//         var  todoNodes = this.props.data.map(function(todo) {
//             return (
//                 <Todo
//                     content={todo.content}
//                     created_at={todo.created_at}
//                     key={todo.id}
//                 >
//                 </Todo>
//             );
//         });

//         return (
//             <div className="list">
//                 {todoNodes}
//             </div>
//         );
//     }
// });





ReactDOM.render(<Application />, document.getElementById("content"));