/*********************************** 
          LIBRARY CODE
***********************************/

function createStore(reducer) {
  // STEP 1
  let state;
  let listeners = [];

  // STEP 2
  const getState = () => state;

  // STEP 3
  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  // STEP 4
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

/*********************************** 
          APPLICATION CODE
***********************************/
// INITIALIZE STORE
const store = createStore(app);

store.subscribe( () => {
  const { goals, todos } = store.getState();

  document.getElementById('goalsList').innerHTML = '';
  document.getElementById('todosList').innerHTML = '';

  goals.forEach(addGoalToDom);
  todos.forEach(addTodoToDom)

});

// INITIALIZE ACTION VARIABLES
const ADD_TODO          = 'ADD_TODO';
const REMOVE_TODO       = 'REMOVE_TODO';
const TOGGLE_TODO       = 'TOGGLE_TODO';
const ADD_GOAL          = 'ADD_GOAL';
const REMOVE_GOAL       = 'REMOVE_GOAL';
const TOGGLE_GOAL       = 'TOGGLE_GOAL';


// Actions Creators
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  }
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  }
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  }
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  }
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  }
}

function toggleGoalAction(id) {
  return {
    type: TOGGLE_GOAL,
    id
  }
}

 // Reducer
 function todo_reducer(state = [],action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);

    case REMOVE_TODO:
      return state.filter(( todo ) => todo.id !== action.id );

    case TOGGLE_TODO:
      return state.map( (todo) => todo.id !== action.id ? todo : 
        Object.assign( {}, todo, { complete: !todo.complete} )
      );
    default: 
      return state;
  }
 
}

// Reducer
function goal_reducer(state = [],action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);

    case REMOVE_GOAL:
      return state.filter(( goal ) => goal.id !== action.id );

    case TOGGLE_GOAL:
      return state.map( (goal) => goal.id !== action.id ? goal : 
        Object.assign( {}, goal, { complete: !goal.complete} )
      );
    default: 
      return state;
  }
}

// ROOT REDUCER
function app(state = {},action) {
  return {
    todos: todo_reducer(state.todos, action),
    goals: goal_reducer(state.goals, action)
  };
} 


/*********************************** 
          DOM CODE
***********************************/
function uidGenerator() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// Display Todos
function addTodoToDom(todo) {
  const node = document.createElement('li');
  const text = document.createTextNode(todo.todo);
  
  const removeButton = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
  });

  node.appendChild(text);
  node.appendChild(removeButton);

  node.style.textDecoration = todo.complete ? 'line-through' : 'none';

  node.addEventListener('click', () => {
    // Add Value to state
    store.dispatch(toggleTodoAction(todo.id));
  });

  document.getElementById('todosList').appendChild(node);
};

// Display Goals
function addGoalToDom(goal) {

  const node = document.createElement('li');
  const text = document.createTextNode(goal.goal);const removeButton = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
  });

  node.appendChild(text);
  node.appendChild(removeButton);

  node.style.textDecoration = goal.complete ? 'line-through' : 'none';

  node.addEventListener('click', () => {
    // Add Value to state
    store.dispatch(toggleGoalAction(goal.id));
  });

  document.getElementById('goalsList').appendChild(node);

};

function createRemoveButton(onClick) {
  const removeButton = document.createElement('button');
  console.log(removeButton)
  removeButton.innerHTML ='X';
  removeButton.addEventListener('click', onClick);

  return removeButton;
}

// Add Todo
function addTodo() {
  // Select Input
  const addTodoInput = document.getElementById('addTodoInput');

  // Get value from input
  const todo = addTodoInput.value;

  // Reset input after submit
  addTodoInput.value = '';

  // Add Value to state
  store.dispatch(addTodoAction({
    id: uidGenerator(),
    todo,
    complete: false
  }));

  console.log('Todo added to store');

}

// Add Goal
function addGoal() {
  const addGoalInput = document.getElementById('addGoalInput');

  const goal = addGoalInput.value;
  addGoalInput.value = '';

  // Add Value to state
  store.dispatch(addGoalAction({
    id: uidGenerator(),
    goal,
    complete: false
  }));

  console.log('Goal added to store');
}



const addTodoButton = document.getElementById('addTodoButton').addEventListener('click', addTodo);

const addGoalButton = document.getElementById('addGoalButton').addEventListener('click', addGoal);

