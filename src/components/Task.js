import axios from 'axios';
import React, { Component } from 'react'
import { Button,Card,CardTitle,Col,Label,Modal,ModalBody,ModalHeader,Row,Form,FormGroup,Input } from 'reactstrap';

class Task extends Component {
  constructor(props){
    super(props);

    this.state={
      tasklist:[],
      showcompleted:true,
      show:false,
      isOpen:false,
      title:"",
      description:"",
      completed:false,
      id:0
    }
  }

  componentDidMount(){
    this.getdata()
  }

  getdata=()=>{
    axios.get('https://taskapidrt.herokuapp.com/apitask/')
    .then((response)=>
    this.setState({
      tasklist:response.data
    }))
  }

  handleclick=(event,value)=>{
    event.preventDefault()
    this.setState({
      showcompleted:value,
      show:true
    })
  }

  toggle=()=>{
    this.setState({
      isOpen:!this.state.isOpen
    })
  }

  handlesubmit=(event)=>{
    event.preventDefault()
    this.toggle()
    if(this.state.id){
      axios({
        method:'put',
        url:`https://taskapidrt.herokuapp.com/apitask/${this.state.id}/`,
        data:{
          title:this.state.title,
          description:this.state.description,
          completed:this.state.completed
        }
      }).then(() => this.getdata());

    }
    else{
      axios({
        method:'post',
        url:'https://taskapidrt.herokuapp.com/apitask/',
        data:{
          title:this.state.title,
          description:this.state.description,
          completed:this.state.completed
        }
      }).then(() => this.getdata());
    }
  
  }

  onChangeinput=(event)=>{
    event.preventDefault()
    let name=event.target.name;
    let value=event.target.value;

    if(event.target.type==='checkbox'){
      value=event.target.checked
    }

    this.setState({
      [name]:value
    })
  }

  onEdit=(event,task)=>{
    event.preventDefault()
    console.log(task)
    this.setState({
      title:task.title,
      description:task.description,
      completed:task.completed,
      id:task.id
    })
    this.toggle()
  }

  onAdd=()=>{
    this.setState({
      title:"",
      description:"",
      completed:false,
      id:0
    })
    this.toggle()
  }

  handleDelete=(event,task)=>{
    event.preventDefault()
    axios.delete(`https://taskapidrt.herokuapp.com/apitask/${task.id}/`)
    .then(()=>this.getdata())
  }



  render(){
    const Showtask=()=>{

      let tasks=this.state.tasklist.filter((task)=>{
        return task.completed===this.state.showcompleted
      });
      
      let list=tasks.map((task)=>{
        return(
          <Card id="card2" key={task.id}>
            <Row>
              <Col><CardTitle className={this.state.showcompleted?
              "completed":""}>{task.title}</CardTitle></Col>
              <Col>
                <Button id="btn3" size="sm" onClick={(e)=>this.onEdit(e,task)}>Edit</Button>
              </Col>
              <Col><Button id="btn4" size="sm" className="btn btn-danger" onClick={(e)=>this.handleDelete(e,task)}>Delete</Button></Col>
            </Row>
          </Card>
          // <Card key={task.id}>
          //   <CardTitle>{task.title}</CardTitle>
          // </Card>
        )
      })
      return list
    }

    

    return(
      <div>
        <h1 style={{textAlign:'center'}}>Task Manager</h1>
        <Card id="card1">
          <Button id="addbtn" color="warning" onClick={this.onAdd}>Add Task</Button>
          <br/><br/>
          <div className="row">

            <Button id="btn1" color="success"
            onClick={(e)=>this.handleclick(e,true)}>Completed</Button>

            <Button id="btn2" color="info"
            onClick={(e)=>this.handleclick(e,false)}>Incomplete</Button>

          </div>
          <div className="row">
            {this.state.show && <Showtask/>}
          </div>
        </Card>

        <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Task</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handlesubmit}>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input type="text" name="title" id="title"
                value={this.state.title} onChange={this.onChangeinput}
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input type="textarea" name="description"  id="description"
                value={this.state.description} onChange={this.onChangeinput}
                />
              </FormGroup>
              <FormGroup style={{marginLeft:'7px'}} check>
                <Label check>
                  <Input type="checkbox" name="completed" 
                  checked={this.state.completed} onChange={this.onChangeinput}
                  />
                  Completed
                </Label>
              </FormGroup>
              <hr/>
              <Button type="submit" color="primary" size="md" className="submit">Submit</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default Task
