import React, { Component } from 'react';
import './App.css';
import mySocket from "socket.io-client";

class App extends Component {
    constructor(props){
        super(props);
        this.state ={
            myImg:require("./imgs/1.png"),
            myImg2: require("./imgs/2.png"),
            allusers: [],
            myId:null,
            handleImage:""
        }        
    }
    
    componentDidMount(){
            this.socket = mySocket("https://advdyn-1.herokuapp.com/");

            this.socket.on("userjoined", (data)=>{
                this.setState({
                    allusers:data
                })
            });

            this.socket.on("yourid", (data)=>{
            this.setState({
            myId:data
            })
        });
        
        this.socket.on("newmove", (data)=>{
            this.refs["u"+data.id].style.left = data.x+"px";
            this.refs["u"+data.id].style.top = data.y+"px";
            this.refs["u"+data.id].src = data.src;
            
            });
        
        this.refs.thedisplay.addEventListener("mousemove", (ev)=>{
            
            if(this.state.myId === null){
                //FAIL
                return false;
            }
            
            this.refs["u"+this.state.myId].style.left = ev.pageX+"px";
            this.refs["u"+this.state.myId].style.top = ev.pageY+"px";

            this.socket.emit("mymove", {
                x:ev.pageX,
                y:ev.pageY,
                id:this.state.myId,
                src:this.refs['u'+this.state.myId].src
            })
        });
    }
    
    handleImage(evt){
        this.refs["u"+this.state.myId].src = evt.target.src;
    }
    
  render() {
      
     var allimgs = this.state.allusers.map((obj, i)=>{
          return(
            <img ref={"u"+obj} className="allImgs" rc={this.state.myImg} height={50} key={i} />
          )
      });
      
    return (
      <div className="App">
      <div ref="thedisplay" id="display">
        {allimgs}
        <img ref="myImg" id="myImg" src={this.state.myImg} height={50} />
      </div>
      <div id="controls">
        {this.state.myId}
        <img src={this.state.myImg} height={50}/>
        <img src={this.state.myImg2} height={50}/>
      </div>
    </div>    
    );
  }
}

export default App;
