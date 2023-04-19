import React from "react";


export default class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      task: 'didn\'t work',
      status: '',
      priority: 2,
      due: new Date(),
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getData = this.getData.bind(this);
  };

  async getData() {
    await fetch('https://localhost:8080/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept":"application/json"
      },
    })
      .then(console.log('fetching'))
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          task: data.task,
          status: data.status,
          priority: data.priority,
          due: data.due,
        });
      })
      .then(console.log('fetching done'))
      .catch(err => console.log(err))
      .then(console.log(this.state.task))
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    fetch('/post', {
      method: 'POST',
      body: JSON.stringify(this.state)
    }).then(function(response) {
      console.log(response);
      return response.json();
    });
  }

  render() {
   return (
    <>
      {/* {this.state.task} */}
      <form onSubmit={this.handleSubmit}>
        <label>
          Task:
          <input type="text" value={this.state.value} name="task" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <button onClick={this.getData}>Get Data</button>
    </>
   )
  }
 }