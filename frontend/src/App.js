import './App.css';
import React,{Component} from 'react';
import Navigation from './components/navigation/Navigation';
// import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Board from './components/LeaderBoard/Board';


const MODEL_ID = 'face-detection';

const returnClarifaiRequestOptions = (imageURL) =>{

	// Your PAT (Personal Access Token) can be found in the portal under Authentification
	const PAT = 'c751a93e87114040825655a9b7c6fd74';

	const USER_ID = 'koushik';       
	const APP_ID = 'test';
	  
	const IMAGE_URL = imageURL;

	const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

	const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
	return requestOptions;
}

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
	  imageURL:'',
	  box:{},
	  route: 'signin',
	  isSignedIn:false,
	  user: {
		email: '',
		id: '',
		name: '',
		entries: 0,
		joined: ''
	  }
    }
  }

  loadUser = (data) => {
	this.setState({user:{
		email: data.email,
		id: data.id,
		name: data.name,
		entries: data.entries,
		joined: data.joined
	}})
  }

  calculateFaceLocation =(data) =>{
	const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
	const image=document.getElementById('inputimage');
	const width=Number(image.width);
	const height=Number(image.height);
	console.log(height,width);
	return {
		leftCol: clarifaiFace.left_col * width,
		topRow: clarifaiFace.top_row * height,
		rightCol: width - (clarifaiFace.right_col * width),
		bottomRow: height - (clarifaiFace.bottom_row * height)
	}
  }

  displayFaceBox = (box) =>{
	console.log(box);
	this.setState({box:box});
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () =>{
    console.log('click');
    this.setState({imageURL : this.state.input});	
	fetch("https://api.clarifai.com/v2/models/" + MODEL_ID +  "/outputs", returnClarifaiRequestOptions(this.state.input))
        .then(response => response.json())
		.then(response => {
			if(response){
				fetch('http://localhost:3001/image', {
					method:'put',
					headers: {'Content-Type' : 'application/json'},
					body: JSON.stringify({
						id: this.state.user.id
					})
				})
				.then(response => response.json())
				.then(count => {
					this.setState(Object.assign(this.state.user, { entries: count}))
				  })
			
			}
			this.displayFaceBox(this.calculateFaceLocation(response))
			
		})
		
		.catch(error => console.log('error', error));				
	
  }


  onRouteChange = (route) =>{
	if(route==='signout'){
		this.setState({isSignedIn:false})
		this.setState({box:{}})
		this.setState({imageURL:''})
	}
	else if(route==='home'){
		this.setState({isSignedIn:true})
	}
	this.setState({route:route});
  }


  render(){
	const {isSignedIn, route, imageURL , box}=this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
		{ route==='home'
			?
			<div>
				{/* <Logo /> */}
				<Rank name={this.state.user.name} entries={this.state.user.entries}/>
				<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit} />
				<FaceRecognition box={box} imageURL={imageURL}/>
			</div>
			:(
				route==='signin'
				?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
				:(
					route==='board'
					?<Board></Board>
					:<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
				)
			)
			
			
		}
		
      </div>
    );
  }
}

export default App;
